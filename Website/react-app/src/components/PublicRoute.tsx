import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, redirectTo = '/dashboard' }) => {
  const { user, isLoading, isAuthenticated, clearSessionHistory } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Prevent back button access to auth pages when logged in
    const handlePopState = (event: PopStateEvent) => {
      if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/signup')) {
        event.preventDefault();
        window.history.pushState(null, '', redirectTo);
        window.location.replace(redirectTo);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated, location.pathname, redirectTo]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && user) {
    // Clear any stale session data
    clearSessionHistory();
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute; 