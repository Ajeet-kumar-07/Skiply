import React, { useEffect, useState } from 'react';
import styles from './StudentProfile.module.css';
import defaultPic from '../assets/avatar.webp';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import bannerImg from '../assets/avatar.webp'; // Use avatar as a placeholder banner

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: '', department: '', year: '', linkedin: '', github: '', phone: '' });
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef();
  const [stats, setStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwdForm, setPwdForm] = useState({ current: '', new: '', confirm: '' });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const token = localStorage.getItem('studentToken');
        if (!token) {
          setError('You are not logged in.');
          return;
        }

        const res = await fetch('https://skiply.onrender.com/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Failed to fetch student profile');
          return;
        }

        setStudent({ ...data.user, isVerified: true, isOnline: true });
        setForm({
          name: data.user.name,
          department: data.user.department,
          year: data.user.year,
          linkedin: data.user.linkedin || '',
          github: data.user.github || '',
          phone: data.user.phone || ''
        });
      } catch (err) {
        setError('Server error. Please try again.');
      }
    };

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('studentToken');
        const res = await fetch('https://skiply.onrender.com/api/student/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setStats(data);
      } catch {}
    };

    const fetchBadges = async () => {
      try {
        const token = localStorage.getItem('studentToken');
        const res = await fetch('https://skiply.onrender.com/api/student/badges', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setBadges(data);
      } catch {}
    };

    fetchStudentProfile();
    fetchStats();
    fetchBadges();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const res = await fetch('https://skiply.onrender.com/api/auth/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to update profile');
        return;
      }

      setStudent(prev => ({ ...prev, ...form }));
      setIsEditing(false);
    } catch (err) {
      setError('Server error while saving.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    const file = fileInputRef.current.files[0];
    if (!file) return toast.error('Please select an image.');
    const formData = new FormData();
    formData.append('profileImage', file);
    try {
      const token = localStorage.getItem('studentToken');
      const res = await fetch('https://skiply.onrender.com/api/student/upload-profile-image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || 'Upload failed');
      setStudent(prev => ({ ...prev, profileImage: data.profileImage }));
      setPreview(null);
      toast.success('Profile image updated!');
    } catch {
      toast.error('Server error during upload.');
    }
  };

  const handlePwdChange = (e) => {
    const { name, value } = e.target;
    setPwdForm(prev => ({ ...prev, [name]: value }));
  };

  const submitPwdChange = async (e) => {
    e.preventDefault();
    if (pwdForm.new !== pwdForm.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    setPwdLoading(true);
    try {
      const token = localStorage.getItem('studentToken');
      const res = await fetch('https://skiply.onrender.com/api/student/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword: pwdForm.current, newPassword: pwdForm.new })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to change password');
      toast.success('Password changed successfully!');
      setShowPwdModal(false);
      setPwdForm({ current: '', new: '', confirm: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setPwdLoading(false);
    }
  };

  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;
  if (!student) return <p style={{ textAlign: 'center' }}>Loading profile...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.card} style={{ position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}>
        {/* Dark mode toggle on profile */}
        <button
          onClick={() => setDarkMode(dm => !dm)}
          style={{
            position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, zIndex: 2
          }}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? '🌙' : '☀️'}
        </button>
        {/* Banner */}
        <div style={{
          height: 90,
          background: 'linear-gradient(90deg, #5C6BC0 0%, #8e99f3 100%)',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 0
        }}>
          <img src={bannerImg} alt="banner" style={{ opacity: 0.08, width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        {/* Profile image and edit */}
        <div style={{ position: 'relative', display: 'inline-block', marginTop: 50, zIndex: 1 }}>
          <img
            src={preview || student.profileImage || defaultPic}
            alt="Profile"
            className={styles.avatar}
            style={{ border: '4px solid #fff', boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}
          />
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            style={{ marginTop: 8, marginBottom: 8, fontSize: 13, padding: '6px 14px', borderRadius: 8, border: '1px solid #5c6bc0', background: '#f5f8ff', color: '#3E4E88', cursor: 'pointer' }}
            onClick={() => fileInputRef.current.click()}
          >
            {preview ? 'Change Image' : 'Upload Image'}
          </button>
          {preview && (
            <button
              style={{ marginLeft: 8, fontSize: 13, padding: '6px 14px', borderRadius: 8, border: '1px solid #5c6bc0', background: '#5c6bc0', color: '#fff', cursor: 'pointer' }}
              onClick={handleImageUpload}
            >
              Save
            </button>
          )}
          {student.isOnline && (
            <span style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              width: '12px',
              height: '12px',
              backgroundColor: 'limegreen',
              borderRadius: '50%',
              border: '2px solid white',
              boxShadow: '0 0 0 0 limegreen',
              animation: 'pulse 1.5s infinite'
            }}></span>
          )}
        </div>
        {/* Name and email */}
        <h2 className={styles.name} style={{ marginTop: 10 }}>
          {form.name}
          {student.isVerified && (
            <span title="Verified" style={{ marginLeft: '8px', color: 'dodgerblue' }}>✔️</span>
          )}
        </h2>
        <p className={styles.email}>{student.email}</p>
        {/* Personal Stats */}
        {stats && (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, margin: '18px 0 10px 0' }}>
            <div style={{ flex: 1, background: '#f5f8ff', borderRadius: 10, padding: 14, textAlign: 'center', boxShadow: '0 2px 8px rgba(92,107,192,0.07)' }}>
              <div style={{ fontSize: 15, color: '#5C6BC0', fontWeight: 600 }}>Leaves Taken</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{stats.totalLeaves}</div>
            </div>
            <div style={{ flex: 1, background: '#f5f8ff', borderRadius: 10, padding: 14, textAlign: 'center', boxShadow: '0 2px 8px rgba(92,107,192,0.07)' }}>
              <div style={{ fontSize: 15, color: '#5C6BC0', fontWeight: 600 }}>Attendance %</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{stats.attendance}%</div>
            </div>
            <div style={{ flex: 1, background: '#f5f8ff', borderRadius: 10, padding: 14, textAlign: 'center', boxShadow: '0 2px 8px rgba(92,107,192,0.07)' }}>
              <div style={{ fontSize: 15, color: '#5C6BC0', fontWeight: 600 }}>Last Login</div>
              <div style={{ fontSize: 15 }}>{stats.lastLogin ? new Date(stats.lastLogin).toLocaleString() : '-'}</div>
            </div>
          </div>
        )}
        {/* Badges */}
        {badges.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 18, margin: '10px 0 18px 0' }}>
            {badges.map(badge => (
              <span
                key={badge.key}
                title={badge.description}
                style={{ fontSize: 32, cursor: 'pointer', filter: 'drop-shadow(0 2px 6px rgba(92,107,192,0.10))' }}
              >
                {badge.key === 'perfect' && '🏅'}
                {badge.key === 'consistent' && '🌟'}
                {badge.key === 'top3' && '🥇'}
                <span style={{ display: 'block', fontSize: 12, color: '#5C6BC0', marginTop: 2 }}>{badge.label}</span>
              </span>
            ))}
          </div>
        )}

        <div className={styles.info}>
          {isEditing ? (
            <>
              <p><strong>Name:</strong> <input name="name" value={form.name} onChange={handleInputChange} /></p>
              <p><strong>Department:</strong> <input name="department" value={form.department} onChange={handleInputChange} /></p>
              <p><strong>Year:</strong> <input name="year" value={form.year} onChange={handleInputChange} /></p>
              <p><strong>LinkedIn:</strong> <input name="linkedin" value={form.linkedin} onChange={handleInputChange} placeholder="LinkedIn URL" /></p>
              <p><strong>GitHub:</strong> <input name="github" value={form.github} onChange={handleInputChange} placeholder="GitHub URL" /></p>
              <p><strong>Phone:</strong> <input name="phone" value={form.phone} onChange={handleInputChange} placeholder="Phone number" /></p>
            </>
          ) : (
            <>
              <p><strong>Department:</strong> {form.department}</p>
              <p><strong>Year:</strong> {form.year}</p>
              {form.linkedin && (
                <p><strong>LinkedIn:</strong> <a href={form.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#0A66C2' }}>🔗 Profile</a></p>
              )}
              {form.github && (
                <p><strong>GitHub:</strong> <a href={form.github} target="_blank" rel="noopener noreferrer" style={{ color: '#333' }}>🐙 Repo</a></p>
              )}
              {form.phone && (
                <p><strong>Phone:</strong> <span style={{ color: '#5C6BC0' }}>{form.phone}</span></p>
              )}
            </>
          )}
        </div>

        <div style={{ marginTop: '15px' }}>
          <button onClick={handleEditToggle} className={styles.editBtn}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
          {isEditing && (
            <button onClick={handleSave} className={styles.saveBtn}>
              Save Changes
            </button>
          )}
          <button
            style={{ marginLeft: 10, background: '#fff', color: '#5C6BC0', border: '1px solid #5C6BC0', borderRadius: 8, padding: '7px 16px', fontWeight: 500, cursor: 'pointer' }}
            onClick={() => setShowPwdModal(true)}
          >
            Change Password
          </button>
        </div>
        {/* Password Change Modal */}
        {showPwdModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
          }} onClick={() => setShowPwdModal(false)}>
            <form
              onClick={e => e.stopPropagation()}
              onSubmit={submitPwdChange}
              style={{ background: '#fff', borderRadius: 14, padding: 32, minWidth: 320, boxShadow: '0 8px 32px rgba(0,0,0,0.13)', position: 'relative' }}
            >
              <button type="button" onClick={() => setShowPwdModal(false)} style={{ position: 'absolute', top: 10, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>×</button>
              <h3 style={{ color: '#5C6BC0', marginBottom: 18 }}>Change Password</h3>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 500 }}>Current Password</label><br />
                <input type="password" name="current" value={pwdForm.current} onChange={handlePwdChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 500 }}>New Password</label><br />
                <input type="password" name="new" value={pwdForm.new} onChange={handlePwdChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 500 }}>Confirm New Password</label><br />
                <input type="password" name="confirm" value={pwdForm.confirm} onChange={handlePwdChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              </div>
              <button type="submit" disabled={pwdLoading} style={{ background: '#5C6BC0', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
                {pwdLoading ? 'Saving...' : 'Change Password'}
              </button>
            </form>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 limegreen;
          }
          70% {
            transform: scale(1.1);
            box-shadow: 0 0 0 6px rgba(50, 205, 50, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(50, 205, 50, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default StudentProfile;
