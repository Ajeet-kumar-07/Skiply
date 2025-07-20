import React, { useEffect, useState } from 'react';

const StudentLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('studentToken');
        const res = await fetch('https://skiply.onrender.com/api/student/leaderboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setLeaderboard(data);
      } catch {
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const isDark = typeof document !== 'undefined' && document.body.classList.contains('dark-mode');

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', background: isDark ? '#23272b' : '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', padding: 32, color: isDark ? '#e0e0e0' : '#222' }}>
      <h2 style={{ textAlign: 'center', color: isDark ? '#90caf9' : '#5C6BC0', marginBottom: 18 }}>🏆 Top 10 Students (Fewest Leaves)</h2>
      {loading ? <p>Loading...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: isDark ? '#23272b' : '#fff', color: isDark ? '#e0e0e0' : '#222' }}>
          <thead>
            <tr style={{ background: isDark ? '#181a1b' : '#f4f4f4' }}>
              <th style={{ padding: 8 }}>Rank</th>
              <th style={{ padding: 8 }}>Name</th>
              <th style={{ padding: 8 }}>Department</th>
              <th style={{ padding: 8 }}>Year</th>
              <th style={{ padding: 8 }}>Leaves</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, idx) => (
              <tr key={entry.student?._id || idx} style={{ background: idx < 3 ? (isDark ? '#263238' : '#e3f2fd') : (isDark ? '#23272b' : 'white') }}>
                <td style={{ padding: 8, fontWeight: 'bold' }}>{idx + 1}</td>
                <td style={{ padding: 8 }}>{entry.student?.name || '-'}</td>
                <td style={{ padding: 8 }}>{entry.student?.department || '-'}</td>
                <td style={{ padding: 8 }}>{entry.student?.year || '-'}</td>
                <td style={{ padding: 8 }}>{entry.leaveCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentLeaderboard; 