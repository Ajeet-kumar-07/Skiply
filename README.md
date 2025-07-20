# Skiply - Student Management System

A comprehensive student management system built with React frontend and Node.js backend, featuring leave management, fee tracking, and admin dashboard.

## 🌟 Features

### For Students
- **Student Registration & Login** - Secure authentication system
- **Leave Application** - Submit and track leave requests
- **Fee Status** - View and manage fee payments
- **Profile Management** - Update personal information and profile picture
- **Leaderboard** - View academic rankings and achievements
- **Notifications** - Real-time notifications for leave status updates

### For Administrators
- **Admin Dashboard** - Comprehensive overview of all activities
- **Leave Management** - Approve/reject student leave requests
- **Student Management** - View and manage all student records
- **Notice Management** - Create and publish announcements
- **Testimonial Management** - Manage student testimonials
- **Fee Management** - Track and update student fee status

## 🚀 Live Demo

- **Frontend**: [Deployed on Render](https://skiplyy.onrender.com/)
- **Backend API**: [https://skiply.onrender.com](https://skiply.onrender.com)

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Client-side routing
- **React Toastify** - Notifications
- **Framer Motion** - Animations
- **CSS Modules** - Styled components

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Multer** - File uploads

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skiply_copy
   ```

2. **Install dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the server directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update` - Update user profile

### Leave Management
- `POST /api/leave/apply` - Apply for leave
- `GET /api/leave/status` - Get leave status
- `GET /api/leave/all` - Get all leave requests (admin)
- `PUT /api/leave/approve/:id` - Approve/reject leave

### Student Management
- `GET /api/admin/students` - Get all students
- `PUT /api/admin/fee/:id` - Update fee status
- `GET /api/student/stats` - Get student statistics
- `GET /api/student/leaderboard` - Get leaderboard

### Notices & Testimonials
- `GET /api/notices` - Get all notices
- `POST /api/notices/admin` - Create notice (admin)
- `GET /api/testimonials` - Get testimonials

##  Project Structure

```
skiply_copy/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── assets/        # Static assets
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── server.js         # Main server file
└── README.md
```

##  Deployment

### Backend Deployment (Render)
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

### Frontend Deployment (Render)
1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Set build command: `cd client && npm install && npm run build`
4. Set publish directory: `client/build`

## 🔧 Configuration

### Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)

### API Base URL
The frontend is configured to use the deployed backend at `https://skiply.onrender.com`. For local development, change the API URLs in the frontend code to `http://localhost:5000`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Ajeet Kumar** - *Initial work* - [YourGitHub](https://github.com/Ajeet-kumar-07)

## 🙏 Acknowledgments

- React.js community
- Node.js community
- MongoDB Atlas for database hosting
- Render for deployment services

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the development team.

---

**Note**: This is a student project for educational purposes. Please ensure proper security measures are implemented before using in production environments.
