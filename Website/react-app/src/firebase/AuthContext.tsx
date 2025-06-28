import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthService, { User } from '../services/AuthService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  clearSessionHistory: () => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  isReviewer: () => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  logout: async () => {},
  clearSessionHistory: () => {},
  hasRole: () => false,
  hasPermission: () => false,
  isAdmin: () => false,
  isReviewer: () => false,
  refreshUser: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Session timeout (30 minutes of inactivity)
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  const clearSessionHistory = () => {
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
      // Signal other tabs to logout
      localStorage.setItem('logout-event', Date.now().toString());
      localStorage.removeItem('logout-event');
    }
  };

  // Initialize auth state on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser && AuthService.isAuthenticated()) {
          // Try to refresh user data to ensure it's current
          try {
            const refreshedUser = await AuthService.refreshUser();
            setUser(refreshedUser);
            
            // Set session timestamp
            localStorage.setItem('sessionTimestamp', Date.now().toString());
            
            // Sync to localStorage for legacy code compatibility
            localStorage.setItem('currentUser', JSON.stringify({
              uid: refreshedUser.id.toString(),
              email: refreshedUser.email,
              name: refreshedUser.name,
              photoURL: null
            }));
          } catch (error) {
            console.error('Failed to refresh user data:', error);
            // If refresh fails, clear auth state
            await AuthService.logout();
            setUser(null);
            clearSessionHistory();
          }
        } else {
          setUser(null);
          clearSessionHistory();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        clearSessionHistory();
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
      if (sessionTimestamp) {
        const now = Date.now();
        const sessionAge = now - parseInt(sessionTimestamp);
        if (sessionAge > SESSION_TIMEOUT) {
          logout();
        }
      }
    };

    // Check immediately and then every minute
    checkSessionTimeout();
    const interval = setInterval(checkSessionTimeout, 60000);
    
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
      clearInterval(interval);
      events.forEach(event => {
        document.removeEventListener(event, updateSessionTimestamp, true);
      });
    };
  }, [user, SESSION_TIMEOUT]);

  // Listen for logout events from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'logout-event') {
        // Another tab logged out, force logout in this tab
        setUser(null);
        clearSessionHistory();
        window.location.replace('/');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      clearSessionHistory();
      
      // Force navigation and prevent back button access
      window.history.replaceState(null, '', '/');
      window.location.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state and redirect
      setUser(null);
      clearSessionHistory();
      window.location.replace('/');
    }
  };

  const hasRole = (role: string): boolean => {
    return AuthService.hasRole(role);
  };

  const hasPermission = (permission: string): boolean => {
    return AuthService.hasPermission(permission);
  };

  const isAdmin = (): boolean => {
    return AuthService.isAdmin();
  };

  const isReviewer = (): boolean => {
    return AuthService.isReviewer();
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
      logout,
      clearSessionHistory,
      hasRole,
      hasPermission,
      isAdmin,
      isReviewer,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 