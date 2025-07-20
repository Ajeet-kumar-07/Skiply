import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './StudentRegister.module.css';

const StudentRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    year: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userExists, setUserExists] = useState(false);

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUserExists(false);

    try {
      const res = await fetch('https://skiply.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'student' })
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message === 'User already exists') {
          setError('User already exists.');
          setUserExists(true);
        } else {
          setError(data.message || 'Registration failed');
        }
        return;
      }

      setSuccess('Registration successful! Redirecting...');

      // Optional: Auto-login
      const loginRes = await fetch('https://skiply.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });

      const loginData = await loginRes.json();

      if (loginRes.ok) {
        localStorage.setItem('studentToken', loginData.token);
        window.location.href = '/student/dashboard';
      } else {
        setError('Registered but auto-login failed. Please login manually.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('studentToken')) {
      navigate('/student/dashboard');
    }
  }, [navigate]);

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className={styles.title}>Student Registration</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} className={styles.input} required />
        <input name="email" placeholder="Email" onChange={handleChange} className={styles.input} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className={styles.input} required />
        <input name="department" placeholder="Department" onChange={handleChange} className={styles.input} required />
        <input name="year" placeholder="Year" onChange={handleChange} className={styles.input} required />

        <motion.button
          type="submit"
          className={styles.motionBtn}
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          Register
        </motion.button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {userExists && (
        <motion.button
          onClick={() => navigate('/student/login')}
          className={styles.motionBtn}
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          Login Instead
        </motion.button>
      )}

      {success && <p className={styles.success}>{success}</p>}
    </motion.div>
  );
};

export default StudentRegister;
