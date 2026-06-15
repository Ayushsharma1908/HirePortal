const mongoose = require('mongoose');

// ─── Sub-Schemas ────────────────────────────────────────────────────────
const educationSchema = new mongoose.Schema({
  institution: { 
    type: String, 
    required: [true, 'Institution name is required'],
    trim: true 
  },
  degree: { 
    type: String, 
    required: [true, 'Degree is required'],
    trim: true 
  },
  fieldOfStudy: { 
    type: String, 
    required: [true, 'Field of study is required'],
    trim: true 
  },
  grade: { 
    type: String,
    trim: true 
  },
  startYear: { 
    type: String,
    match: [/^\d{4}$/, 'Please enter a valid year']
  },
  endYear: { 
    type: String,
    match: [/^\d{4}$/, 'Please enter a valid year']
  },
  currently: {
    type: Boolean,
    default: false
  }
});

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  jobTitle: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  startDate: {
    type: String,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: String
  },
  currentlyWorking: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    trim: true
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Remote'],
    default: 'Full-time'
  }
});

const qualificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Qualification title is required'],
    trim: true
  },
  issuer: {
    type: String,
    trim: true
  },
  date: String,
  description: {
    type: String,
    maxlength: [500, 'Description too long'],
    trim: true
  },
  credentialUrl: {
    type: String,
    trim: true
  },
  credentialId: {
    type: String,
    trim: true
  }
});

const socialLinksSchema = new mongoose.Schema({
  github: {
    type: String,
    trim: true,
    match: [/^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/?$/, 'Invalid GitHub URL']
  },
  linkedin: {
    type: String,
    trim: true,
    match: [/^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_.-]+\/?$/, 'Invalid LinkedIn URL']
  },
  portfolio: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+\..+/, 'Invalid portfolio URL']
  },
  twitter: {
    type: String,
    trim: true
  },
  stackoverflow: {
    type: String,
    trim: true
  }
});

