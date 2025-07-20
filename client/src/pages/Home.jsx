import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Home.module.css';

const Home = () => {
  const [notices, setNotices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    // Fetch notices
    const fetchNotices = async () => {
      try {
        const res = await fetch('https://skiply.onrender.com/api/notices');
        const data = await res.json();
        setNotices(data);
      } catch {
        console.error('Failed to fetch notices');
      }
    };

    // Fetch testimonials
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('https://skiply.onrender.com/api/testimonials');
        const data = await res.json();
        setTestimonials(data);
      } catch {
        console.error('Failed to fetch testimonials');
      }
    };

    fetchNotices();
    fetchTestimonials();
  }, []);

  // Carousel rotation
  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials]);

  return (
    <div className={styles.container}>
      {/* Hero */}
      <motion.section className={styles.hero} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <h1>Welcome to <span>Skiply</span></h1>
        <p>A smart leave management system for students and administrators to streamline leave approvals.</p>
      </motion.section>

      {/* Features */}
      <motion.section className={styles.features} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
        <h2>Why Skiply?</h2>
        <div className={styles.featureGrid}>
          {['Easy Application', 'Real-time Status', 'Secure System'].map((title, i) => (
            <motion.div className={styles.card} key={i} whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
              <h3>{title}</h3>
              <p>{i === 0 ? 'Apply for leave in a few clicks.' : i === 1 ? 'Track leave status live.' : 'Role-based secure access.'}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Notice Board */}
      <motion.section className={styles.notice} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
        <h2>📌 Notice Board</h2>
        <ul>
          {notices.length ? (
            notices.map((note, i) => <li key={i}>{note.message}</li>)
          ) : (
            <li>Loading notices...</li>
          )}
        </ul>
      </motion.section>

      {/* Testimonials Carousel */}
      <motion.section className={styles.testimonials} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
        <h2>🙌 What Students Say</h2>
        <div className={styles.testimonialGrid}>
          <AnimatePresence mode="wait">
            {testimonials.length > 0 && (
              <motion.div
                key={currentTestimonial}
                className={styles.testimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <p>"{testimonials[currentTestimonial].message}"</p>
                <strong>- {testimonials[currentTestimonial].name}, {testimonials[currentTestimonial].role}</strong>
              </motion.div>
            )}
            {testimonials.length === 0 && <p>Loading testimonials...</p>}
          </AnimatePresence>

        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section className={styles.faq} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
        <h2>❓ Frequently Asked Questions</h2>
        <details>
          <summary>Who can approve my leave?</summary>
          <p>Only registered admin/staff can review and approve your leave application.</p>
        </details>
        <details>
          <summary>Can I edit my application after submitting?</summary>
          <p>No, but you can cancel it and submit again if it hasn't been reviewed.</p>
        </details>
      </motion.section>
    </div>
  );
};

export default Home;
