import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const session = localStorage.getItem('user_session');
  
  if (!session) {
    // If no session exists in localStorage, redirect to /login
    return <Navigate to="/login" replace />;
  }

  try {
    const parsedSession = JSON.parse(session);
    if (!parsedSession.token) {
      // If there is no token in the session, redirect to /login
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    // Invalid JSON session
    localStorage.removeItem('user_session');
    return <Navigate to="/login" replace />;
  }

  // Session is present and valid, render children components
  return children;
};

export default ProtectedRoute;
