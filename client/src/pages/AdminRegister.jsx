import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [userExists, setUserExists] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setUserExists(false);
    setError('');
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPassword = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setUserExists(false);

    // 🔒 Client-side validations
    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!isValidPassword(formData.password)) {
      setError('Password must be at least 6 characters and contain letters and numbers.');
      return;
    }

    try {
      const res = await fetch('https://skiply.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message?.toLowerCase().includes('already')) {
          setUserExists(true);
        } else {
          setError(data.message || 'Registration failed');
        }
        return;
      }

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminInfo', JSON.stringify(data.user));
      toast.success('Registration successful!', { autoClose: 2000 });

      // Navigate after toast finishes
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  return (
    <div style={container}>
      <h2 style={title}>Admin Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          style={input}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          value={formData.email}
          onChange={handleChange}
          style={input}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={input}
          required
        />

        {userExists ? (
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <p style={{ color: '#FF5722' }}>User already exists.</p>
            <Link to="/admin/login" style={loginButton}>Login Instead</Link>
          </div>
        ) : (
          error && <p style={errorStyle}>{error}</p>
        )}

        <button type="submit" style={button}>Register</button>
      </form>

      <p style={bottomLine}>
        Already have an account? <Link to="/admin/login" style={linkStyle}>Login here</Link>
      </p>

      <ToastContainer position="top-right" />
    </div>
  );
};

// Styles
const container = { maxWidth: '400px', margin: '60px auto', padding: '20px' };
const title = { textAlign: 'center', color: '#5C6BC0', marginBottom: '20px' };
const input = {
  width: '100%',
  padding: '12px 16px',
  margin: '10px 0',
  border: '1px solid #ccc',
  borderRadius: '8px'
};
const button = {
  padding: '12px 20px',
  backgroundColor: '#5C6BC0',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  width: '100%',
  cursor: 'pointer',
  marginTop: '10px'
};
const errorStyle = {
  color: 'crimson',
  textAlign: 'center',
  marginTop: '10px'
};
const loginButton = {
  display: 'inline-block',
  marginTop: '10px',
  padding: '8px 16px',
  backgroundColor: '#3949AB',
  color: 'white',
  borderRadius: '6px',
  textDecoration: 'none'
};
const bottomLine = {
  textAlign: 'center',
  marginTop: '20px',
  fontSize: '14px'
};
const linkStyle = {
  color: '#5C6BC0',
  fontWeight: 'bold',
  textDecoration: 'none',
  marginLeft: '4px'
};

export default AdminRegister;
