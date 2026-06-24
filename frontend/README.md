# 🎨 Frontend - Job Portal UI

React + Vite frontend application for the Job Portal. Provides user interfaces for job seekers to browse and apply for jobs, and administrators to manage postings and applications.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Component Architecture](#component-architecture)
- [Routing](#routing)
- [State Management](#state-management)
- [Styling](#styling)
- [API Integration](#api-integration)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Overview

The frontend provides:
- **Job Browsing** - Responsive job listing with filters
- **Application Forms** - Multi-step application wizard
- **Admin Dashboard** - Job management & analytics
- **Authentication** - Secure admin login
- **Responsive Design** - Mobile, tablet, and desktop
- **Real-time Notifications** - Toast notifications for user feedback

**Development Server:** `http://localhost:5173`

---

## 🛠️ Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React | ^18.2.0 |
| Build Tool | Vite | ^5.2.0 |
| Routing | React Router | ^6.22.3 |
| Form Management | React Hook Form | ^7.51.3 |
| HTTP Client | Axios | ^1.6.8 |
| Styling | Tailwind CSS | ^3.4.3 |
| UI Animations | Framer Motion | ^11.1.7 |
| Charts/Graphs | Recharts | ^2.12.5 |
| Icons | Lucide React | ^0.378.0 |
| Notifications | React Hot Toast | ^2.4.1 |
| CSS Processing | PostCSS | ^8.4.38 |
| Autoprefixer | autoprefixer | ^10.4.19 |

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── ApplicationModal.jsx      # Modal for viewing applications
│   │   │   ├── ApplicationTable.jsx      # Table displaying applications
│   │   │   ├── Charts.jsx                # Analytics charts
│   │   │   ├── CreateJobModal.jsx        # Modal for creating jobs
│   │   │   └── StatCard.jsx              # Statistics card component
│   │   │
│   │   ├── applicant/
│   │   │   ├── JobCard.jsx               # Individual job listing card
│   │   │   ├── StepDocuments.jsx         # Application step: uploads
│   │   │   ├── StepEducation.jsx         # Application step: education
│   │   │   ├── StepPersonal.jsx          # Application step: personal info
│   │   │   ├── StepReview.jsx            # Application step: review
│   │   │   └── StepSkills.jsx            # Application step: skills
│   │   │
│   │   └── shared/
│   │       ├── FormField.jsx             # Reusable form input component
│   │       ├── LoadingScreen.jsx         # Splash/loading screen
│   │       ├── Navbar.jsx                # Navigation bar
│   │       ├── ProtectedRoute.jsx        # Route protection wrapper
│   │       ├── SkillChip.jsx             # Skill tag component
│   │       ├── StatusBadge.jsx           # Application status badge
│   │       ├── StepProgress.jsx          # Multi-step form progress
│   │       └── TickerStrip.jsx           # Animated ticker strip
│   │
│   ├── context/
│   │   ├── AuthContext.jsx               # Authentication state management
│   │   └── FormContext.jsx               # Form state management
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx        # Main admin dashboard
│   │   │   └── AdminLogin.jsx            # Admin login page
│   │   │
│   │   └── applicant/
│   │       ├── Apply.jsx                 # Job application page
│   │       ├── Home.jsx                  # Job listings home page
│   │       └── Success.jsx               # Application success page
│   │
│   ├── utils/
│   │   ├── api.js                        # Axios API configuration
│   │   ├── constants.js                  # App constants
│   │   └── validation.js                 # Form validation logic
│   │
│   ├── assets/                           # Images, fonts, static files
│   ├── App.jsx                           # Root component
│   ├── index.css                         # Global styles
│   └── main.jsx                          # React DOM entry point
│
├── public/                               # Static assets
├── index.html                            # HTML template
├── vite.config.js                        # Vite configuration
├── tailwind.config.js                    # Tailwind CSS configuration
├── postcss.config.js                     # PostCSS configuration
├── .env.local                            # Environment variables
├── package.json                          # Dependencies & scripts
└── README.md                             # This file
```

---

## 📦 Installation

### Prerequisites
- Node.js v14 or higher
- npm or yarn

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create `.env.local` File
```bash
# In the frontend directory
echo "VITE_API_URL=http://localhost:5000" > .env.local
```

### Step 3: Verify Backend is Running
Ensure the backend server is running on `http://localhost:5000`

---

## 🎮 Running the Application

### Development Mode
```bash
npm run dev
```
Starts the Vite dev server with hot module replacement (HMR).
Access at: `http://localhost:5173`

### Preview Production Build
```bash
npm run preview
```
Builds and previews the optimized production bundle.

### Production Build
```bash
npm run build
```
Generates optimized files in the `dist/` directory for deployment.

---

## 🏗️ Component Architecture

### Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── Routes
│       ├── Home (Applicant)
│       │   └── JobCard[] (Browsing jobs)
│       ├── Apply (Applicant)
│       │   └── FormContext (State management)
│       │       ├── StepPersonal
│       │       ├── StepEducation
│       │       ├── StepSkills
│       │       ├── StepDocuments
│       │       └── StepReview
│       ├── Success (Applicant)
│       ├── AdminLogin
│       └── AdminDashboard (Protected)
│           ├── CreateJobModal
│           ├── ApplicationTable
│           │   └── ApplicationModal
│           └── Charts
```

### Shared Components

**FormField**
- Reusable form input component
- Supports text, email, number, textarea
- Built-in validation display

**ProtectedRoute**
- Wraps admin routes
- Redirects to login if unauthorized
- Checks authentication context

**StepProgress**
- Shows multi-step form progress
- Indicates current step
- Shows step navigation

**StatusBadge**
- Displays application status
- Color-coded: Applied, Reviewing, Interview, Rejected, Hired

**LoadingScreen**
- Splash screen on app startup
- 3.2 second delay
- Smooth fade-out animation

---

## 🛣️ Routing

The application uses React Router v6 for navigation.

```
/                      → Home (Browse jobs)
/apply/:jobId          → Application form
/success               → Success confirmation
/admin/login           → Admin login
/admin/dashboard       → Admin dashboard (Protected)
```

**Protected Routes:**
- Admin dashboard requires JWT authentication
- Invalid/expired tokens redirect to login

---

## 💾 State Management

### AuthContext (`context/AuthContext.jsx`)
Manages authentication state across the application.

**State:**
```javascript
{
  admin: null | { _id, email },
  token: null | "jwt-token",
  isLoading: boolean,
  error: null | "error message"
}
```

**Methods:**
- `login(email, password)` - Authenticate admin
- `logout()` - Clear auth state
- `useAuth()` - Custom hook to access auth

### FormContext (`context/FormContext.jsx`)
Manages multi-step application form state.

**State:**
```javascript
{
  currentStep: number,
  formData: {
    personalInfo: {},
    education: {},
    skills: [],
    documents: {},
    review: {}
  }
}
```

**Methods:**
- `nextStep()` - Move to next step
- `prevStep()` - Move to previous step
- `updateFormData(step, data)` - Update step data
- `resetForm()` - Clear all form data

---

## 🎨 Styling

### Tailwind CSS
- Utility-first CSS framework
- Responsive design with breakpoints (sm, md, lg, xl, 2xl)
- Custom theme in `tailwind.config.js`

### CSS Classes
- Global styles in `src/index.css`
- Component-scoped Tailwind classes
- Dark mode support ready

### Responsive Breakpoints
```
sm: 640px    → Small devices
md: 768px    → Tablets
lg: 1024px   → Small desktops
xl: 1280px   → Large desktops
2xl: 1536px  → Extra large screens
```

---

## 🔌 API Integration

### Axios Configuration (`utils/api.js`)

```javascript
// API client with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true
});

// Request interceptor - adds auth token
// Response interceptor - handles errors
```

### API Endpoints Used

```javascript
// Jobs
GET    /api/jobs              → Fetch all jobs
GET    /api/jobs/:id          → Get single job
POST   /api/jobs              → Create job (admin)
PATCH  /api/jobs/:id          → Update job (admin)

// Applications
POST   /api/applications      → Submit application
GET    /api/applications      → Get all applications (admin)
PATCH  /api/applications/:id  → Update status (admin)

// Admin
POST   /api/admin/login       → Admin authentication
GET    /api/admin/dashboard   → Get dashboard stats
```

### Example API Calls

```javascript
// Fetch jobs
const response = await apiClient.get('/api/jobs?department=Engineering');

// Submit application
const formData = new FormData();
formData.append('jobId', jobId);
formData.append('fullName', name);
formData.append('resume', resumeFile);
const response = await apiClient.post('/api/applications', formData);

// Admin login
const response = await apiClient.post('/api/admin/login', {
  email, password
});
```

---

## 🚀 Building for Production

### Build Process
```bash
npm run build
```

This creates a `dist/` folder with:
- Minified JavaScript bundles
- Optimized CSS files
- Compressed images
- Source maps for debugging

### Deployment Options

**Vercel (Recommended)**
```bash
# Connect GitHub repo to Vercel
# Auto-deploys on push to main
```

**Netlify**
```bash
npm run build
# Deploy dist/ folder to Netlify
```

**Traditional Server**
```bash
npm run build
# Upload dist/ to web server
# Configure routing to serve index.html for all routes
```

### Environment Variables for Production

Create `.env.production.local`:
```env
VITE_API_URL=https://api.yourdomain.com
```

---

## ⚠️ Troubleshooting

### Port 5173 Already in Use
```
Error: listen EADDRINUSE: address already in use :::5173
```
**Solution:**
```bash
# Change port in vite.config.js or
npm run dev -- --port 3000
```

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Ensure backend is running on `http://localhost:5000`
- Check `VITE_API_URL` in `.env.local` is correct
- Verify backend CORS configuration

### 404 on Page Refresh (SPA Routing)
**Solution:** Configure your server to serve `index.html` for all routes.

For Vite preview:
```javascript
// vite.config.js
export default {
  server: {
    middlewareMode: true,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
}
```

### Build Size Too Large
```bash
# Analyze bundle size
npm run build -- --analyze
```
**Solutions:**
- Remove unused dependencies
- Code split routes using React.lazy()
- Optimize images

### Authentication Token Issues
```
Unauthorized (401) on protected routes
```
**Solution:**
- Check token is stored in localStorage
- Verify token hasn't expired
- Ensure `Authorization` header is sent
- Check `JWT_SECRET` matches backend

---

## 📝 Scripts

```json
{
  "dev": "vite",                    // Start dev server
  "build": "vite build",            // Build for production
  "preview": "vite preview"         // Preview production build
}
```

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| react | UI framework |
| react-router-dom | Client-side routing |
| react-hook-form | Form management |
| axios | HTTP requests |
| tailwindcss | Styling |
| framer-motion | Animations |
| recharts | Charts/graphs |
| lucide-react | Icons |
| react-hot-toast | Notifications |

---

## 🔗 Related Documentation

- [Backend README](../backend/README.md)
- [Root README](../README.md)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [React Router Docs](https://reactrouter.com/)

---

**Last Updated:** 2024
**Version:** 1.0.0
