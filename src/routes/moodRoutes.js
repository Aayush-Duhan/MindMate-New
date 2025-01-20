const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createMoodEntry,
  getMoodEntries,
  getMoodStats
} = require('../controllers/moodController');

router.use(protect); // Protect all mood routes

router.route('/')
  .post(createMoodEntry)
  .get(getMoodEntries);

router.get('/stats', getMoodStats);

module.exports = router; 