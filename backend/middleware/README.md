# 🔐 Middleware - Backend

Custom middleware functions for request processing, authentication, and file handling.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication Middleware](#authentication-middleware)
- [Upload Middleware](#upload-middleware)
- [Usage Examples](#usage-examples)

---

## 🚀 Overview

Middleware functions are executed before route handlers to perform:
- **Authentication** - Verify JWT tokens
- **Authorization** - Check admin privileges
- **File Uploads** - Handle multipart form data
- **Error Handling** - Catch and format errors

---

## 🔐 Authentication Middleware

**File:** `auth.js`

Verifies JWT tokens in API requests and authenticates admin users.

### Purpose
- Validates JWT tokens from Authorization header
- Extracts admin information from token
- Attaches admin data to request object
- Returns 401 Unauthorized for invalid/missing tokens

### Implementation
```javascript
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
```

### Usage in Routes
```javascript
const auth = require('../middleware/auth');
const router = require('express').Router();

// Protected route - only accessible with valid JWT
router.post('/create-job', auth, (req, res) => {
  // req.admin contains authenticated user info
  // req.admin._id, req.admin.email
});

// Public route - no authentication needed
router.get('/jobs', (req, res) => {
  // Accessible without token
});
```

### Request Format
Include JWT token in Authorization header:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     http://localhost:5000/api/jobs
```

### Response
- **401 Unauthorized** - Missing or invalid token
- **Next middleware/handler** - Token is valid

---

## 📤 Upload Middleware

**File:** `upload.js`

Handles file uploads using Multer for application documents.

### Purpose
- Accepts file uploads from multipart/form-data requests
- Validates file types (PDF, DOC, DOCX)
- Limits file size (5MB max)
- Stores files in `uploads/` directory
- Generates unique filenames

### Implementation
```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX files allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;
```

### Configuration Options

| Option | Value | Description |
|--------|-------|-------------|
| Destination | `./uploads/` | Where files are stored |
| Max Size | 5MB | Maximum file size |
| Allowed Types | PDF, DOC, DOCX | Supported file formats |
| Filename | `timestamp-original` | Unique file naming |

### Usage in Routes

**Single File Upload:**
```javascript
const upload = require('../middleware/upload');

router.post('/submit', upload.single('resume'), (req, res) => {
  const filename = req.file.filename;
  const filesize = req.file.size;
  // Process file upload
});
```

**Multiple Files:**
```javascript
router.post('/submit', upload.array('documents', 3), (req, res) => {
  const files = req.files; // Array of uploaded files
  files.forEach(file => console.log(file.filename));
});
```

### Request Format
```bash
curl -X POST http://localhost:5000/api/applications \
  -F "resume=@resume.pdf" \
  -F "coverLetter=@letter.pdf" \
  -F "fullName=John Doe"
```

### File Object Properties
After upload, `req.file` contains:
```javascript
{
  fieldname: 'resume',           // Field name
  originalname: 'resume.pdf',    // Original filename
  encoding: '7bit',              // Encoding type
  mimetype: 'application/pdf',   // MIME type
  destination: './uploads/',     // Storage path
  filename: '1697481234-resume.pdf',  // Stored filename
  path: 'uploads/1697481234-resume.pdf', // Full path
  size: 245678                   // File size in bytes
}
```

### Error Handling
```javascript
router.post('/submit', upload.single('resume'), (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large (max 5MB)' });
    }
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});
```

---

## 📝 Usage Examples

### Example 1: Protecting Admin Routes
```javascript
const auth = require('./middleware/auth');
const router = require('express').Router();

// Only admins can create jobs
router.post('/', auth, async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      postedBy: req.admin._id  // From auth middleware
    });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

### Example 2: Uploading Application Documents
```javascript
const upload = require('./middleware/upload');
const router = require('express').Router();

router.post('/submit', upload.single('resume'), async (req, res) => {
  try {
    const app = new Application({
      jobId: req.body.jobId,
      fullName: req.body.fullName,
      resumeUrl: req.file.filename,  // Uploaded file
      ...req.body
    });
    await app.save();
    res.status(201).json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

### Example 3: Combining Middlewares
```javascript
const auth = require('./middleware/auth');
const upload = require('./middleware/upload');
const router = require('express').Router();

// Protected route with file upload
router.post('/admin/upload-document', auth, upload.single('file'), 
  async (req, res) => {
    // Only authenticated admins can access
    // File is uploaded and stored
  }
);
```

---

## 🆘 Common Issues

### "Unexpected field" Error
```
Error: Unexpected field
```
**Cause:** Form field name doesn't match middleware configuration
**Solution:** Ensure field name in FormData matches middleware:
```javascript
// Middleware expects 'resume'
upload.single('resume')

// FormData must use same name
const fd = new FormData();
fd.append('resume', file);  // ✓ Correct
fd.append('file', file);    // ✗ Wrong
```

### "File too large" Error
```
Error: File too large
```
**Cause:** File exceeds 5MB limit
**Solution:** Reduce file size or adjust limit in upload.js:
```javascript
limits: { fileSize: 10 * 1024 * 1024 } // 10MB
```

### "ENOENT: no such file or directory"
```
Error: ENOENT: no such file or directory, open 'uploads'
```
**Cause:** `uploads/` directory doesn't exist
**Solution:** Create the directory:
```bash
mkdir uploads
```

### Token Not Found in Header
```
401 Unauthorized - No token provided
```
**Cause:** Authorization header is missing or incorrectly formatted
**Solution:** Include token in request header:
```bash
# Correct format: "Bearer <token>"
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🔗 Related Files

- [routes/admin.js](../routes/admin.js) - Uses auth middleware
- [routes/jobs.js](../routes/jobs.js) - Uses auth middleware
- [routes/applications.js](../routes/applications.js) - Uses upload middleware
- [server.js](../server.js) - Main server setup

---

**Last Updated:** 2024
**Version:** 1.0.0
