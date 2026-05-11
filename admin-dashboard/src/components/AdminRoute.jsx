import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token || role !== 'ADMIN') {
    // Nếu không có token hoặc không phải admin, đẩy về login
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
