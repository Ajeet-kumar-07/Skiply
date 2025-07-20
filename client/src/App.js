import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import LeaveHistory from './pages/LeaveHistory';
import LeaveStatus from './pages/LeaveStatus';
import AdminDashboard from './pages/AdminDashboard';
import StudentList from './pages/StudentList';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminLayout from './pages/AdminLayout';
import LeaveRequests from './pages/LeaveRequests';
import StudentLogin from './pages/StudentLogin';
import StudentRegister from './pages/StudentRegister';
import StudentDashboard from './pages/StudentDashboard';
import ApplyLeave from './pages/ApplyLeave';
import StudentProfile from './pages/StudentProfile';
import NoticeManager from './pages/Admin/NoticeManager';
import TestimonialManager from './pages/Admin/TestimonialManager';
import StudentFeesStatus from './pages/StudentFeesStatus';
import StudentLeaderboard from './pages/StudentLeaderboard';

import RequireStudentOnly from './components/RequireStudentOnly';
import RequireAdminOnly from './components/RequireAdminOnly';
import CustomCursor from './pages/CustomCurser';

function App() {
  return (
    <Router>
      <Navbar />
      <CustomCursor/>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* Protected Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <RequireStudentOnly>
              <StudentDashboard />
            </RequireStudentOnly>
          }
        />
        <Route
          path="/student/apply"
          element={
            <RequireStudentOnly>
              <ApplyLeave />
            </RequireStudentOnly>
          }
        />
        <Route
          path="/student/profile"
          element={
            <RequireStudentOnly>
              <StudentProfile />
            </RequireStudentOnly>
          }
        />
        <Route
          path="/student/status"
          element={
            <RequireStudentOnly>
              <LeaveStatus />
            </RequireStudentOnly>
          }
        />
        <Route
          path="/student/leave-history"
          element={
            <RequireStudentOnly>
              <LeaveHistory />
            </RequireStudentOnly>
          }
        />
        <Route
          path="/student/leaderboard"
          element={
            <RequireStudentOnly>
              <StudentLeaderboard />
            </RequireStudentOnly>
          }
        />

        {/* Protected Admin Routes (with nested layout) */}
        <Route
          path="/admin"
          element={
            <RequireAdminOnly>
              <AdminLayout />
            </RequireAdminOnly>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<StudentList />} />
          <Route path="requests" element={<LeaveRequests />} />
          <Route path="notices" element={<NoticeManager />} />
          <Route path="testimonials" element={<TestimonialManager />} />
        </Route>
      </Routes>

      <Footer />
      <ToastContainer position="top-center" autoClose={3000} />
    </Router>
  );
}

export default App;
