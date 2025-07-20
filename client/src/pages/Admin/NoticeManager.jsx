import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './NoticeManager.module.css';

const NoticeManager = () => {
  const [message, setMessage] = useState('');
  const [notices, setNotices] = useState([]);
  const token = localStorage.getItem('adminToken');

  const fetchNotices = async () => {
    try {
      const res = await fetch('https://skiply.onrender.com/api/notices');
      const data = await res.json();
      setNotices(data);
    } catch (err) {
      console.error('Error fetching notices:', err);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://skiply.onrender.com/api/notices/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });

      if (res.ok) {
        setMessage('');
        fetchNotices();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to post notice');
      }
    } catch (err) {
      console.error('POST error:', err);
      alert('Server error while posting notice');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://skiply.onrender.com/api/notices/admin/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        fetchNotices();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete notice');
      }
    } catch (err) {
      console.error('DELETE error:', err);
      alert('Server error while deleting notice');
    }
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={styles.heading}>📌 Manage Notices</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter notice message"
          className={styles.input}
          required
          rows="3"
        />
        <motion.button
          type="submit"
          className={styles.button}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
        >
          Post Notice
        </motion.button>
      </form>

      <ul className={styles.list}>
        <AnimatePresence>
          {notices.map((n) => (
            <motion.li
              key={n._id}
              className={styles.item}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <span>{n.message}</span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={styles.delBtn}
                onClick={() => handleDelete(n._id)}
              >
                Delete
              </motion.button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
};

export default NoticeManager;
