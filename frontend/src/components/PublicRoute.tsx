import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  // Determine appropriate redirect based on user role
  const getRedirectPath = () => {
    if (!user) return '/dashboard';
    
    if (isAdmin()) return '/admin';
    return '/dashboard';
  };

  const redirectTo = getRedirectPath();

  useEffect(() => {
    // Prevent back button access to auth pages when logged in
    const handlePopState = (event: PopStateEvent) => {
      if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/signup')) {
        console.log('🔍 PUBLIC ROUTE DEBUG - Preventing back button access to auth pages');
        event.preventDefault();
        window.history.pushState(null, '', redirectTo);
        // Use React Router navigation instead of window.location to prevent page refresh
        // The component will handle the redirect through the return statement below
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

  // Redirect authenticated users away from auth pages to their appropriate dashboard
  if (isAuthenticated && user) {
    console.log('🔍 PUBLIC ROUTE DEBUG - Authenticated user detected, redirecting to:', redirectTo);
    // Don't clear session data - just redirect! The session is valid and needed.
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute; 