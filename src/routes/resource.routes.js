const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { body } = require('express-validator');
const {
  getResources,
  getResourceById,
  getResourcesByCategory,
  createResource,
  updateResource,
  deleteResource,
  trackResourceAccess,
  getStudentResources,
  getParentResources
} = require('../controllers/resource.controller');

// Validation middleware
const validateResource = [
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('content').notEmpty(),
  body('category').isIn(['article', 'exercise', 'guide', 'video']),
  validate
];

// Get resources - specific routes first
router.get('/student', protect, getStudentResources);
router.get('/parent', protect, getParentResources);
router.get('/category/:category', protect, getResourcesByCategory);

// General routes
router.get('/', protect, getResources);
router.get('/:id', protect, getResourceById);

// Admin and counselor routes
router.post('/', protect, authorize('admin', 'counselor'), validateResource, createResource);
router.put('/:id', protect, authorize('admin', 'counselor'), validateResource, updateResource);
router.delete('/:id', protect, authorize('admin'), deleteResource);

// Analytics tracking
router.post('/:resourceId/track', protect, trackResourceAccess);

module.exports = router; 