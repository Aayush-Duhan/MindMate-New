const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createMoodEntry,
  getMoodEntries,
  getMoodStats,
  shareMoodEntries,
  quickMoodCheck,
  getAvailableCounselors,
  shareMoodData,
  calculateStreak
} = require('../controllers/mood.controller');

// Apply protect middleware to all routes
router.use(protect);

router.route('/')
  .post(createMoodEntry)
  .get(getMoodEntries);

router.post('/quick', quickMoodCheck);
router.get('/stats', getMoodStats);
router.post('/share', shareMoodEntries);

// Get available counselors
router.get('/counselors', getAvailableCounselors);

// Share mood data with counselor
router.post('/share', shareMoodData);

// Get user's current streak
router.get('/streak', calculateStreak);

module.exports = router;