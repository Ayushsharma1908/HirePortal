const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  grade: String,
  startYear: String,
  endYear: String,
});

const applicationSchema = new mongoose.Schema({
  // Personal
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  phone: { type: String, required: true },
  dob: String,
  gender: String,
  address: String,
  city: String,
  state: String,

  // Target
  department: { type: String, required: true },
  jobRole: { type: String, required: true },
  experienceLevel: { type: String, default: 'Entry Level' },

  // Education
  education: [educationSchema],

  // Skills
  technicalSkills: [String],
  softSkills: [String],
  certifications: [String],
  languages: [String],

  // Links
  githubUrl: String,
  linkedinUrl: String,
  portfolioUrl: String,
  coverLetter: String,

  // Files (stored as paths)
  resumePath: String,
  resumeOriginalName: String,
  profileImagePath: String,

  // Status
  status: {
    type: String,
    enum: ['New', 'In Review', 'Shortlisted', 'Hired', 'Rejected'],
    default: 'New',
  },
  adminNotes: String,

  // Timestamps
  appliedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Duplicate email per role check
applicationSchema.index({ email: 1, jobRole: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
