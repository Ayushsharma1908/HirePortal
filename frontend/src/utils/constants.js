export const DEPARTMENTS = ['Engineering', 'Design', 'Data Science', 'Marketing', 'Product', 'Operations']

export const STATUS_OPTIONS = ['New', 'In Review', 'Shortlisted', 'Hired', 'Rejected']

export const STATUS_COLORS = {
  New: { bg: 'bg-ink-100', text: 'text-ink-600', dot: 'bg-ink-400' },
  'In Review': { bg: 'bg-amber-muted', text: 'text-amber-700', dot: 'bg-amber' },
  Shortlisted: { bg: 'bg-teal-muted', text: 'text-teal-dark', dot: 'bg-teal' },
  Hired: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  Rejected: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-400' },
}

export const SKILL_CATEGORIES = {
  Engineering: {
    label: 'Engineering & Dev',
    skills: [
      'React', 'Vue', 'Angular', 'Next.js', 'TypeScript', 'JavaScript',
      'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'MySQL', 'Python',
      'Django', 'FastAPI', 'Java', 'Spring Boot', 'AWS', 'Docker',
      'Kubernetes', 'GraphQL', 'REST APIs', 'Tailwind CSS', 'Git', 'CI/CD',
    ],
  },
  Design: {
    label: 'Design & Creative',
    skills: [
      'Figma', 'Adobe XD', 'Sketch', 'Illustrator', 'Photoshop', 'InDesign',
      'Prototyping', 'Wireframing', 'User Research', 'Usability Testing',
      'Motion Design', 'Brand Identity', 'Typography', 'Color Theory',
      'Interaction Design', 'Design Systems', 'Storyboarding', 'Video Editing',
    ],
  },
  Marketing: {
    label: 'Marketing & Growth',
    skills: [
      'SEO', 'SEM', 'Google Ads', 'Meta Ads', 'Content Strategy',
      'Copywriting', 'Email Marketing', 'Social Media', 'Influencer Marketing',
      'Google Analytics', 'HubSpot', 'Mailchimp', 'A/B Testing',
      'Market Research', 'Brand Strategy', 'PR & Communications',
    ],
  },
  'Data Science': {
    label: 'Data & Analytics',
    skills: [
      'Python', 'R', 'SQL', 'Tableau', 'Power BI', 'Excel', 'Machine Learning',
      'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy',
      'Data Visualization', 'Statistics', 'NLP', 'Computer Vision',
      'Spark', 'Hadoop', 'Airflow', 'dbt',
    ],
  },
  Product: {
    label: 'Product Management',
    skills: [
      'Product Roadmapping', 'Agile', 'Scrum', 'Jira', 'Confluence',
      'User Stories', 'OKRs', 'KPI Tracking', 'Competitive Analysis',
      'Customer Discovery', 'A/B Testing', 'Product Analytics',
      'Go-to-Market Strategy', 'Stakeholder Management', 'Prioritization',
    ],
  },
  Operations: {
    label: 'Operations & Management',
    skills: [
      'Project Management', 'Process Improvement', 'Lean', 'Six Sigma',
      'Supply Chain', 'Logistics', 'Vendor Management', 'Budgeting',
      'ERP Systems', 'Salesforce', 'MS Office', 'Business Analysis',
      'Risk Management', 'Quality Assurance', 'Team Leadership',
    ],
  },
}

// Flat list for fallback / "All" tab
export const TECH_SKILLS = Object.values(SKILL_CATEGORIES).flatMap(c => c.skills)

export const SOFT_SKILLS = [
  'Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Critical Thinking',
  'Time Management', 'Adaptability', 'Creativity', 'Attention to Detail', 'Mentoring',
  'Empathy', 'Negotiation', 'Conflict Resolution', 'Decision Making', 'Public Speaking',
]

export const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Manager']

export const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract']

export const TICKER_ITEMS = [
  '🚀 Frontend Developer — Remote',
  '💡 UI/UX Designer — Mumbai',
  '📊 Data Analyst — Bangalore',
  '🛠 Backend Engineer — Pune',
  '📣 Digital Marketer — Delhi',
  '🔬 ML Engineer — Remote',
  '🎨 Product Designer — Chennai',
  '⚙️ DevOps Engineer — Hyderabad',
]