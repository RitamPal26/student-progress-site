# Student Progress Management System

A comprehensive MERN stack application designed for tracking competitive programming students' progress on Codeforces. This system automates data synchronization, provides interactive analytics, and manages email reminders for inactive students.

## 🎯 Overview

This application streamlines the management of competitive programming students by automatically fetching their Codeforces data, analyzing their performance through interactive charts and metrics, and sending automated reminders to encourage consistent practice.

## ✨ Key Features

### 📊 Student Management
- **Complete CRUD Operations**: Add, edit, delete, and view student records
- **Real-time Data Sync**: Automatic Codeforces integration with manual sync option
- **CSV Export**: Download complete student data for external analysis
- **Search & Filter**: Quick student lookup with sorting capabilities

### 📈 Analytics Dashboard
- **Contest History**: Interactive line charts showing rating progression over time
- **Problem-Solving Metrics**: Total solved, average rating, difficulty analysis
- **Submission Heatmap**: Visual representation of daily coding activity
- **Rating Distribution**: Bar charts categorizing problems by difficulty buckets
- **Flexible Time Filters**: 7/30/90/365-day views for all analytics

### 🔄 Automation Features
- **Nightly Data Sync**: Automated Codeforces data refresh at 2 AM
- **Inactivity Detection**: Identifies students with no submissions in 7+ days
- **Email Reminders**: Automated motivational emails for inactive students
- **Configurable Notifications**: Per-student email preference controls

### 🎨 User Experience
- **Dark/Light Theme**: Toggle between themes with persistent preference
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Material-UI components with smooth animations
- **Error Handling**: Comprehensive error states and user feedback

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Material-UI (MUI)** - Professional component library
- **Recharts** - Interactive data visualization
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling

### Automation & Services
- **node-cron** - Scheduled task management
- **Nodemailer** - Email service integration
- **Codeforces API** - Real-time competitive programming data

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or Atlas cloud)
- Gmail account with App Password (for email features)

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your environment variables in .env
# MONGODB_URI=mongodb://localhost:27017/student-progress
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-16-digit-app-password

# Start the development server
npm run dev
```

### Frontend Setup
```bash
# Navigate to frontend directory (in new terminal)
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000


## 📁 Project Structure

```
student-progress-management/
├── backend/
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── services/         # Business logic
│   ├── jobs/            # Cron job definitions
│   ├── scripts/         # Database utilities
│   └── index.js         # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API communication
│   │   ├── theme/       # UI theme configuration
│   │   └── App.js       # Main application
│   └── public/          # Static assets
├── .env.example         # Environment template
└── README.md           # Project documentation
```

## 🔧 Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/student-progress

# Server
PORT=5000
NODE_ENV=development

# Email Service (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password

```

## 📊 API Endpoints

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students |
| POST | `/api/students` | Create new student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |
| POST | `/api/students/:id/sync` | Sync Codeforces data |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/data/contests/:id` | Get contest history |
| GET | `/api/data/submissions/:id` | Get submission data |
| GET | `/api/summary/problems/:id` | Get problem-solving metrics |

## 🎥 Demo Video

[Watch the full demonstration](your-video-link-here)

The demo showcases:
- Student CRUD operations with real-time sync
- Interactive analytics and filtering
- Dark/light theme switching
- Mobile responsiveness
- Email reminder system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ritam Pal**
- GitHub: [@RitamPal26](https://github.com/RitamPal26)
- Email: ritampal26@gmail.com

## 🙏 Acknowledgments

- [Codeforces](https://codeforces.com) for providing the competitive programming API
- [TLE Eliminators](https://www.tle-eliminators.com) for the project inspiration



