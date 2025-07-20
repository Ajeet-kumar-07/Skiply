import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RequireStudentOnly = ({ children }) => {
  const [redirect, setRedirect] = useState(false);
  const studentToken = localStorage.getItem('studentToken');
  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
    if (adminToken) {
      toast.warn('Admins are not allowed to access student section.', {
        autoClose: 2000,
        position: 'top-center'
      });
      setTimeout(() => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
        setRedirect(true);
      }, 120000);
    }
  }, [adminToken]);

  if (redirect) return <Navigate to="/student/login" />;
  if (!studentToken) return <Navigate to="/student/login" />;
  return children;
};

export default RequireStudentOnly;
