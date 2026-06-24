# 💾 Models - Database Schemas

MongoDB/Mongoose data models defining the structure of documents stored in the database.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Admin Model](#admin-model)
- [Job Model](#job-model)
- [Application Model](#application-model)
- [Relationships](#relationships)
- [Queries & Methods](#queries--methods)
- [Validation](#validation)

---

## 🚀 Overview

Models define the structure and behavior of documents in MongoDB collections. Each model includes:
- **Schema Definition** - Field types, constraints, defaults
- **Validation Rules** - Data integrity checks
- **Timestamps** - Auto-generated created/updated dates
- **References** - Relationships to other documents

---

## 🔐 Admin Model

**File:** `Admin.js`

Represents admin users who manage jobs and applications.

### Schema
```javascript
{
  email: {
    type: String,
    required: true,
    unique: true,           // No duplicate emails
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true          // Hashed with bcrypt
  },
  createdAt: Date,          // Auto-generated
  updatedAt: Date           // Auto-updated
}
```

### Field Descriptions

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| email | String | ✅ | Unique email address (lowercase) |
| password | String | ✅ | Hashed password (bcryptjs) |
| createdAt | Date | Auto | Creation timestamp |
| updatedAt | Date | Auto | Last update timestamp |

### Example Document
```json
{
  "_id": "ObjectId('507f1f77bcf86cd799439011')",
  "email": "admin@example.com",
  "password": "$2a$10$H9ZYvR7...",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Usage
```javascript
const Admin = require('./Admin');

// Create admin
const admin = new Admin({
  email: 'admin@example.com',
  password: hashedPassword
});
await admin.save();

// Find admin
const admin = await Admin.findOne({ email: 'admin@example.com' });

// Update admin
await Admin.updateOne({ _id: adminId }, { email: 'newemail@example.com' });

// Delete admin
await Admin.deleteOne({ _id: adminId });
```

---

## 📋 Job Model

**File:** `Job.js`

Represents job postings created by admins.

### Schema
```javascript
{
  title: {
    type: String,
    required: true              // Job title (e.g., "Software Engineer")
  },
  department: {
    type: String,
    required: true              // Department (e.g., "Engineering")
  },
  location: {
    type: String,
    default: 'Remote'           // Job location
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
    default: 'Full-time'
  },
  experienceLevel: {
    type: String,               // e.g., "Entry Level", "Mid-level", "Senior"
    default: 'Entry Level'
  },
  description: {
    type: String                // Full job description
  },
  requirements: {
    type: [String],             // Array of requirements
    default: []                 // e.g., ["Node.js", "React", "MongoDB"]
  },
  salary: {
    type: String                // e.g., "$100,000 - $150,000"
  },
  isActive: {
    type: Boolean,
    default: true               // Whether job is currently accepting applications
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'                // Reference to admin who posted
  },
  createdAt: Date,              // Auto-generated
  updatedAt: Date               // Auto-updated
}
```

### Field Descriptions

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | String | ✅ | Job title |
| department | String | ✅ | Department name |
| location | String | ❌ | Default: "Remote" |
| type | String | ❌ | Full-time/Part-time/Internship/Contract |
| experienceLevel | String | ❌ | Entry/Mid/Senior level |
| description | String | ❌ | Detailed job description |
| requirements | Array | ❌ | Required skills/qualifications |
| salary | String | ❌ | Salary range |
| isActive | Boolean | ❌ | Active status (default: true) |
| postedBy | ObjectId | ❌ | Reference to Admin |
| createdAt | Date | Auto | Creation timestamp |
| updatedAt | Date | Auto | Last update timestamp |

### Example Document
```json
{
  "_id": "ObjectId('507f1f77bcf86cd799439012')",
  "title": "Software Engineer",
  "department": "Engineering",
  "location": "San Francisco, CA",
  "type": "Full-time",
  "experienceLevel": "Mid-level",
  "description": "We are looking for an experienced...",
  "requirements": ["Node.js", "React", "MongoDB", "AWS"],
  "salary": "$120,000 - $160,000",
  "isActive": true,
  "postedBy": "ObjectId('507f1f77bcf86cd799439011')",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Usage
```javascript
const Job = require('./Job');

// Create job
const job = new Job({
  title: 'Software Engineer',
  department: 'Engineering',
  description: '...',
  requirements: ['Node.js', 'React'],
  postedBy: adminId
});
await job.save();

// Get all active jobs
const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });

// Get jobs by department
const jobs = await Job.find({ department: 'Engineering', isActive: true });

// Get job with admin details
const job = await Job.findById(jobId).populate('postedBy');

// Update job
await Job.updateOne({ _id: jobId }, { isActive: false });

// Delete job
await Job.deleteOne({ _id: jobId });
```

---

## 📝 Application Model

**File:** `Application.js`

Represents job applications submitted by applicants.

### Schema
```javascript
{
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true              // Reference to job posting
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  location: {
    type: String                // Applicant location
  },
  education: {
    type: String                // Education background
  },
  yearsOfExperience: {
    type: Number,
    default: 0
  },
  skills: {
    type: [String],             // Array of skills
    default: []
  },
  resumeUrl: {
    type: String                // Path to uploaded resume
  },
  coverLetterUrl: {
    type: String                // Path to uploaded cover letter
  },
  additionalNotes: {
    type: String                // Additional information
  },
  status: {
    type: String,
    enum: ['Applied', 'Reviewing', 'Interview', 'Rejected', 'Hired'],
    default: 'Applied'
  },
  createdAt: Date,              // Auto-generated
  updatedAt: Date               // Auto-updated
}
```

### Field Descriptions

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| jobId | ObjectId | ✅ | Reference to Job |
| fullName | String | ✅ | Applicant name |
| email | String | ✅ | Contact email |
| phone | String | ✅ | Contact phone |
| location | String | ❌ | Applicant location |
| education | String | ❌ | Education details |
| yearsOfExperience | Number | ❌ | Years of experience |
| skills | Array | ❌ | List of skills |
| resumeUrl | String | ❌ | Uploaded resume file |
| coverLetterUrl | String | ❌ | Uploaded cover letter |
| additionalNotes | String | ❌ | Extra information |
| status | String | ❌ | Application status |
| createdAt | Date | Auto | Creation timestamp |
| updatedAt | Date | Auto | Last update timestamp |

### Example Document
```json
{
  "_id": "ObjectId('507f1f77bcf86cd799439013')",
  "jobId": "ObjectId('507f1f77bcf86cd799439012')",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "location": "New York, NY",
  "education": "Bachelor's in Computer Science",
  "yearsOfExperience": 3,
  "skills": ["JavaScript", "React", "Node.js"],
  "resumeUrl": "uploads/1697481234-resume.pdf",
  "coverLetterUrl": "uploads/1697481234-letter.pdf",
  "additionalNotes": "I'm very interested in this role...",
  "status": "Reviewing",
  "createdAt": "2024-01-20T14:22:00.000Z",
  "updatedAt": "2024-01-20T14:22:00.000Z"
}
```

### Usage
```javascript
const Application = require('./Application');

// Create application
const app = new Application({
  jobId: jobId,
  fullName: 'John Doe',
  email: 'john@example.com',
  skills: ['JavaScript', 'React'],
  resumeUrl: 'uploads/resume.pdf'
});
await app.save();

// Get all applications for a job
const apps = await Application.find({ jobId: jobId });

// Get application with job details
const app = await Application.findById(appId).populate('jobId');

// Get applications by status
const reviewing = await Application.find({ status: 'Reviewing' });

// Update application status
await Application.updateOne({ _id: appId }, { status: 'Interview' });

// Delete application
await Application.deleteOne({ _id: appId });
```

---

## 🔗 Relationships

### Document Relationships

```
Admin (one-to-many)
  ↓
Job (one-to-many)
  ↓
Application
```

**Admin → Jobs:** One admin posts many jobs
```javascript
const admin = await Admin.findById(adminId);
const jobs = await Job.find({ postedBy: admin._id });
```

**Job → Applications:** One job receives many applications
```javascript
const job = await Job.findById(jobId);
const apps = await Application.find({ jobId: job._id });
```

### Populating References

```javascript
// Get job with admin info
const job = await Job.findById(jobId).populate('postedBy');
console.log(job.postedBy.email);

// Get application with job details
const app = await Application.findById(appId).populate('jobId');
console.log(app.jobId.title);

// Nested population
const job = await Job.findById(jobId).populate({
  path: 'applications',
  populate: { path: 'jobId' }
});
```

---

## 🔍 Queries & Methods

### Common Admin Queries
```javascript
// Find admin by email
const admin = await Admin.findOne({ email: 'admin@example.com' });

// Find admin by ID
const admin = await Admin.findById(adminId);

// Count total admins
const count = await Admin.countDocuments();
```

### Common Job Queries
```javascript
// Get all active jobs
const jobs = await Job.find({ isActive: true });

// Get jobs by department
const jobs = await Job.find({ 
  department: 'Engineering', 
  isActive: true 
});

// Get jobs with pagination
const jobs = await Job.find({ isActive: true })
  .limit(10)
  .skip(0)
  .sort({ createdAt: -1 });

// Search jobs
const jobs = await Job.find({
  $or: [
    { title: { $regex: 'Engineer', $options: 'i' } },
    { description: { $regex: 'Engineer', $options: 'i' } }
  ]
});
```

### Common Application Queries
```javascript
// Get all applications for a job
const apps = await Application.find({ jobId: jobId });

// Get applications by status
const hired = await Application.find({ status: 'Hired' });

// Get recent applications
const apps = await Application.find()
  .sort({ createdAt: -1 })
  .limit(20);

// Count applications by status
const stats = await Application.aggregate([
  {
    $group: {
      _id: '$status',
      count: { $sum: 1 }
    }
  }
]);
```

---

## ✔️ Validation

### Schema Validation

Models include built-in validation:

**Admin Validation:**
- `email` required, unique, lowercase
- `password` required
- Cannot create duplicate emails

**Job Validation:**
- `title` required
- `department` required
- `type` must be one of enum values
- `isActive` defaults to true

**Application Validation:**
- `jobId` required
- `fullName`, `email`, `phone` required
- `status` must match enum

### Custom Validation

```javascript
// Validate email format
const admin = new Admin({
  email: 'invalid-email',  // Will be converted to lowercase
  password: hash
});

// Validate job type
const job = new Job({
  type: 'InvalidType'  // Error: not in enum
});

// Validate references
const app = new Application({
  jobId: invalidId  // Error: job doesn't exist (with validation)
});
```

---

## 📝 Best Practices

1. **Always use `.populate()`** when you need referenced data
2. **Use indexes** on frequently queried fields (email, jobId)
3. **Validate data** before saving to database
4. **Use transactions** for multi-document updates
5. **Hash passwords** before storing (use bcryptjs)
6. **Set timestamps** to track changes

---

## 🔗 Related Files

- [server.js](../server.js) - Database connection
- [middleware/auth.js](../middleware/auth.js) - Uses Admin model
- [routes/admin.js](../routes/admin.js) - Admin CRUD operations
- [routes/jobs.js](../routes/jobs.js) - Job CRUD operations
- [routes/applications.js](../routes/applications.js) - Application operations

---

**Last Updated:** 2024
**Version:** 1.0.0
