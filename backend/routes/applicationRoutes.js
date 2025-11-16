const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getMyApplicationStatus,
  getAllApplications,
  approveApplication,
  rejectApplication
} = require('../controllers/applicationController');
const { protect, adminOnly } = require('../middleware/auth');

// User routes
router.post('/', protect, submitApplication);
router.get('/my-status', protect, getMyApplicationStatus);

// Admin routes
router.get('/', protect, adminOnly, getAllApplications);
router.put('/:id/approve', protect, adminOnly, approveApplication);
router.put('/:id/reject', protect, adminOnly, rejectApplication);

module.exports = router;
