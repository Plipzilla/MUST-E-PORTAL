import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = () => {
  // Check localStorage for currentUser (can be replaced with Firebase Auth state)
  const user = localStorage.getItem('currentUser');
  return !!user;
};

const PrivateRoute: React.FC = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute; 