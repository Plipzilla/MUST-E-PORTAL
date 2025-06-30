import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AuthService, { User } from '../services/AuthService';
import { history } from '../services/history';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  logout: () => Promise<void>;
  clearSessionHistory: () => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => ({} as User),
  logout: async () => {},
  clearSessionHistory: () => {},
  hasRole: () => false,
  hasPermission: () => false,
  isAdmin: () => false,
  refreshUser: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Session timeout (30 minutes of inactivity)
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  const clearSessionHistory = (signalOtherTabs: boolean = false) => {
    console.log('🔍 CLEAR DEBUG - clearSessionHistory() called, signalOtherTabs:', signalOtherTabs);
    console.trace('🔍 CLEAR DEBUG - Stack trace:');
    
    // Clear browser history to prevent back button access
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      // Replace current history entry
      window.history.replaceState(null, '', window.location.pathname);
      // Clear session storage
      sessionStorage.clear();
      // Clear any auth-related localStorage items
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('sessionTimestamp');
      localStorage.removeItem('currentUser'); // Legacy compatibility
      localStorage.removeItem('authToken'); // Legacy compatibility
      
      // Only signal other tabs to logout when explicitly requested (during actual logout)
      if (signalOtherTabs) {
        console.log('🔍 CLEAR DEBUG - Signaling other tabs to logout');
        localStorage.setItem('logout-event', Date.now().toString());
        localStorage.removeItem('logout-event');
      }
    }
  };

  // Initialize auth state on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔍 INIT DEBUG - initializeAuth() started');
      
      try {
        const currentUser = AuthService.getCurrentUser();
        const isAuthenticated = AuthService.isAuthenticated();
        
        console.log('🔍 INIT DEBUG - currentUser:', currentUser);
        console.log('🔍 INIT DEBUG - isAuthenticated:', isAuthenticated);
        
        if (currentUser && isAuthenticated) {
          console.log('🔍 INIT DEBUG - User found and authenticated, setting user state');
          // Set user immediately to prevent loss during refresh
          setUser(currentUser);
          
          // Set session timestamp
          localStorage.setItem('sessionTimestamp', Date.now().toString());
          
          // Sync to localStorage for legacy code compatibility
          localStorage.setItem('currentUser', JSON.stringify({
            uid: currentUser.id.toString(),
            email: currentUser.email,
            name: currentUser.name,
            photoURL: null
          }));
          
          // Try to refresh user data in background (non-blocking)
          try {
            const refreshedUser = await AuthService.refreshUser();
            setUser(refreshedUser);
            
            // Update legacy localStorage after successful refresh
            localStorage.setItem('currentUser', JSON.stringify({
              uid: refreshedUser.id.toString(),
              email: refreshedUser.email,
              name: refreshedUser.name,
              photoURL: null
            }));
          } catch (error) {
            console.error('Failed to refresh user data (using cached):', error);
            // Don't clear auth state on refresh failure - use cached user data
            // Only clear if the cached user data is actually invalid
          }
        } else {
          console.log('🔍 INIT DEBUG - No user or not authenticated, but NOT clearing session (could be race condition)');
          setUser(null);
          // DON'T clear session history during initialization - could be race condition
          // Only clear if we're really sure there's no valid session
        }
      } catch (error) {
        console.error('🚨 INIT DEBUG - Auth initialization error:', error);
        setUser(null);
        // DON'T clear session history on initialization errors - could be temporary
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Check for session timeout
  useEffect(() => {
    if (!user) return;

    const checkSessionTimeout = () => {
      const sessionTimestamp = localStorage.getItem('sessionTimestamp');
      console.log('🔍 SESSION DEBUG - Checking session timeout');
      console.log('🔍 SESSION DEBUG - sessionTimestamp:', sessionTimestamp);
      
      if (sessionTimestamp) {
        const now = Date.now();
        const sessionAge = now - parseInt(sessionTimestamp);
        console.log('🔍 SESSION DEBUG - Session age (ms):', sessionAge);
        console.log('🔍 SESSION DEBUG - Session timeout limit (ms):', SESSION_TIMEOUT);
        
        if (sessionAge > SESSION_TIMEOUT) {
          console.warn('🚨 SESSION DEBUG - Session expired due to inactivity, logging out');
          logout();
        } else {
          console.log('✅ SESSION DEBUG - Session is valid');
        }
      } else {
        console.log('⚠️ SESSION DEBUG - No session timestamp found, setting current timestamp');
        // Don't logout if there's no timestamp - just set one (user might be logging in)
        localStorage.setItem('sessionTimestamp', Date.now().toString());
      }
    };

    // Enhanced security: Check for token tampering
    const checkTokenIntegrity = () => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user');
      
      console.log('🔍 TOKEN DEBUG - Checking token integrity');
      console.log('🔍 TOKEN DEBUG - Has token:', !!token);
      console.log('🔍 TOKEN DEBUG - Has user data:', !!userData);
      
      if (token && userData) {
        try {
          JSON.parse(userData); // Validate user data integrity
          console.log('✅ TOKEN DEBUG - Token integrity check passed');
        } catch (error) {
          console.error('🚨 TOKEN DEBUG - Token integrity check failed - user data corrupted');
          // Only logout if we're sure the data is corrupted, not just missing
          if (userData && userData.length > 0) {
            logout();
          }
        }
      } else {
        console.log('⚠️ TOKEN DEBUG - Missing token or user data (might be logging in)');
        // Don't logout immediately - user might be in the process of logging in
      }
    };

    // Don't check immediately on mount to avoid interfering with login
    // Wait a bit before running security checks
    const initialDelay = setTimeout(() => {
      checkSessionTimeout();
      checkTokenIntegrity();
    }, 2000); // 2 second delay

    const interval = setInterval(() => {
      checkSessionTimeout();
      checkTokenIntegrity();
    }, 60000);
    
    // Update session timestamp on user activity
    const updateSessionTimestamp = () => {
      if (user) {
        localStorage.setItem('sessionTimestamp', Date.now().toString());
      }
    };

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateSessionTimestamp, true);
    });

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
      events.forEach(event => {
        document.removeEventListener(event, updateSessionTimestamp, true);
      });
    };
  }, [user, SESSION_TIMEOUT]);

  // Storage listener for cross-tab logout synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' && e.newValue === null) {
        console.log('🔄 AUTH DEBUG - Token removed in another tab, logging out');
        setUser(null);
        clearSessionHistory();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = async () => {
    console.log('🚨 LOGOUT DEBUG - logout() called');
    console.trace('🚨 LOGOUT DEBUG - Stack trace:');
    
    try {
      await AuthService.logout();
      setUser(null);
      clearSessionHistory(true); // Signal other tabs during actual logout
      
      // Use React Router navigation instead of window.location to prevent page refresh
      window.history.replaceState(null, '', '/');
      // Note: Navigation will be handled by the component that calls logout
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state and redirect
      setUser(null);
      clearSessionHistory(true); // Signal other tabs during actual logout
      // Note: Navigation will be handled by the component that calls logout
    }
  };

  const hasRole = (role: string): boolean => {
    // Use AuthContext's user state directly instead of delegating to AuthService
    console.log('🔍 AUTH CONTEXT - hasRole called with:', role);
    console.log('🔍 AUTH CONTEXT - Current user:', user);
    console.log('🔍 AUTH CONTEXT - User roles:', user?.roles);
    
    if (!user?.roles) {
      console.log('🔍 AUTH CONTEXT - No roles found, returning false');
      return false;
    }
    
    const hasRole = user.roles.some((userRole: any) => 
      userRole.name === role || userRole === role
    );
    console.log('🔍 AUTH CONTEXT - hasRole result:', hasRole);
    return hasRole;
  };

  const hasPermission = (permission: string): boolean => {
    // Use AuthContext's user state directly instead of delegating to AuthService
    return user?.permissions?.includes(permission) || false;
  };

  const isAdmin = (): boolean => {
    // Use AuthContext's user state directly instead of delegating to AuthService
    console.log('🔍 AUTH CONTEXT - isAdmin() called');
    const result = hasRole('admin');
    console.log('🔍 AUTH CONTEXT - isAdmin() result:', result);
    return result;
  };

  const login = async (credentials: { email: string; password: string }): Promise<User> => {
    try {
      const response = await AuthService.login(credentials);
      const { user } = response;
      
      // Ensure user data is fully stored before setting state
      localStorage.setItem('sessionTimestamp', Date.now().toString());
      localStorage.setItem('currentUser', JSON.stringify({
        uid: user.id.toString(),
        email: user.email,
        name: user.name,
        photoURL: null
      }));
      
      // Update state after storage is complete
      setUser(user);
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const refreshedUser = await AuthService.refreshUser();
      setUser(refreshedUser);
      
      // Update legacy localStorage for compatibility
      localStorage.setItem('currentUser', JSON.stringify({
        uid: refreshedUser.id.toString(),
        email: refreshedUser.email,
        name: refreshedUser.name,
        photoURL: null
      }));
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  };

  const isAuthenticated = !!user && !isLoading && AuthService.isAuthenticated();

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated,
      login,
      logout,
      clearSessionHistory,
      hasRole,
      hasPermission,
      isAdmin,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 