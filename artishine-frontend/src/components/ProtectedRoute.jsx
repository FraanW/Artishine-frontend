import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // If no token, redirect to home page
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  // If token exists, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;