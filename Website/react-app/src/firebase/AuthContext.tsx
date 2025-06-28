import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './config';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  clearSessionHistory: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  logout: async () => {},
  clearSessionHistory: () => {},
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
      localStorage.removeItem('currentUser');
      localStorage.removeItem('sessionTimestamp');
      localStorage.removeItem('authToken');
      // Signal other tabs to logout
      localStorage.setItem('logout-event', Date.now().toString());
      localStorage.removeItem('logout-event');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
      if (firebaseUser) {
        // Sync to localStorage for legacy code
        localStorage.setItem('currentUser', JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email,
          photoURL: firebaseUser.photoURL
        }));
        // Set session timestamp
        localStorage.setItem('sessionTimestamp', Date.now().toString());
      } else {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionTimestamp');
        // Clear any cached authentication data
        clearSessionHistory();
      }
    });
    return () => unsubscribe();
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
      await signOut(auth);
      setUser(null);
      clearSessionHistory();
      
      // Force navigation and prevent back button access
      window.history.replaceState(null, '', '/');
      window.location.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if signOut fails, clear local state and redirect
      setUser(null);
      clearSessionHistory();
      window.location.replace('/');
    }
  };

  const isAuthenticated = !!user && !isLoading;

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated,
      logout,
      clearSessionHistory
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 