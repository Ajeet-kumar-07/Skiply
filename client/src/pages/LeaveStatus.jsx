import React, { useEffect, useState } from 'react';

const LeaveStatus = () => {
  const [latestLeave, setLatestLeave] = useState(null);
  const [loading,setLoading] = useState(true);

  

  const fetchLeaveStatus = async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const res = await fetch('https://skiply.onrender.com/api/leave/status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        // Sort by createdAt descending, take the most recent
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLatestLeave(sorted[0]);
      } else {
        setLatestLeave(null);
      }
    } catch (err) {
      console.error('Error fetching leave status:', err);
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveStatus();
  }, []);

  if(loading) return <p>loading leave status...</p>
  if(!latestLeave) return <p>no Leave request found</p>

  const isDark = typeof document !== 'undefined' && document.body.classList.contains('dark-mode');

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', textAlign: 'center' }}>
      <h2 style={{ color: isDark ? '#90caf9' : '#5C6BC0' }}>Current Leave Status</h2>

      {latestLeave ? (
        <div style={{ ...cardStyle, background: isDark ? '#23272b' : '#fff', color: isDark ? '#e0e0e0' : '#222' }}>
          <p><strong>Reason:</strong> {latestLeave.reason || '—'}</p>
          <p><strong>From:</strong> {formatDate(latestLeave.fromDate || latestLeave.from)}</p>
          <p><strong>To:</strong> {formatDate(latestLeave.toDate || latestLeave.to)}</p>
          <p><strong>Status:</strong> <span style={getStatusStyle(latestLeave.status)}>{capitalize(latestLeave.status)}</span></p>
        </div>
      ) : (
        <p style={{ marginTop: '30px', color: '#888' }}>No leave request found.</p>
      )}
    </div>
  );
};

// Helper functions
const formatDate = (dateStr) =>
  dateStr ? new Date(dateStr).toISOString().split('T')[0] : '—';

const capitalize = (s) => s?.charAt(0).toUpperCase() + s?.slice(1).toLowerCase();

const getStatusStyle = (status) => {
  const color = {
    approved: 'green',
    pending: '#FF9800',
    rejected: '#f44336'
  }[status?.toLowerCase()] || '#333';

  return { color, fontWeight: 'bold' };
};

// Styles
const cardStyle = {
  marginTop: '30px',
  background: '#fff',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  textAlign: 'left'
};

export default LeaveStatus;
