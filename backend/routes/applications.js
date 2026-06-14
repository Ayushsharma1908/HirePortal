const router = require('express').Router();
const Application = require('../models/Application');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// Submit new application
router.post('/', upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'profileImage', maxCount: 1 }]), async (req, res) => {
  try {
    const body = JSON.parse(req.body.data || '{}');

    // Duplicate check
    const exists = await Application.findOne({ email: body.email, jobRole: body.jobRole });
    if (exists) return res.status(409).json({ message: 'You have already applied for this role.' });

    const application = new Application({
      ...body,
      resumePath: req.files?.resume?.[0]?.filename,
      resumeOriginalName: req.files?.resume?.[0]?.originalname,
      profileImagePath: req.files?.profileImage?.[0]?.filename,
    });
    await application.save();
    res.status(201).json({ message: 'Application submitted successfully!', id: application._id });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Duplicate application detected.' });
    res.status(500).json({ message: err.message });
  }
});

// Get all applications (admin)
router.get('/', auth, async (req, res) => {
  try {
    const { status, department, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status && status !== 'All') filter.status = status;
    if (department && department !== 'All') filter.department = department;
    if (search) filter.$or = [
      { firstName: new RegExp(search, 'i') },
      { lastName: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
      { jobRole: new RegExp(search, 'i') },
    ];
    const total = await Application.countDocuments(filter);
    const apps = await Application.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ applications: apps, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single application
router.get('/:id', auth, async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, adminNotes: req.body.notes, updatedAt: new Date() },
      { new: true }
    );
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Stats for dashboard
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const total = await Application.countDocuments();
    const byStatus = await Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const byDepartment = await Application.aggregate([{ $group: { _id: '$department', count: { $sum: 1 } } }]);

    // 7-day timeline
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const timeline = await Application.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({ total, byStatus, byDepartment, timeline });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
