# 🔧 Backend - Job Portal API

Express.js REST API server for the Job Portal application. Handles authentication, job management, application processing, and admin operations.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Middleware](#middleware)
- [Error Handling](#error-handling)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Overview

The backend server provides:
- **RESTful API** for job listings and applications
- **JWT Authentication** for admin access
- **File Upload** management for application documents
- **Database Integration** with MongoDB
- **Email Notifications** via Nodemailer
- **Rate Limiting** for API protection
- **CORS Support** for frontend communication

**Server Port:** `5000` (configurable)

---

## 🛠️ Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | v14+ |
| Framework | Express.js | ^4.18.2 |
| Database | MongoDB | Cloud or Local |
| ODM | Mongoose | ^8.3.2 |
| Authentication | JWT | ^9.0.2 |
| Password Hashing | bcryptjs | ^2.4.3 |
| File Upload | Multer | ^1.4.5-lts.1 |
| Email | Nodemailer | ^6.9.13 |
| CORS | cors | ^2.8.5 |
| Rate Limiting | express-rate-limit | ^7.2.0 |
| Dev Tools | Nodemon | ^3.1.0 |

---

## 📁 Project Structure

```
backend/
├── middleware/
│   ├── auth.js                 # JWT authentication middleware
│   └── upload.js               # Multer file upload configuration
│
├── models/
│   ├── Admin.js                # Admin schema & model
│   ├── Job.js                  # Job posting schema & model
│   └── Application.js          # Job application schema & model
│
├── routes/
│   ├── admin.js                # Admin endpoints
│   ├── jobs.js                 # Job management endpoints
│   └── applications.js         # Application submission & retrieval
│
├── uploads/                    # Directory for uploaded files
│
├── server.js                   # Main server entry point
├── seed.js                     # Database seeding script
├── .env                        # Environment variables (create this)
├── package.json                # Dependencies & scripts
└── README.md                   # This file
```

---

## 📦 Installation

### Prerequisites
- Node.js v14 or higher
- npm or yarn
- MongoDB (local or Atlas)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create `.env` File
```bash
# In the backend directory, create a .env file with:
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jobportal
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Step 3: Initialize Database
```bash
npm run seed
```

---

## 🔐 Environment Setup

Create a `.env` file in the backend directory with these variables:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/jobportal

# JWT Configuration
JWT_SECRET=your-secret-key-min-32-characters-recommended

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173

# Email Configuration (Optional - for Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_SERVICE=gmail

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=AdminPassword123
```

---

## 🎮 Running the Server

### Development Mode (with Auto-reload)
```bash
npm run dev
```
Uses Nodemon to automatically restart on file changes.

### Production Mode
```bash
npm start
```

### Database Seeding
```bash
npm run seed
```
Populates the database with sample jobs and admin data.

---

## 🔌 API Endpoints

### Jobs Endpoints (`/api/jobs`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ❌ | Get all active jobs (with filters) |
| POST | `/` | ✅ | Create new job (admin only) |
| PATCH | `/:id` | ✅ | Update job details (admin only) |
| DELETE | `/:id` | ✅ | Delete/deactivate job (admin only) |
| GET | `/:id` | ❌ | Get single job details |

**Example Requests:**

Get all jobs:
```bash
curl http://localhost:5000/api/jobs
```

Filter by department:
```bash
curl "http://localhost:5000/api/jobs?department=Engineering"
```

Create job (requires JWT):
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Software Engineer",
    "department": "Engineering",
    "location": "New York",
    "description": "We are hiring...",
    "requirements": ["Node.js", "React"],
    "salary": "$100,000 - $150,000"
  }'
```

---

### Applications Endpoints (`/api/applications`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ❌ | Submit new application |
| GET | `/` | ✅ | Get all applications (admin only) |
| GET | `/:id` | ✅ | Get single application (admin only) |
| PATCH | `/:id/status` | ✅ | Update application status (admin only) |
| DELETE | `/:id` | ✅ | Delete application (admin only) |

**Example Requests:**

Submit application:
```bash
curl -X POST http://localhost:5000/api/applications \
  -F "jobId=<job-id>" \
  -F "fullName=John Doe" \
  -F "email=john@example.com" \
  -F "phone=1234567890" \
  -F "education=Bachelor in CS" \
  -F "experience=3" \
  -F "skills=Node.js,React" \
  -F "resume=@resume.pdf" \
  -F "coverLetter=@letter.pdf"
```

Get all applications:
```bash
curl -X GET http://localhost:5000/api/applications \
  -H "Authorization: Bearer <jwt-token>"
```

---

### Admin Endpoints (`/api/admin`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/login` | ❌ | Admin login |
| GET | `/dashboard` | ✅ | Get dashboard statistics |
| POST | `/logout` | ✅ | Admin logout |

**Login Example:**
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPassword123"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

---

## 💾 Database Models

### Admin Model
```javascript
{
  email: String (unique),
  password: String (hashed with bcrypt),
  createdAt: Date,
  updatedAt: Date
}
```

### Job Model
```javascript
{
  title: String (required),
  department: String (required),
  location: String (default: "Remote"),
  type: String (Full-time, Part-time, Internship, Contract),
  experienceLevel: String,
  description: String,
  requirements: [String],
  salary: String,
  isActive: Boolean (default: true),
  postedBy: ObjectId (ref: Admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Application Model
```javascript
{
  jobId: ObjectId (ref: Job),
  fullName: String,
  email: String,
  phone: String,
  location: String,
  education: String,
  yearsOfExperience: Number,
  skills: [String],
  resumeUrl: String,
  coverLetterUrl: String,
  additionalNotes: String,
  status: String (Applied, Reviewing, Interview, Rejected, Hired),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Middleware

### Authentication Middleware (`middleware/auth.js`)
- Verifies JWT tokens in request headers
- Attaches admin info to request object
- Returns 401 Unauthorized if token is invalid

**Usage:**
```javascript
const auth = require('./middleware/auth');
router.post('/protected', auth, (req, res) => {
  // req.admin contains authenticated user info
});
```

### Upload Middleware (`middleware/upload.js`)
- Handles file uploads using Multer
- Supports PDF, DOC, DOCX for resumes/covers
- Stores files in `uploads/` directory
- Max file size: 5MB

**Usage:**
```javascript
const upload = require('./middleware/upload');
router.post('/submit', upload.single('resume'), handler);
```

---

## ⚠️ Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "error": "Error details (development only)"
}
```

### Common HTTP Status Codes
- **200** - Success
- **201** - Created
- **400** - Bad Request (invalid input)
- **401** - Unauthorized (missing/invalid JWT)
- **403** - Forbidden (no permission)
- **404** - Not Found
- **500** - Server Error

---

## 🆘 Troubleshooting

### MongoDB Connection Error
```
❌ MongoDB error: MongoServerError
```
**Solution:** Check your MONGO_URI in `.env` file is correct and MongoDB is running.

### JWT Errors
```
Error: jwt malformed / jwt expired
```
**Solution:** Ensure JWT_SECRET is set in .env and tokens are passed in Authorization header.

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change PORT in `.env` or kill the process using port 5000:
```bash
# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### File Upload Issues
```
Error: ENOENT: no such file or directory, open 'uploads'
```
**Solution:** Create the `uploads/` directory:
```bash
mkdir uploads
```

### CORS Errors
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:** Ensure CLIENT_URL in `.env` matches your frontend URL.

---

## 📝 Scripts

```json
{
  "start": "node server.js",           // Run production server
  "dev": "nodemon server.js",          // Run with auto-reload
  "seed": "node seed.js"               // Seed database
}
```

---

## 🔗 Related Documentation

- [Frontend README](../frontend/README.md)
- [Root README](../README.md)
- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT Guide](https://jwt.io/)

---

**Last Updated:** 2024
**Version:** 1.0.0