// ─── Main Application Schema ───────────────────────────────────────────
const applicationSchema = new mongoose.Schema({
  // Personal Information
  firstName: { 
    type: String, 
    required: [true, 'First name is required'], 
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: { 
    type: String, 
    required: [true, 'Last name is required'], 
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    lowercase: true, 
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    index: true
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    match: [/^[\d\s\-\(\)\+]{10,15}$/, 'Please enter a valid phone number']
  },
  dob: {
    type: Date,
    validate: {
      validator: function(v) {
        if (!v) return true;
        const age = (new Date() - new Date(v)) / (365.25 * 24 * 60 * 60 * 1000);
        return age >= 16 && age <= 100;
      },
      message: 'Applicant must be between 16 and 100 years old'
    }
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Non-binary', 'Prefer not to say', 'Other']
  },
  address: {
    type: String,
    trim: true,
    maxlength: [200, 'Address too long']
  },
  city: { 
    type: String, 
    trim: true 
  },
  state: { 
    type: String, 
    trim: true 
  },
  country: {
    type: String,
    trim: true,
    default: 'India'
  },
  pincode: {
    type: String,
    trim: true
  },

  // Professional Summary
  summary: {
    type: String,
    maxlength: [2000, 'Summary cannot exceed 2000 characters'],
    trim: true
  },

  // Job Target
  department: { 
    type: String, 
    required: [true, 'Department is required'],
    enum: ['Engineering', 'Design', 'Marketing', 'Sales', 'Product', 'HR', 'Finance', 'Operations', 'Other']
  },
  jobRole: { 
    type: String, 
    required: [true, 'Job role is required'],
    trim: true 
  },
  experienceLevel: { 
    type: String, 
    enum: ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Manager', 'Director', 'Executive'],
    default: 'Entry Level' 
  },
  expectedSalary: {
    type: String,
    trim: true
  },
  noticePeriod: {
    type: String,
    enum: ['Immediate', '15 Days', '30 Days', '60 Days', '90 Days', 'More than 90 Days'],
    default: '30 Days'
  },
  currentLocation: {
    type: String,
    trim: true
  },
  willingToRelocate: {
    type: Boolean,
    default: false
  },
  workPreference: {
    type: String,
    enum: ['On-site', 'Remote', 'Hybrid', 'Flexible'],
    default: 'On-site'
  },

  // Education
  education: {
    type: [educationSchema],
    validate: {
      validator: function(arr) {
        return arr.length > 0;
      },
      message: 'At least one education entry is required'
    }
  },

  // Experience
  experiences: [experienceSchema],
  totalExperience: {
    years: { type: Number, min: 0, max: 50 },
    months: { type: Number, min: 0, max: 11 }
  },

  // Additional Qualifications
  additionalQualifications: [qualificationSchema],

  // Skills
  technicalSkills: {
    type: [String],
    validate: {
      validator: function(arr) {
        return arr.length > 0;
      },
      message: 'At least one technical skill is required'
    }
  },
  softSkills: [String],
  certifications: [String],
  languages: [{
    name: { type: String, trim: true },
    proficiency: {
      type: String,
      enum: ['Basic', 'Conversational', 'Professional', 'Native', 'Fluent']
    }
  }],

  // Social Links
  socialLinks: socialLinksSchema,

  // Legacy URL fields (keeping for backward compatibility)
  githubUrl: {
    type: String,
    trim: true
  },
  linkedinUrl: {
    type: String,
    trim: true
  },
  portfolioUrl: {
    type: String,
    trim: true
  },

  // Additional Info
  coverLetter: {
    type: String,
    maxlength: [5000, 'Cover letter too long'],
    trim: true
  },
  heardFrom: {
    type: String,
    enum: ['LinkedIn', 'Company Website', 'Job Portal', 'Referral', 'Social Media', 'Campus', 'Other'],
    default: 'Job Portal'
  },
  referralName: {
    type: String,
    trim: true
  },

  // Files
  resumePath: String,
  resumeOriginalName: String,
  profileImagePath: String,

  // Application Tracking
  status: {
    type: String,
    enum: {
      values: ['New', 'In Review', 'Shortlisted', 'Interview Scheduled', 'Interviewed', 
               'Offer Sent', 'Hired', 'Rejected', 'Withdrawn', 'On Hold'],
      message: '{VALUE} is not a valid status'
    },
    default: 'New'
  },
  statusHistory: [{
    status: String,
    changedBy: String,
    changedAt: { type: Date, default: Date.now },
    notes: String
  }],
  adminNotes: {
    type: String,
    maxlength: [2000, 'Notes too long'],
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  tags: [{
    type: String,
    trim: true
  }],

  // Meta
  source: {
    type: String,
    default: 'Direct'
  },
  ipAddress: String,
  userAgent: String,

  // Job Reference
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },

  // Timestamps
  appliedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ─── Indexes ───────────────────────────────────────────────────────────
applicationSchema.index({ email: 1, jobRole: 1 }, { unique: true });
applicationSchema.index({ status: 1 });
applicationSchema.index({ department: 1 });
applicationSchema.index({ appliedAt: -1 });
applicationSchema.index({ technicalSkills: 1 });
applicationSchema.index({ 'experienceLevel': 1 });

// Text index for search
applicationSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  'technicalSkills': 'text',
  'experiences.company': 'text',
  'education.institution': 'text'
});

// ─── Virtuals ──────────────────────────────────────────────────────────
applicationSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

applicationSchema.virtual('initials').get(function() {
  return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
});

applicationSchema.virtual('applicationAge').get(function() {
  if (!this.appliedAt) return 0;
  return Math.floor((Date.now() - this.appliedAt) / (1000 * 60 * 60 * 24));
});

// ─── Pre-save Middleware ───────────────────────────────────────────────
applicationSchema.pre('save', function(next) {
  // Sync legacy URL fields with socialLinks object
  if (!this.socialLinks) {
    this.socialLinks = {};
  }
  
  if (this.githubUrl && !this.socialLinks.github) {
    this.socialLinks.github = this.githubUrl;
  }
  if (this.linkedinUrl && !this.socialLinks.linkedin) {
    this.socialLinks.linkedin = this.linkedinUrl;
  }
  if (this.portfolioUrl && !this.socialLinks.portfolio) {
    this.socialLinks.portfolio = this.portfolioUrl;
  }

  // Auto-calculate total experience
  if (this.experiences && this.experiences.length > 0) {
    let totalMonths = 0;
    this.experiences.forEach(exp => {
      if (exp.startDate && exp.endDate) {
        const start = new Date(exp.startDate);
        const end = exp.currentlyWorking ? new Date() : new Date(exp.endDate);
        const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                       (end.getMonth() - start.getMonth());
        totalMonths += months;
      }
    });
    this.totalExperience = {
      years: Math.floor(totalMonths / 12),
      months: totalMonths % 12
    };
  }

  // Track status changes
  if (this.isModified('status')) {
    if (!this.statusHistory) {
      this.statusHistory = [];
    }
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
      notes: this.adminNotes || ''
    });
  }

  next();
});

// ─── Static Methods ────────────────────────────────────────────────────
applicationSchema.statics.findBySkill = function(skill) {
  return this.find({ 
    $or: [
      { technicalSkills: { $in: [new RegExp(skill, 'i')] } },
      { softSkills: { $in: [new RegExp(skill, 'i')] } }
    ]
  });
};

applicationSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        byStatus: { $push: '$status' },
        avgRating: { $avg: '$rating' },
        byDepartment: { $push: '$department' }
      }
    }
  ]);
  return stats[0] || {};
};

// ─── Instance Methods ──────────────────────────────────────────────────
applicationSchema.methods.getResumeUrl = function() {
  return this.resumePath ? `/uploads/${this.resumePath}` : null;
};

applicationSchema.methods.hasRequiredFields = function() {
  const required = ['firstName', 'lastName', 'email', 'phone', 'department', 'jobRole'];
  return required.every(field => !!this[field]);
};

// ─── Export ────────────────────────────────────────────────────────────
const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;