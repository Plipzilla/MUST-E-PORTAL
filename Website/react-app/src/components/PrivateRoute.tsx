import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';

const PrivateRoute: React.FC = () => {
  const { user, isLoading, isAuthenticated, clearSessionHistory } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Prevent back button access to protected routes after logout
    const handlePopState = (event: PopStateEvent) => {
      if (!isAuthenticated) {
        event.preventDefault();
        clearSessionHistory();
        window.location.replace('/login');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated, clearSessionHistory]);

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

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute; 