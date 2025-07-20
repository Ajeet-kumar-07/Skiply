import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../assets/css/StudentList.module.css';

const StudentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('https://skiply.onrender.com/api/admin/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const toggleFeeStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`https://skiply.onrender.com/api/admin/fee/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ feesPaid: !currentStatus })
      });

      if (res.ok) {
        fetchStudents(); // refresh list
      } else {
        console.error('Failed to update fee status');
      }
    } catch (err) {
      console.error('Error updating fee status:', err);
    }
  };

  const filteredStudents = students.filter((student) =>
    Object.values(student)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className={styles.heading}>Registered Students</h2>

      <input
        type="text"
        placeholder="Search by name, email or department..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      {loading ? (
        <p style={{ textAlign: 'center', padding: '20px', color: '#999' }}>Loading students...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Year</th>
              <th>Fee Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, idx) => (
                <tr key={student._id || idx}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.department}</td>
                  <td>{student.year}</td>
                  <td className={student.feesPaid ? styles.statusPaid : styles.statusUnpaid}>
                    {student.feesPaid ? 'Paid ✅' : 'Unpaid ❌'}
                  </td>
                  <td>
                    <motion.button
                      onClick={() => toggleFeeStatus(student._id, student.feesPaid)}
                      className={styles.btn}
                      style={{
                        backgroundColor: student.feesPaid ? '#f44336' : '#4CAF50',
                      }}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.03 }}
                    >
                      Mark as {student.feesPaid ? 'Unpaid' : 'Paid'}
                    </motion.button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                  No matching students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </motion.div>
  );
};

export default StudentList;
