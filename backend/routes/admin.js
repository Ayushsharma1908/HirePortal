const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

// Register (protected by secret code)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, secretCode } = req.body;
    if (secretCode !== (process.env.ADMIN_SECRET_CODE || 'ADMIN2024'))
      return res.status(403).json({ message: 'Invalid secret code' });
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Admin already exists' });
    const admin = new Admin({ name, email, password });
    await admin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    admin.lastLogin = new Date();
    await admin.save();
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' });
    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current admin
router.get('/me', auth, (req, res) => res.json(req.admin));

module.exports = router;
