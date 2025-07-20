import React, { useEffect, useState } from 'react';

const LeaveRequests = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('https://skiply.onrender.com/api/leave/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setRequests(data);
      } else {
        console.error('Expected array but got:', data);
      }
      console.log('admin token' , token);
      console.log('recieved data' , data);
    } catch (err) {
      console.error('Error fetching leave requests:', err);
    }
  };

  useEffect(() => {
    console.log('fetching req')
    fetchRequests();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`https://skiply.onrender.com/api/leave/approve/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        fetchRequests(); // refresh the list
      } else {
        console.error('Status update failed');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto' }}>
      <h2 style={{ color: '#5C6BC0', marginBottom: '20px' }}>All Leave Requests</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th style={th}>Name</th>
            <th style={th}>Reason</th>
            <th style={th}>From</th>
            <th style={th}>To</th>
            <th style={th}>Status</th>
            <th style={th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req._id}>
              <td style={td}>{req.student?.name || 'Unknown'}</td>
              <td style={td}>{req.reason || '—'}</td>
              <td style={td}>{formatDate(req.fromDate || req.from)}</td>
              <td style={td}>{formatDate(req.toDate || req.to)}</td>
              <td style={td}>
                <span style={{ color: getStatusColor(req.status), fontWeight: 600 }}>
                  {capitalize(req.status)}
                </span>
              </td>
              <td style={td}>
                {req.status === 'pending' ? (
                  <>
                    <button onClick={() => updateStatus(req._id, 'approved')} style={btnApprove}>
                      Approve
                    </button>
                    <button onClick={() => updateStatus(req._id, 'rejected')} style={btnReject}>
                      Reject
                    </button>
                  </>
                ) : (
                  <em>No Action</em>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Helpers
const formatDate = (dateStr) =>
  dateStr ? new Date(dateStr).toISOString().split('T')[0] : '—';

const capitalize = (text) => text?.charAt(0).toUpperCase() + text?.slice(1).toLowerCase();

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'approved': return 'green';
    case 'rejected': return 'red';
    case 'pending': return '#FF9800';
    default: return '#333';
  }
};

// Styles
const th = {
  padding: '12px',
  borderBottom: '1px solid #ccc',
  textAlign: 'left'
};

const td = {
  padding: '12px',
  borderBottom: '1px solid #eee'
};

const btnApprove = {
  marginRight: '10px',
  padding: '6px 12px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

const btnReject = {
  padding: '6px 12px',
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default LeaveRequests;
