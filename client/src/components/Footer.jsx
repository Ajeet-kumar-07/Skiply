import React from 'react';
import styles from './Footer.module.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.columns}>
        {/* About */}
        <div className={styles.col}>
          <h3>Skiply</h3>
          <p>A modern student leave management system for colleges and universities.</p>
        </div>

        {/* Navigation */}
        <div className={styles.col}>
          <h4>Navigation</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/student/status">Leave Status</Link></li>
            <li><Link to="/student/history">Leave History</Link></li>
            <li><Link to="/admin">Admin Dashboard</Link></li>
            {/* <li><Link to="/contact">Contact Us</Link></li> */}
          </ul>
        </div>

        {/* Contact */}
        <div className={styles.col}>
          <h4>Contact Us</h4>
          <p>Email: jatwarajeet3@gmail.com</p>
          <p>Phone: +91-9131421359</p>
          <div className={styles.socials}>
            <a href="https://github.com/Ajeet-kumar-07" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/ajeet-kumar-a31445208/" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        © {new Date().getFullYear()} Skiply. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
