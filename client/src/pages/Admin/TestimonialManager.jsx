import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TestimonialManager.module.css';

const TestimonialManager = () => {
  const [form, setForm] = useState({ name: '', role: '', message: '' });
  const [testimonials, setTestimonials] = useState([]);
  const token = localStorage.getItem('adminToken');

  const fetchTestimonials = async () => {
    const res = await fetch('https://skiply.onrender.com/api/testimonials');
    const data = await res.json();
    setTestimonials(data);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('https://skiply.onrender.com/api/testimonials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      setForm({ name: '', role: '', message: '' });
      fetchTestimonials();
    } else {
      alert('Failed to submit testimonial');
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`https://skiply.onrender.com/api/testimonials/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (res.ok) fetchTestimonials();
    else alert('Failed to delete testimonial');
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={styles.heading}>💬 Manage Testimonials</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className={styles.input}
          required
        />
        <input
          name="role"
          value={form.role}
          onChange={handleChange}
          placeholder="Role (e.g., Student)"
          className={styles.input}
          required
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Message"
          className={styles.input}
          rows="3"
          required
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          className={styles.button}
          type="submit"
        >
          Add Testimonial
        </motion.button>
      </form>

      <ul className={styles.testimonialList}>
        <AnimatePresence>
          {testimonials.map((t) => (
            <motion.li
              key={t._id}
              className={styles.item}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <strong>{t.name}</strong> ({t.role}): {t.message}
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={styles.deleteBtn}
                onClick={() => handleDelete(t._id)}
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

export default TestimonialManager;
