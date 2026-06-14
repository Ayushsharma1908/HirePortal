require('dotenv').config();
const mongoose = require('mongoose');
const Application = require('./models/Application');
const Admin = require('./models/Admin');
const Job = require('./models/Job');

const demoApplications = [
  {
    firstName: 'Arjun', lastName: 'Sharma', email: 'arjun.sharma@email.com',
    phone: '9876543210', gender: 'Male', city: 'Mumbai', state: 'Maharashtra',
    department: 'Engineering', jobRole: 'Frontend Developer', experienceLevel: 'Mid Level',
    education: [{ institution: 'IIT Bombay', degree: 'B.Tech', fieldOfStudy: 'Computer Science', grade: '8.5 CGPA', startYear: '2018', endYear: '2022' }],
    technicalSkills: ['React', 'TypeScript', 'Node.js', 'MongoDB'], softSkills: ['Leadership', 'Communication'],
    githubUrl: 'https://github.com/arjun', linkedinUrl: 'https://linkedin.com/in/arjun',
    status: 'In Review', coverLetter: 'Passionate frontend developer with 3 years of experience building scalable web apps.',
  },
  {
    firstName: 'Priya', lastName: 'Patel', email: 'priya.patel@email.com',
    phone: '9123456780', gender: 'Female', city: 'Bangalore', state: 'Karnataka',
    department: 'Design', jobRole: 'UI/UX Designer', experienceLevel: 'Senior',
    education: [{ institution: 'NID Ahmedabad', degree: 'B.Des', fieldOfStudy: 'Interaction Design', grade: '9.1 CGPA', startYear: '2017', endYear: '2021' }],
    technicalSkills: ['Figma', 'Adobe XD', 'Prototyping', 'Illustration'], softSkills: ['Creativity', 'Empathy'],
    linkedinUrl: 'https://linkedin.com/in/priya', portfolioUrl: 'https://priya.design',
    status: 'Shortlisted', coverLetter: 'Senior designer focused on clean, human-centered interfaces.',
  },
  {
    firstName: 'Rahul', lastName: 'Verma', email: 'rahul.verma@email.com',
    phone: '9988776655', gender: 'Male', city: 'Delhi', state: 'Delhi',
    department: 'Data Science', jobRole: 'Data Analyst', experienceLevel: 'Entry Level',
    education: [{ institution: 'Delhi University', degree: 'M.Sc', fieldOfStudy: 'Statistics', grade: '7.8 CGPA', startYear: '2020', endYear: '2022' }],
    technicalSkills: ['Python', 'SQL', 'Tableau', 'Machine Learning'], softSkills: ['Analytical thinking', 'Problem solving'],
    githubUrl: 'https://github.com/rahul',
    status: 'New', coverLetter: 'Recent graduate eager to apply data science skills in a real-world setting.',
  },
  {
    firstName: 'Sneha', lastName: 'Iyer', email: 'sneha.iyer@email.com',
    phone: '9765432109', gender: 'Female', city: 'Chennai', state: 'Tamil Nadu',
    department: 'Marketing', jobRole: 'Digital Marketer', experienceLevel: 'Mid Level',
    education: [{ institution: 'Anna University', degree: 'MBA', fieldOfStudy: 'Marketing', grade: '8.2 CGPA', startYear: '2019', endYear: '2021' }],
    technicalSkills: ['SEO', 'Google Ads', 'Content Strategy', 'Analytics'], softSkills: ['Storytelling', 'Teamwork'],
    linkedinUrl: 'https://linkedin.com/in/sneha',
    status: 'Hired', coverLetter: 'Digital marketing expert with proven ROI track record.',
  },
  {
    firstName: 'Karan', lastName: 'Mehta', email: 'karan.mehta@email.com',
    phone: '9654321098', gender: 'Male', city: 'Pune', state: 'Maharashtra',
    department: 'Engineering', jobRole: 'Backend Developer', experienceLevel: 'Senior',
    education: [{ institution: 'BITS Pilani', degree: 'B.Tech', fieldOfStudy: 'Information Technology', grade: '9.0 CGPA', startYear: '2016', endYear: '2020' }],
    technicalSkills: ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'AWS'], softSkills: ['Mentoring', 'Architecture'],
    githubUrl: 'https://github.com/karan', linkedinUrl: 'https://linkedin.com/in/karan',
    status: 'In Review', coverLetter: 'Senior backend engineer specializing in distributed systems and microservices.',
  },
];

const demoJobs = [
  { title: 'Frontend Developer', department: 'Engineering', location: 'Remote', type: 'Full-time', experienceLevel: 'Mid Level', description: 'Build modern UIs with React and TypeScript.', requirements: ['React', 'TypeScript', '3+ years experience'], salary: '₹12-18 LPA' },
  { title: 'Backend Developer', department: 'Engineering', location: 'Bangalore', type: 'Full-time', experienceLevel: 'Senior', description: 'Design and build scalable APIs and microservices.', requirements: ['Node.js', 'MongoDB', '5+ years experience'], salary: '₹18-28 LPA' },
  { title: 'UI/UX Designer', department: 'Design', location: 'Mumbai', type: 'Full-time', experienceLevel: 'Mid Level', description: 'Craft user-centered designs that delight users.', requirements: ['Figma', 'Prototyping', 'User Research'], salary: '₹8-14 LPA' },
  { title: 'Data Analyst', department: 'Data Science', location: 'Remote', type: 'Full-time', experienceLevel: 'Entry Level', description: 'Analyze data to drive business insights.', requirements: ['Python', 'SQL', 'Tableau'], salary: '₹6-10 LPA' },
  { title: 'Digital Marketer', department: 'Marketing', location: 'Delhi', type: 'Full-time', experienceLevel: 'Mid Level', description: 'Drive growth through digital channels.', requirements: ['SEO/SEM', 'Content Strategy', 'Analytics'], salary: '₹7-12 LPA' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobportal');
  console.log('Connected to MongoDB');

  await Application.deleteMany({});
  await Admin.deleteMany({});
  await Job.deleteMany({});

  await Application.insertMany(demoApplications);
  console.log('✅ Seeded 5 demo applications');

  const admin = new Admin({ name: 'Admin User', email: 'admin@jobportal.com', password: 'Admin@123', role: 'superadmin' });
  await admin.save();
  console.log('✅ Created admin: admin@jobportal.com / Admin@123');

  await Job.insertMany(demoJobs);
  console.log('✅ Seeded 5 demo jobs');

  mongoose.disconnect();
}

seed().catch(console.error);
