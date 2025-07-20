import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RequireAdminOnly = ({ children }) => {
  const [redirect, setRedirect] = useState(false);
  const adminToken = localStorage.getItem('adminToken');
  const studentToken = localStorage.getItem('studentToken');

  useEffect(() => {
    if (studentToken) {
      toast.warn('Students are not allowed to access admin section.', {
        autoClose: 2000,
        position: 'top-center'
      });
      setTimeout(() => {
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentInfo');
        setRedirect(true);
      }, 120000);
    }
  }, [studentToken]);

  if (redirect) return <Navigate to="/admin/login" />;
  if (!adminToken) return <Navigate to="/admin/login" />;
  return children;
};

export default RequireAdminOnly;
