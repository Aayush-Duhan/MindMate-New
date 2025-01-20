const express = require('express');
const router = express.Router();
const { getStudentProgress } = require('../controllers/progress.controller');
const { protect } = require('../middleware/auth');

// Get student progress
router.get('/', protect, getStudentProgress);

module.exports = router;
