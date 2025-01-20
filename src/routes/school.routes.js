const express = require('express');
const router = express.Router();
const { 
  createSchool, 
  getSchools, 
  getSchool, 
  updateSchool 
} = require('../controllers/school.controller');
const { protect, authorize } = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware
const validateSchool = [
  body('name').notEmpty().withMessage('School name is required'),
  body('address.city').optional().isString(),
  body('address.state').optional().isString(),
  body('contact.email').optional().isEmail(),
  body('contact.phone').optional().isMobilePhone()
];

router
  .route('/')
  .post(protect, authorize('admin'), validateSchool, createSchool)
  .get(protect, authorize('admin'), getSchools);

router
  .route('/:id')
  .get(protect, getSchool)
  .put(protect, authorize('admin'), validateSchool, updateSchool);

module.exports = router; 