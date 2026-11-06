import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ adminOnly = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin → show 403 page
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
