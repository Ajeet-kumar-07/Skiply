import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './StudentLogin.module.css';
const StudentLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('https://skiply.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      if (data.user.role !== 'student') {
        setError('This is not a student account!');
        return;
      }

      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');

      localStorage.setItem('studentToken', data.token);
      localStorage.setItem('studentInfo', JSON.stringify(data.user));
      navigate('/student/dashboard');
    } catch (err) {
      setError('Server error, please try again');
    }
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className={styles.title}>Student Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className={styles.input}
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className={styles.input}
          required
        />
        <motion.button
          type="submit"
          className={styles.motionBtn}
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          Login
        </motion.button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      <p className={styles.link}>
        Not registered?{' '}
        <Link to="/student/register" style={{ color: '#5C6BC0' }}>
          Register here
        </Link>
      </p>
    </motion.div>
  );
};

export default StudentLogin;
