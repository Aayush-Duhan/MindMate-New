const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getParentProfile,
  updateParentProfile
} = require('../controllers/parent.controller');

router.route('/profile')
  .get(protect, getParentProfile)
  .put(protect, updateParentProfile);

module.exports = router;
