const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, updateAvatar } = require('../controllers/profile.controller');
const { protect } = require('../middleware/auth');

// Get and update profile
router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);

// Update avatar
router.put('/avatar', protect, updateAvatar);

module.exports = router;
