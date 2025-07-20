import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('https://skiply.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setError('Invalid credentials. Please try again.');
        } else if (res.status === 404) {
          setError('No user found. Please register.');
        } else {
          setError(data.message || 'Login failed');
        }
        return;
      }

      if (data.user.role === 'admin') {

        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentInfo');

        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminInfo', JSON.stringify(data.user));



        navigate('/admin/dashboard');
      } else {
        setError('Not authorized as admin.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div style={container}>
      <h2 style={title}>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={input}
          required
        />
        <button type="submit" style={button}>Login</button>
      </form>

      {error && <p style={errorStyle}>{error}</p>}

      <p style={registerPrompt}>
        Not registered? <Link to="/admin/register" style={linkStyle}>Register here</Link>
      </p>
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
  cursor: 'pointer'
};
const errorStyle = {
  color: 'red',
  marginTop: '10px',
  textAlign: 'center',
  fontSize: '14px'
};
const registerPrompt = {
  marginTop: '20px',
  textAlign: 'center',
  fontSize: '14px'
};
const linkStyle = {
  color: '#5C6BC0',
  fontWeight: 'bold',
  textDecoration: 'none'
};

export default AdminLogin;
