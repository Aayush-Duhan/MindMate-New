const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { body, param } = require('express-validator');

// Import controller (we'll create this next)
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus
} = require('../controllers/user.controller');

// Validation rules
const userValidation = {
  create: [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['student', 'teacher', 'counselor', 'parent', 'admin']),
    body('profile.firstName').optional().trim().notEmpty(),
    body('profile.lastName').optional().trim().notEmpty(),
    validate
  ],
  update: [
    param('id').isMongoId(),
    body('email').optional().isEmail().normalizeEmail(),
    body('role').optional().isIn(['student', 'teacher', 'counselor', 'parent', 'admin']),
    body('profile.firstName').optional().trim().notEmpty(),
    body('profile.lastName').optional().trim().notEmpty(),
    validate
  ],
  status: [
    param('id').isMongoId(),
    body('isActive').isBoolean(),
    validate
  ]
};

// Routes
// Get all users - Admin only
router.get('/', protect, authorize('admin'), getAllUsers);

// Get user by ID - Admin only
router.get('/:id', protect, authorize('admin'), param('id').isMongoId(), validate, getUserById);

// Create new user - Admin only
router.post('/', protect, authorize('admin'), userValidation.create, createUser);

// Update user - Admin only
router.put('/:id', protect, authorize('admin'), userValidation.update, updateUser);

// Delete user - Admin only
router.delete('/:id', protect, authorize('admin'), param('id').isMongoId(), validate, deleteUser);

// Update user status - Admin only
router.patch('/:id/status', protect, authorize('admin'), userValidation.status, updateUserStatus);

module.exports = router; 