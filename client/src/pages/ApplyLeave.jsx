import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ApplyLeave = () => {
  const [form, setForm] = useState({ from: '', to: '', reason: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('studentToken');
      const res = await fetch('https://skiply.onrender.com/api/leave/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to apply for leave');
        return;
      }

      setSuccess('✅ Leave applied successfully!');
      setForm({ from: '', to: '', reason: '' });
    } catch (err) {
      setError('⚠️ Server error. Please try again later.');
    }
  };

  return (
    <div style={container}>
      <h2 style={heading}>📝 Apply for Leave</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="from"
          type="date"
          value={form.from}
          onChange={handleChange}
          style={input}
          required
        />
        <input
          name="to"
          type="date"
          value={form.to}
          onChange={handleChange}
          style={input}
          required
        />
        <textarea
          name="reason"
          placeholder="Enter reason for leave..."
          value={form.reason}
          onChange={handleChange}
          rows={4}
          style={{ ...input, resize: 'vertical' }}
          required
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
          type="submit"
          style={button}
        >
          🚀 Submit
        </motion.button>
      </form>

      {success && <p style={successMsg}>{success}</p>}
      {error && <p style={errorMsg}>{error}</p>}
    </div>
  );
};

// Styles
const container = {
  maxWidth: '500px',
  margin: '60px auto',
  padding: '20px',
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)',
};

const heading = {
  color: '#5C6BC0',
  marginBottom: '20px',
  textAlign: 'center',
};

const input = {
  width: '100%',
  padding: '12px 14px',
  margin: '10px 0',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '15px',
  outline: 'none',
};

const button = {
  width: '100%',
  padding: '12px',
  marginTop: '10px',
  background: '#5C6BC0',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer',
};

const successMsg = {
  color: 'green',
  marginTop: '12px',
  textAlign: 'center',
};

const errorMsg = {
  color: 'crimson',
  marginTop: '12px',
  textAlign: 'center',
};

export default ApplyLeave;
