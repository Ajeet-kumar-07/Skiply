import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../assets/css/AdminDashboard.module.css';

const AdminDashboard = () => {
  const [summary, setSummary] = useState({
    totalRequests: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchLeaveStats = async () => {
      try {
        const res = await fetch('https://skiply.onrender.com/api/leave/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();

        const normalizeStatus = (status) => {
          if (!status) return 'pending';
          return status.toLowerCase();
        };

        const counts = {
          totalRequests: data.length,
          approved: data.filter(req => normalizeStatus(req.status) === 'approved').length,
          pending: data.filter(req => normalizeStatus(req.status) === 'pending').length,
          rejected: data.filter(req => normalizeStatus(req.status) === 'rejected').length
        };

        setSummary(counts);
      } catch (err) {
        console.error('Failed to fetch leave summary:', err);
      }
    };

    fetchLeaveStats();
    const interval = setInterval(fetchLeaveStats, 10000); // auto-refresh every 10 seconds
    return () => clearInterval(interval);
  }, [token]);

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className={styles.heading}>Admin Dashboard</h2>

      <div className={styles.grid}>
        {Object.entries(summary).map(([label, value], idx) => (
          <motion.div
            key={idx}
            className={styles.card}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <h3>{label}</h3>
            <p>{value}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
