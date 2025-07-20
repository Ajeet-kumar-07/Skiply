import React, { useEffect, useState } from 'react';

const StudentFeesStatus = () => {
  const [feesPaid, setFeesPaid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    const fetchFeesStatus = async () => {
      const token = localStorage.getItem('studentToken');
      const res = await fetch('https://skiply.onrender.com/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      setFeesPaid(data.user?.feesPaid);
      setStudentName(data.user?.name || 'Student');
      setLoading(false);
    };

    fetchFeesStatus();
  }, []);

  if (loading) return <p>Checking your status... 💰</p>;

  const isDark = typeof document !== 'undefined' && document.body.classList.contains('dark-mode');

  return (
    <div style={{ ...box }}>
      <h2 style={{ color: isDark ? '#90caf9' : '#5C6BC0' }}>🎓 Hello, {studentName}!</h2>
      <div style={{ ...card, background: isDark ? '#23272b' : '#fff', color: isDark ? '#e0e0e0' : '#222' }}>
        <h3>📢 Your Fees Status:</h3>
        {feesPaid ? (
          <div style={success}>
            <p>✅ Paid</p>
            <p>🎉 You're all set to access your perks!</p>
            <progress value="100" max="100" style={progress}></progress>
          </div>
        ) : (
          <div style={warning}>
            <p>❌ Unpaid</p>
            <p>💡 Don't miss out! Contact admin ASAP!</p>
            <progress value="30" max="100" style={progress}></progress>
          </div>
        )}
      </div>
    </div>
  );
};

// Styles
const box = { maxWidth: '500px', margin: '50px auto', textAlign: 'center' };
const card = { background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const progress = { width: '100%', height: '20px', marginTop: '10px' };
const success = { color: 'green', fontWeight: 'bold' };
const warning = { color: '#FF5722', fontWeight: 'bold' };

export default StudentFeesStatus;
