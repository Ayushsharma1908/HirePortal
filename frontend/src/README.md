# 🎨 Source - React Application

Main source code directory containing all React components, pages, contexts, utilities, and styling.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Directory Structure](#directory-structure)
- [Components](#components)
- [Pages](#pages)
- [Context API](#context-api)
- [Utilities](#utilities)
- [Styling](#styling)
- [Best Practices](#best-practices)

---

## 🚀 Overview

The `src/` directory contains:
- **React Components** - Reusable UI components
- **Pages** - Full page components (routes)
- **Context** - Global state management
- **Utilities** - Helper functions and API calls
- **Styling** - Global styles and Tailwind config

---

## 📁 Directory Structure

```
src/
├── components/
│   ├── admin/                 # Admin-specific components
│   │   ├── ApplicationModal.jsx
│   │   ├── ApplicationTable.jsx
│   │   ├── Charts.jsx
│   │   ├── CreateJobModal.jsx
│   │   └── StatCard.jsx
│   │
│   ├── applicant/             # Job seeker components
│   │   ├── JobCard.jsx
│   │   ├── StepDocuments.jsx
│   │   ├── StepEducation.jsx
│   │   ├── StepPersonal.jsx
│   │   ├── StepReview.jsx
│   │   └── StepSkills.jsx
│   │
│   └── shared/                # Shared UI components
│       ├── FormField.jsx
│       ├── LoadingScreen.jsx
│       ├── Navbar.jsx
│       ├── ProtectedRoute.jsx
│       ├── SkillChip.jsx
│       ├── StatusBadge.jsx
│       ├── StepProgress.jsx
│       └── TickerStrip.jsx
│
├── context/
│   ├── AuthContext.jsx        # Authentication state
│   └── FormContext.jsx        # Form state
│
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   └── AdminLogin.jsx
│   │
│   └── applicant/
│       ├── Apply.jsx
│       ├── Home.jsx
│       └── Success.jsx
│
├── utils/
│   ├── api.js                 # Axios configuration
│   ├── constants.js           # App constants
│   └── validation.js          # Form validation
│
├── assets/                    # Images, fonts, etc
├── App.jsx                    # Root component
├── index.css                  # Global styles
└── main.jsx                   # React DOM entry
```

---

## 🧩 Components

### Admin Components

#### ApplicationModal.jsx
Displays detailed information for a single job application in a modal popup.

**Props:**
```javascript
{
  application: Object,      // Application data to display
  isOpen: Boolean,          // Modal visibility
  onClose: Function,        // Callback to close modal
  onStatusChange: Function  // Callback when status updates
}
```

**Features:**
- Display applicant details
- Show uploaded documents
- Update application status
- View skills and experience

#### ApplicationTable.jsx
Displays all job applications in a data table with filtering and search.

**Props:**
```javascript
{
  applications: Array,      // List of applications
  onView: Function,         // Callback for viewing application
  onDelete: Function,       // Callback for deleting
  onStatusChange: Function  // Callback for status updates
}
```

**Features:**
- Sortable columns
- Status filtering
- Search functionality
- Pagination
- Row actions (view, edit, delete)

#### Charts.jsx
Analytics visualizations showing application statistics.

**Features:**
- Applications by status (pie chart)
- Application trends (line chart)
- Department breakdown (bar chart)
- Real-time statistics

#### CreateJobModal.jsx
Modal form for creating new job postings.

**Props:**
```javascript
{
  isOpen: Boolean,          // Modal visibility
  onClose: Function,        // Close modal callback
  onSubmit: Function        // Submit callback
}
```

**Features:**
- Form validation
- Multi-select skills
- Error handling
- Success feedback

#### StatCard.jsx
Displays a statistics card with label and value.

**Props:**
```javascript
{
  title: String,            // Card title
  value: String|Number,     // Stat value
  icon: ReactNode,          // Icon component
  color: String             // Accent color
}
```

### Applicant Components

#### JobCard.jsx
Displays individual job listing in a card format.

**Props:**
```javascript
{
  job: Object,              // Job data
  onApply: Function         // Apply button callback
}
```

**Features:**
- Job title, department, location
- Job type and salary
- Apply button
- Responsive design

#### StepDocuments.jsx
Application step for uploading resume and cover letter.

**Features:**
- File upload input
- File validation (PDF, DOC, DOCX)
- File preview
- Progress indication

#### StepEducation.jsx
Application step for education information.

**Features:**
- Degree field
- Institution name
- Graduation year
- Form validation
- Dynamic field input

#### StepPersonal.jsx
First application step for personal information.

**Features:**
- Full name field
- Email address
- Phone number
- Location
- Form validation

#### StepReview.jsx
Final step to review all application details before submission.

**Features:**
- Display all entered data
- Edit buttons for each section
- Submit button
- Error handling

#### StepSkills.jsx
Application step for adding skills and experience.

**Features:**
- Add/remove skills
- Years of experience
- Skill validation
- Auto-complete suggestions

### Shared Components

#### FormField.jsx
Reusable form input component with validation display.

**Props:**
```javascript
{
  label: String,            // Field label
  type: String,             // Input type
  placeholder: String,      // Placeholder text
  error: String,            // Error message
  {...inputProps}           // Standard HTML input props
}
```

**Example:**
```jsx
<FormField
  label="Full Name"
  type="text"
  placeholder="Enter your full name"
  error={errors.fullName?.message}
  {...register('fullName', { required: 'Name is required' })}
/>
```

#### LoadingScreen.jsx
Animated loading/splash screen shown on app startup.

**Features:**
- 3.2 second display
- Smooth fade-out animation
- Logo/branding
- Responsive design

#### Navbar.jsx
Navigation bar with links and authentication status.

**Features:**
- Home link
- Admin login/logout
- Dashboard link (when authenticated)
- Responsive mobile menu
- Brand logo

#### ProtectedRoute.jsx
Wrapper component for routes requiring authentication.

**Usage:**
```jsx
<ProtectedRoute>
  <AdminDashboard />
</ProtectedRoute>
```

**Features:**
- Check authentication status
- Redirect to login if unauthorized
- Display loading while checking auth

#### SkillChip.jsx
Displays a skill tag with optional remove button.

**Props:**
```javascript
{
  skill: String,            // Skill text
  onRemove: Function,       // Remove callback
  removable: Boolean        // Show remove button
}
```

#### StatusBadge.jsx
Shows application status with color coding.

**Props:**
```javascript
{
  status: String,           // Status value
  size: String              // 'sm' | 'md' | 'lg'
}
```

**Status Colors:**
- Applied: Blue
- Reviewing: Yellow
- Interview: Purple
- Rejected: Red
- Hired: Green

#### StepProgress.jsx
Shows progress for multi-step forms.

**Props:**
```javascript
{
  currentStep: Number,      // Current step (1-indexed)
  totalSteps: Number,       // Total steps
  stepNames: Array          // Step labels
}
```

#### TickerStrip.jsx
Animated ticker showing notifications or announcements.

**Features:**
- Auto-scrolling text
- Smooth animation
- Configurable content

---

## 📄 Pages

### Admin Pages

#### AdminLogin.jsx
Admin authentication page.

**Features:**
- Email/password form
- Remember me option
- Error handling
- Redirect to dashboard on success

**Route:** `/admin/login`

#### AdminDashboard.jsx
Main admin dashboard with job and application management.

**Features:**
- Statistics overview
- Job listing management
- Application management
- Analytics charts
- Create job button
- Search and filter

**Route:** `/admin/dashboard` (Protected)

### Applicant Pages

#### Home.jsx
Job listings browse page.

**Features:**
- Display all active jobs
- Filter by department
- Search functionality
- Job cards layout
- Apply button
- Responsive grid

**Route:** `/`

#### Apply.jsx
Multi-step job application form.

**Features:**
- 5-step form wizard
  1. Personal Information
  2. Education
  3. Skills & Experience
  4. Documents
  5. Review & Submit
- Form validation
- Progress indication
- Error handling
- File upload support

**Route:** `/apply/:jobId`

#### Success.jsx
Success confirmation page after application submission.

**Features:**
- Success message
- Application reference number
- Email confirmation notice
- Browse more jobs button
- Download confirmation (optional)

**Route:** `/success`

---

## 🌐 Context API

### AuthContext.jsx
Manages authentication state globally.

**Provided State:**
```javascript
{
  admin: null | { _id, email },    // Authenticated admin
  token: null | "jwt-token",        // JWT token
  isLoading: boolean,               // Loading state
  error: null | "error message"     // Error state
}
```

**Provided Methods:**
```javascript
{
  login: async (email, password) => void,
  logout: () => void,
  useAuth: () => authContext
}
```

**Usage:**
```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { admin, login, logout } = useAuth();
  // Use auth methods
}
```

### FormContext.jsx
Manages multi-step application form state.

**Provided State:**
```javascript
{
  currentStep: number,              // Current step (1-5)
  formData: {
    personalInfo: { fullName, email, phone, location },
    education: { degree, institution, graduationYear },
    skills: { skills: [], yearsOfExperience },
    documents: { resumeUrl, coverLetterUrl },
    review: { additionalNotes }
  },
  errors: {}                        // Validation errors
}
```

**Provided Methods:**
```javascript
{
  nextStep: () => void,
  prevStep: () => void,
  updateFormData: (step, data) => void,
  resetForm: () => void,
  setError: (field, message) => void
}
```

---

## 🛠️ Utilities

### api.js
Axios HTTP client configuration.

**Features:**
- Base URL configuration
- JWT token injection
- Request/response interceptors
- Error handling
- Timeout configuration

**Usage:**
```javascript
import { apiClient } from '../utils/api';

// GET request
const jobs = await apiClient.get('/api/jobs');

// POST request
const response = await apiClient.post('/api/applications', data);

// With headers
const response = await apiClient.get('/api/protected', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### constants.js
App-wide constants and configuration.

**Exported:**
```javascript
export const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract'];
export const EXPERIENCE_LEVELS = ['Entry Level', 'Mid-level', 'Senior'];
export const APPLICATION_STATUS = ['Applied', 'Reviewing', 'Interview', 'Rejected', 'Hired'];
export const API_BASE_URL = import.meta.env.VITE_API_URL;
```

### validation.js
Form validation helper functions.

**Available Functions:**
```javascript
export const validateEmail = (email) => boolean;
export const validatePhone = (phone) => boolean;
export const validateFileType = (file) => boolean;
export const validateFileSize = (file) => boolean;
export const validateForm = (data, rules) => errors;
```

---

## 🎨 Styling

### index.css
Global styles and Tailwind CSS imports.

**Includes:**
- Tailwind CSS directives (@tailwind)
- Global font imports
- Custom CSS variables
- Reset/normalize styles

### Tailwind Configuration

**File:** `tailwind.config.js`

**Customizations:**
```javascript
{
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#10b981'
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      }
    }
  }
}
```

### Component Styling Strategy

- **Utility Classes** - Tailwind utilities for styling
- **Component Scope** - CSS modules or styled components
- **Responsive** - Mobile-first approach with breakpoints
- **Dark Mode** - Support via `dark:` prefix classes

---

## ✅ Best Practices

### Component Organization
```
Component.jsx          // Component implementation
Component.module.css   // Scoped styles (if needed)
├── Sub-Component.jsx
└── hooks/             // Custom hooks (if needed)
```

### Props Documentation
```jsx
/**
 * JobCard Component
 * @param {Object} job - Job data object
 * @param {string} job.title - Job title
 * @param {Function} onApply - Callback when apply button clicked
 */
function JobCard({ job, onApply }) { }
```

### State Management Rules
1. Use Context for global state (auth)
2. Use useState for component local state
3. Use custom hooks for reusable logic
4. Lift state up only when necessary

### Performance Optimization
1. Memoize expensive components with `React.memo()`
2. Use `useCallback()` for callback dependencies
3. Use `useMemo()` for expensive calculations
4. Lazy load routes with `React.lazy()`

### Accessibility
1. Use semantic HTML (button, form, input)
2. Include alt text for images
3. Label form fields properly
4. Use ARIA attributes when needed
5. Test keyboard navigation

---

## 🔗 Related Files

- [App.jsx](./App.jsx) - Root component
- [main.jsx](./main.jsx) - Entry point
- [../vite.config.js](../vite.config.js) - Vite configuration
- [../tailwind.config.js](../tailwind.config.js) - Tailwind configuration

---

**Last Updated:** 2024
**Version:** 1.0.0
