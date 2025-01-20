const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { body } = require('express-validator');

const {
  getAdminProfile,
  updateAdminProfile
} = require('../controllers/admin.controller');

// Validation rules
const profileValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().matches(/^\+?[\d\s-]+$/).withMessage('Invalid phone number'),
  body('department').optional().trim()
];

// Routes
router.get('/profile', protect, authorize('admin'), getAdminProfile);
router.put('/profile', protect, authorize('admin'), profileValidation, validate, updateAdminProfile);

module.exports = router; 