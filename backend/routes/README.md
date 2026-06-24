# 🛣️ Routes - API Endpoints

Express.js route handlers defining all API endpoints for the Job Portal application.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Admin Routes](#admin-routes)
- [Jobs Routes](#jobs-routes)
- [Applications Routes](#applications-routes)
- [Error Responses](#error-responses)
- [Request/Response Examples](#requestresponse-examples)

---

## 🚀 Overview

API routes are organized by feature:
- **Admin Routes** - Authentication & dashboard
- **Jobs Routes** - Job listings & management
- **Applications Routes** - Application submissions & management

All routes are prefixed with `/api/`:
```
/api/admin/...
/api/jobs/...
/api/applications/...
```

---

## 🔐 Admin Routes

**File:** `admin.js`  
**Base URL:** `/api/admin`

### POST /login
Authenticates admin and returns JWT token.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "AdminPassword123"
}
```

**Response (Success - 200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDY3Yzc4YjM...",
  "admin": {
    "_id": "6067c78b3f1234567890abcd",
    "email": "admin@example.com"
  }
}
```

**Response (Error - 401):**
```json
{
  "message": "Invalid email or password"
}
```

**Usage:**
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPassword123"
  }'
```

---

### GET /dashboard
Retrieves admin dashboard statistics.

**Authentication:** Required (JWT token)

**Response (200):**
```json
{
  "totalJobs": 15,
  "activeJobs": 12,
  "totalApplications": 342,
  "applicationsByStatus": {
    "Applied": 125,
    "Reviewing": 89,
    "Interview": 45,
    "Rejected": 78,
    "Hired": 5
  },
  "applicationsThisMonth": 52,
  "jobsCreatedThisMonth": 3
}
```

**Usage:**
```bash
curl -X GET http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer <jwt-token>"
```

---

### POST /logout
Logs out admin (clears session on frontend).

**Authentication:** Required

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

## 📋 Jobs Routes

**File:** `jobs.js`  
**Base URL:** `/api/jobs`

### GET /
Fetches all active job listings with optional filters.

**Query Parameters:**
| Parameter | Type | Optional | Example |
|-----------|------|----------|---------|
| department | string | ✅ | Engineering, Marketing |
| page | number | ✅ | 1, 2, 3 |
| limit | number | ✅ | 10, 20 |

**Response (200):**
```json
[
  {
    "_id": "6067c78b3f1234567890abce",
    "title": "Senior Software Engineer",
    "department": "Engineering",
    "location": "San Francisco, CA",
    "type": "Full-time",
    "experienceLevel": "Senior",
    "salary": "$150,000 - $200,000",
    "description": "We are looking for...",
    "requirements": ["Node.js", "React", "MongoDB"],
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Usage:**
```bash
# Get all jobs
curl http://localhost:5000/api/jobs

# Filter by department
curl "http://localhost:5000/api/jobs?department=Engineering"

# Pagination
curl "http://localhost:5000/api/jobs?page=1&limit=10"
```

---

### GET /:id
Fetches a single job by ID.

**Response (200):**
```json
{
  "_id": "6067c78b3f1234567890abce",
  "title": "Senior Software Engineer",
  "department": "Engineering",
  "location": "San Francisco, CA",
  "type": "Full-time",
  "experienceLevel": "Senior",
  "description": "...",
  "requirements": ["Node.js", "React", "MongoDB"],
  "salary": "$150,000 - $200,000",
  "isActive": true,
  "postedBy": {
    "_id": "6067c78b3f1234567890abcd",
    "email": "admin@example.com"
  },
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Usage:**
```bash
curl http://localhost:5000/api/jobs/6067c78b3f1234567890abce
```

---

### POST /
Creates a new job listing.

**Authentication:** Required (Admin only)

**Request:**
```json
{
  "title": "Full Stack Developer",
  "department": "Engineering",
  "location": "New York, NY",
  "type": "Full-time",
  "experienceLevel": "Mid-level",
  "description": "Looking for an experienced full stack developer...",
  "requirements": ["JavaScript", "React", "Node.js", "MongoDB"],
  "salary": "$100,000 - $140,000"
}
```

**Response (201):**
```json
{
  "_id": "6067c78b3f1234567890abcf",
  "title": "Full Stack Developer",
  "department": "Engineering",
  "location": "New York, NY",
  "type": "Full-time",
  "experienceLevel": "Mid-level",
  "description": "...",
  "requirements": ["JavaScript", "React", "Node.js", "MongoDB"],
  "salary": "$100,000 - $140,000",
  "isActive": true,
  "postedBy": "6067c78b3f1234567890abcd",
  "createdAt": "2024-01-20T15:45:00.000Z",
  "updatedAt": "2024-01-20T15:45:00.000Z"
}
```

**Usage:**
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Full Stack Developer",
    "department": "Engineering",
    "location": "New York, NY",
    "type": "Full-time",
    "description": "...",
    "requirements": ["JavaScript", "React", "Node.js"],
    "salary": "$100,000 - $140,000"
  }'
```

---

### PATCH /:id
Updates an existing job.

**Authentication:** Required (Admin only)

**Request:**
```json
{
  "title": "Senior Full Stack Developer",
  "salary": "$120,000 - $160,000",
  "isActive": false
}
```

**Response (200):**
```json
{
  "_id": "6067c78b3f1234567890abcf",
  "title": "Senior Full Stack Developer",
  "salary": "$120,000 - $160,000",
  "isActive": false,
  "updatedAt": "2024-01-20T16:00:00.000Z"
}
```

**Usage:**
```bash
curl -X PATCH http://localhost:5000/api/jobs/6067c78b3f1234567890abcf \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "salary": "$120,000 - $160,000"
  }'
```

---

### DELETE /:id
Deletes or deactivates a job.

**Authentication:** Required (Admin only)

**Response (200):**
```json
{
  "message": "Job deleted successfully"
}
```

**Usage:**
```bash
curl -X DELETE http://localhost:5000/api/jobs/6067c78b3f1234567890abcf \
  -H "Authorization: Bearer <jwt-token>"
```

---

## 📝 Applications Routes

**File:** `applications.js`  
**Base URL:** `/api/applications`

### POST /
Submits a new job application.

**Request (Multipart Form):**
```
POST /api/applications HTTP/1.1
Content-Type: multipart/form-data

jobId: 6067c78b3f1234567890abce
fullName: John Doe
email: john@example.com
phone: 555-1234
location: New York, NY
education: Bachelor's in Computer Science
yearsOfExperience: 3
skills: JavaScript,React,Node.js
resume: [file: resume.pdf]
coverLetter: [file: letter.pdf]
additionalNotes: I'm very interested in this position...
```

**Response (201):**
```json
{
  "_id": "6067c78b3f1234567890abd0",
  "jobId": "6067c78b3f1234567890abce",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "location": "New York, NY",
  "education": "Bachelor's in Computer Science",
  "yearsOfExperience": 3,
  "skills": ["JavaScript", "React", "Node.js"],
  "resumeUrl": "uploads/1705769400000-resume.pdf",
  "coverLetterUrl": "uploads/1705769400000-letter.pdf",
  "additionalNotes": "I'm very interested...",
  "status": "Applied",
  "createdAt": "2024-01-20T16:10:00.000Z",
  "updatedAt": "2024-01-20T16:10:00.000Z"
}
```

**Usage:**
```bash
curl -X POST http://localhost:5000/api/applications \
  -F "jobId=6067c78b3f1234567890abce" \
  -F "fullName=John Doe" \
  -F "email=john@example.com" \
  -F "phone=555-1234" \
  -F "skills=JavaScript,React,Node.js" \
  -F "resume=@resume.pdf" \
  -F "coverLetter=@letter.pdf"
```

---

### GET /
Retrieves all applications.

**Authentication:** Required (Admin only)

**Query Parameters:**
| Parameter | Type | Optional | Example |
|-----------|------|----------|---------|
| status | string | ✅ | Applied, Reviewing, Hired |
| jobId | string | ✅ | Job ID for filtering |
| page | number | ✅ | 1, 2, 3 |

**Response (200):**
```json
[
  {
    "_id": "6067c78b3f1234567890abd0",
    "jobId": {
      "_id": "6067c78b3f1234567890abce",
      "title": "Full Stack Developer"
    },
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "skills": ["JavaScript", "React"],
    "status": "Reviewing",
    "createdAt": "2024-01-20T16:10:00.000Z"
  }
]
```

**Usage:**
```bash
# Get all applications
curl -X GET http://localhost:5000/api/applications \
  -H "Authorization: Bearer <jwt-token>"

# Filter by status
curl -X GET "http://localhost:5000/api/applications?status=Reviewing" \
  -H "Authorization: Bearer <jwt-token>"

# Filter by job
curl -X GET "http://localhost:5000/api/applications?jobId=6067c78b3f1234567890abce" \
  -H "Authorization: Bearer <jwt-token>"
```

---

### GET /:id
Retrieves a single application.

**Authentication:** Required (Admin only)

**Response (200):**
```json
{
  "_id": "6067c78b3f1234567890abd0",
  "jobId": {
    "_id": "6067c78b3f1234567890abce",
    "title": "Full Stack Developer"
  },
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "location": "New York, NY",
  "education": "Bachelor's in Computer Science",
  "yearsOfExperience": 3,
  "skills": ["JavaScript", "React", "Node.js"],
  "resumeUrl": "uploads/resume.pdf",
  "status": "Reviewing",
  "createdAt": "2024-01-20T16:10:00.000Z"
}
```

---

### PATCH /:id/status
Updates application status.

**Authentication:** Required (Admin only)

**Request:**
```json
{
  "status": "Interview"
}
```

**Valid Status Values:**
- `Applied` - Initial submission
- `Reviewing` - Under review
- `Interview` - Scheduled for interview
- `Rejected` - Application rejected
- `Hired` - Applicant hired

**Response (200):**
```json
{
  "_id": "6067c78b3f1234567890abd0",
  "status": "Interview",
  "updatedAt": "2024-01-20T17:00:00.000Z"
}
```

**Usage:**
```bash
curl -X PATCH http://localhost:5000/api/applications/6067c78b3f1234567890abd0/status \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "Interview"}'
```

---

### DELETE /:id
Deletes an application.

**Authentication:** Required (Admin only)

**Response (200):**
```json
{
  "message": "Application deleted successfully"
}
```

---

## ⚠️ Error Responses

### 400 - Bad Request
```json
{
  "message": "Invalid request data",
  "error": "Validation failed"
}
```

### 401 - Unauthorized
```json
{
  "message": "Invalid or expired token"
}
```

### 403 - Forbidden
```json
{
  "message": "You don't have permission to access this resource"
}
```

### 404 - Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 - Server Error
```json
{
  "message": "Internal server error",
  "error": "Error details"
}
```

---

## 📊 HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PATCH, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Invalid input/validation error |
| 401 | Unauthorized | Missing/invalid JWT token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

---

## 🔗 Related Files

- [models/Admin.js](../models/Admin.js) - Admin schema
- [models/Job.js](../models/Job.js) - Job schema
- [models/Application.js](../models/Application.js) - Application schema
- [middleware/auth.js](../middleware/auth.js) - Authentication
- [middleware/upload.js](../middleware/upload.js) - File uploads

---

**Last Updated:** 2024
**Version:** 1.0.0
