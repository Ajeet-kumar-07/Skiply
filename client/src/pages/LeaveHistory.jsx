import React, { useEffect, useState } from 'react';

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const res = await fetch('https://skiply.onrender.com/api/leave/status', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setLeaves(data);
      } else {
        console.error('Error:', data.message);
      }
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const isDark = typeof document !== 'undefined' && document.body.classList.contains('dark-mode');

  return (
    <div style={container}>
      <h2 style={{ ...title, color: isDark ? '#90caf9' : '#5C6BC0' }}>📜 Leave History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : leaves.length === 0 ? (
        <p style={noDataText}>No leave records found.</p>
      ) : (
        <div style={{ ...card, background: isDark ? '#23272b' : '#fff', color: isDark ? '#e0e0e0' : '#222' }}>
          <table style={{ ...table, background: isDark ? '#23272b' : '#fff', color: isDark ? '#e0e0e0' : '#222' }}>
            <thead>
              <tr style={{ ...th, background: isDark ? '#181a1b' : '#f4f6fa', color: isDark ? '#90caf9' : '#333' }}>
                <th style={th}>From</th>
                <th style={th}>To</th>
                <th style={th}>Reason</th>
                <th style={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave, idx) => (
                <tr key={idx} style={idx % 2 === 0 ? (isDark ? { backgroundColor: '#23272b' } : rowEven) : (isDark ? { backgroundColor: '#181a1b' } : rowOdd)}>
                  <td style={td}>{formatDate(leave.from)}</td>
                  <td style={td}>{formatDate(leave.to)}</td>
                  <td style={td}>{leave.reason || '—'}</td>
                  <td style={td}>
                    <span style={getStatusStyle(leave.status)}>
                      {capitalize(leave.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Helpers
const formatDate = (dateStr) =>
  dateStr ? new Date(dateStr).toISOString().split('T')[0] : '—';

const capitalize = (text) =>
  text?.charAt(0).toUpperCase() + text?.slice(1).toLowerCase();

const getStatusStyle = (status) => {
  const base = {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    display: 'inline-block',
    textTransform: 'capitalize'
  };

  switch (status.toLowerCase()) {
    case 'approved':
      return { ...base, backgroundColor: '#d4edda', color: '#155724' };
    case 'pending':
      return { ...base, backgroundColor: '#fff3cd', color: '#856404' };
    case 'rejected':
      return { ...base, backgroundColor: '#f8d7da', color: '#721c24' };
    default:
      return { ...base, backgroundColor: '#eee', color: '#333' };
  }
};

// Styles
const container = { maxWidth: '800px', margin: '60px auto', padding: '0 20px' };
const title = { color: '#5C6BC0', marginBottom: '20px', textAlign: 'center' };
const noDataText = { color: '#999', textAlign: 'center' };

const card = {
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  overflow: 'hidden'
};

const table = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '16px'
};

const th = {
  padding: '14px',
  backgroundColor: '#f4f6fa',
  borderBottom: '1px solid #ddd',
  textAlign: 'left',
  color: '#333'
};

const td = {
  padding: '14px',
  borderBottom: '1px solid #eee',
  color: '#444'
};

const rowEven = { backgroundColor: '#fafafa' };
const rowOdd = { backgroundColor: '#fff' };

export default LeaveHistory;
