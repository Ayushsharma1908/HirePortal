# HirePortal — MERN Stack Job Application Portal

A complete job application portal with applicant-facing multi-step form and a secure admin dashboard.

---

## 🗂 Folder Structure

```
job-portal/
├── backend/
│   ├── middleware/
│   │   ├── auth.js          # JWT auth guard
│   │   └── upload.js        # Multer file upload
│   ├── models/
│   │   ├── Admin.js         # Admin schema + bcrypt
│   │   ├── Application.js   # Application schema
│   │   └── Job.js           # Job posting schema
│   ├── routes/
│   │   ├── admin.js         # Login / register / me
│   │   ├── applications.js  # CRUD + stats
│   │   └── jobs.js          # Job CRUD
│   ├── uploads/             # Resume + photo storage
│   ├── .env.example
│   ├── package.json
│   ├── seed.js              # Seeds demo data
│   └── server.js            # Express entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── ApplicationModal.jsx
│   │   │   │   ├── ApplicationTable.jsx
│   │   │   │   ├── Charts.jsx
│   │   │   │   ├── CreateJobModal.jsx
│   │   │   │   └── StatCard.jsx
│   │   │   ├── applicant/
│   │   │   │   ├── JobCard.jsx
│   │   │   │   ├── StepDocuments.jsx
│   │   │   │   ├── StepEducation.jsx
│   │   │   │   ├── StepPersonal.jsx
│   │   │   │   ├── StepReview.jsx
│   │   │   │   └── StepSkills.jsx
│   │   │   └── shared/
│   │   │       ├── LoadingScreen.jsx
│   │   │       ├── Navbar.jsx
│   │   │       ├── ProtectedRoute.jsx
│   │   │       ├── SkillChip.jsx
│   │   │       ├── StatusBadge.jsx
│   │   │       ├── StepProgress.jsx
│   │   │       └── TickerStrip.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── FormContext.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   └── AdminLogin.jsx
│   │   │   └── applicant/
│   │   │       ├── Apply.jsx
│   │   │       ├── Home.jsx
│   │   │       └── Success.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── constants.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── package.json             # Root (concurrently)
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB running locally (`mongod`) or a MongoDB Atlas URI

### 1. Install dependencies

```bash
# Root
npm install

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET
```

### 3. Seed the database

```bash
cd backend
npm run seed
# Creates: admin@jobportal.com / Admin@123 + 5 demo apps + 5 jobs
```

### 4. Run development servers

```bash
# From root — runs both frontend + backend
npm run dev

# Or separately:
cd backend && npm run dev   # http://localhost:5000
cd frontend && npm run dev  # http://localhost:5173
```

---

## 🔑 Default Credentials

| Role  | Email                  | Password    |
|-------|------------------------|-------------|
| Admin | admin@jobportal.com    | Admin@123   |

Admin secret code for registration: `ADMIN2024`

---

## ✨ Features

### Applicant Side
- Hero section with animated ticker strip
- Department filters + job cards with slide-in drawer
- 5-step form: Personal → Education → Skills → Documents → Review
- Drag-and-drop resume upload (PDF/DOC)
- Skill chips with one-click suggestions
- Social links (GitHub, LinkedIn, Portfolio)
- Full validation on every step + math CAPTCHA on submit
- Auto-save draft to localStorage
- Animated success screen

### Admin Side
- JWT-protected login (secret code for registration)
- Pre-seeded with 5 demo applications
- Stat cards with live dot indicators
- Department bar chart + 7-day timeline
- Searchable, filterable table (status + department)
- Click any row → detail modal with status changer + notes
- Resume download
- Refresh button
- Create / manage job postings

### Design
- Colors: `#1C1D21` (ink) · Teal (`#0d9488`) · Amber
- Font: Poppins
- Minimalist, flat design — no heavy curves
- Animated loading screen with floating icons

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd frontend && npm run build
# Deploy dist/ folder to Vercel
# Set VITE_API_URL env variable if needed
```

### Backend → Render
```
Build command: npm install
Start command: node server.js
Environment: PORT, MONGO_URI, JWT_SECRET, ADMIN_SECRET_CODE
```
