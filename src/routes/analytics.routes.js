const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getUserEngagement,
  getSystemAnalytics,
  getResourceAnalytics
} = require('../controllers/analytics.controller');

// User engagement routes
router.get('/user/:userId?', protect, getUserEngagement);

// System-wide analytics (admin only)
router.get('/system', protect, authorize('admin'), getSystemAnalytics);

// Resource usage analytics
router.get('/resources', protect, authorize('admin', 'counselor'), getResourceAnalytics);

module.exports = router; 