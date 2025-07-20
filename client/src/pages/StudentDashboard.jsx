import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../assets/css/StudentDashboards.module.css';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('studentInfo');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      window.location.href = '/student/login';
    }
  }, []);

  if (!user) return null;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2>Welcome, {user.name} 👋</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Department:</strong> {user.department}</p>
      <p><strong>Year:</strong> {user.year}</p>

      <div className={styles.grid}>
        <Link to="/student/apply" className={styles.card}>✍️ Apply Leave</Link>
        <Link to="/student/status" className={styles.card}>📄 Leave Status</Link>
      </div>
      <motion.button
        onClick={() => {
          localStorage.removeItem('studentToken');
          localStorage.removeItem('studentInfo');
          window.location.href = '/student/login';
        }}
        className={styles.motionBtn}
        whileTap={{ scale: 0.93 }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        🚪 Logout
      </motion.button>
    </motion.div>
  );
};

export default StudentDashboard;
