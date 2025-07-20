import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';


const handleLogout = () => {
  localStorage.removeItem('adminToken');
  window.location.href = '/admin/login';
};


const AdminLayout = () => {
  const { pathname } = useLocation();
  const isDark = typeof document !== 'undefined' && document.body.classList.contains('dark-mode');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ ...sidebarStyle, background: isDark ? '#23272b' : '#5C6BC0', color: isDark ? '#e0e0e0' : '#fff' }}>
        <h2 style={logoStyle}>Admin Panel</h2>
        <nav style={navStyle}>
          <Link to="/admin/dashboard" style={getLinkStyle(pathname, '/admin/dashboard', isDark)}>Dashboard</Link>
          <Link to="/admin/students" style={getLinkStyle(pathname, '/admin/students', isDark)}>Student List</Link>
          <Link to="/admin/requests" style={getLinkStyle(pathname, '/admin/requests', isDark)}>Leave Requests</Link>
          <Link to="/admin/notices" style={getLinkStyle(pathname, '/admin/notices', isDark)}>Notices</Link>
          <Link to="/admin/testimonials" style={getLinkStyle(pathname, '/admin/testimonials', isDark)}>Testimonials</Link>
        </nav>
        <button onClick={handleLogout} style={logoutButton}>
            Logout
        </button>

      </aside>

      {/* Main Content */}
      <main style={{ ...mainStyle, backgroundColor: isDark ? '#181a1b' : '#f5f5f5', color: isDark ? '#e0e0e0' : '#222' }}>
        <Outlet />
      </main>
    </div>
  );
};

const sidebarStyle = {
  width: '220px',
  background: '#5C6BC0',
  color: '#fff',
  padding: '30px 20px',
  boxShadow: '2px 0 8px rgba(0,0,0,0.05)'
};

const logoStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '30px'
};

const navStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
};

const getLinkStyle = (path, route, isDark) => ({
  color: path === route ? '#FFC107' : (isDark ? '#90caf9' : '#fff'),
  fontWeight: path === route ? '600' : '400',
  textDecoration: 'none',
  padding: '8px 12px',
  borderRadius: '6px',
  backgroundColor: path === route ? (isDark ? '#23272b' : '#ffffff22') : 'transparent',
  transition: 'all 0.3s ease'
});

const mainStyle = {
  flexGrow: 1,
  padding: '40px',
  backgroundColor: '#f5f5f5'
};

const logoutButton = {
  marginTop: '40px',
  padding: '10px 16px',
  backgroundColor: '#f44336',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};


export default AdminLayout;
