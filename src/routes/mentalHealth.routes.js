const express = require('express');
const router = express.Router();
const { 
  createRecord, 
  getUserRecords, 
  getAssignedRecords, 
  updateRecordStatus 
} = require('../controllers/mentalHealth.controller');
const { protect, authorize } = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware
const validateRecord = [
  body('type')
    .isIn(['assessment', 'session', 'report', 'observation'])
    .withMessage('Invalid record type'),
  body('data')
    .notEmpty()
    .withMessage('Record data is required'),
  body('severity')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical']),
  body('userId')
    .optional()
    .isMongoId()
    .withMessage('Invalid user ID')
];

router
  .route('/')
  .post(protect, authorize('counselor', 'admin'), validateRecord, createRecord);

router
  .route('/user/:userId')
  .get(protect, getUserRecords);

router
  .route('/assigned')
  .get(protect, authorize('counselor', 'admin'), getAssignedRecords);

router
  .route('/:id/status')
  .put(
    protect, 
    authorize('counselor', 'admin'),
    body('status').isIn(['open', 'in-progress', 'resolved', 'archived']),
    updateRecordStatus
  );

module.exports = router; 