const router = require('express').Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// Get all active jobs (public)
router.get('/', async (req, res) => {
  try {
    const { department } = req.query;
    const filter = { isActive: true };
    if (department && department !== 'All') filter.department = department;
    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create job (admin)
router.post('/', auth, async (req, res) => {
  try {
    const job = new Job({ ...req.body, postedBy: req.admin._id });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update job (admin)
router.patch('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete (deactivate) job
router.delete('/:id', auth, async (req, res) => {
  try {
    await Job.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Job deactivated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
