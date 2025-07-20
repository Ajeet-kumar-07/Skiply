import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import StudentAvatar from './StudentAvatar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const [studentOpen, setStudentOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastNotifiedIds, setLastNotifiedIds] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  const studentRef = useRef(null);
  const adminRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (studentRef.current && !studentRef.current.contains(e.target)) {
        setStudentOpen(false);
      }
      if (adminRef.current && !adminRef.current.contains(e.target)) {
        setAdminOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Only fetch notifications if student is logged in
    const token = localStorage.getItem('studentToken');
    if (!token) return;
    const fetchNotifications = async () => {
      try {
        const res = await fetch('https://skiply.onrender.com/api/student/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          const unread = data.filter(n => !n.read);
          setUnreadCount(unread.length);
          // Show toast for new unread notifications
          const newIds = unread.map(n => n._id);
          unread.forEach(n => {
            if (!lastNotifiedIds.includes(n._id)) {
              toast.info(n.message, { toastId: n._id });
            }
          });
          setLastNotifiedIds(newIds);
        }
      } catch (err) {
        // Ignore fetch errors
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, [lastNotifiedIds]);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>Skiply</Link>
      <div className={styles.links}>
        <StudentAvatar />
        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(dm => !dm)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, marginRight: 12
          }}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? '🌙' : '☀️'}
        </button>

        {/* Student Dropdown */}
        <div className={styles.dropdownWrapper} ref={studentRef} style={{ position: 'relative' }}>
          <span className={styles.dropdownTrigger}>
            <span
              onClick={() => navigate('/student/dashboard')}
              style={{ marginRight: '6px', cursor: 'pointer' }}
            >
              Student
            </span>
            {/* Notification badge for students */}
            {unreadCount > 0 && (
              <span className={styles.notificationBadge}>{unreadCount}</span>
            )}
            <span
              onClick={() => setStudentOpen(prev => !prev)}
              style={{
                cursor: 'pointer',
                fontSize: '20px',
                display: 'inline-block',
                transform: studentOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }}
            >
              ▾
            </span>
          </span>
          {studentOpen && (
            <div className={styles.dropdown}>
              <Link to="/student/login" onClick={() => setStudentOpen(false)}>Login</Link>
              <Link to="/student/register" onClick={() => setStudentOpen(false)}>Register</Link>
              <Link to="/student/profile" onClick={() => setStudentOpen(false)}>Profile</Link>
              <Link to="/student/status" onClick={() => setStudentOpen(false)}>Leave Status</Link>
              <Link to="/student/leave-history" onClick={() => setStudentOpen(false)}>Leave History</Link>
              <Link to="/student/leaderboard" onClick={() => setStudentOpen(false)}>Leaderboard</Link>
            </div>
          )}
        </div>

        {/* Admin Dropdown */}
        <div className={styles.dropdownWrapper} ref={adminRef}>
          <span className={styles.dropdownTrigger}>
            <span
              onClick={() => navigate('/admin/dashboard')}
              style={{ marginRight: '6px', cursor: 'pointer' }}
            >
              Admin
            </span>
            <span
              onClick={() => setAdminOpen(prev => !prev)}
              style={{
                cursor: 'pointer',
                fontSize: '20px',
                display: 'inline-block',
                transform: adminOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }}
            >
              ▾
            </span>
          </span>
          {adminOpen && (
            <div className={styles.dropdown}>
              <Link to="/admin/login" onClick={() => setAdminOpen(false)}>Login</Link>
              <Link to="/admin/register" onClick={() => setAdminOpen(false)}>Register</Link>
              <Link to="/admin/dashboard" onClick={() => setAdminOpen(false)}>Dashboard</Link>
              <Link to="/admin/students" onClick={() => setAdminOpen(false)}>Student List</Link>
              <Link to="/admin/requests" onClick={() => setAdminOpen(false)}>Leave Requests</Link>
              <Link to="/admin/notices" onClick={() => setAdminOpen(false)}>Notices</Link>
              <Link to="/admin/testimonials" onClick={() => setAdminOpen(false)}>Testimonials</Link>
              <Link to="/admin/logout" onClick={() => setAdminOpen(false)}>Logout</Link>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} theme={darkMode ? 'dark' : 'light'} />
    </nav>
  );
};

export default Navbar;
