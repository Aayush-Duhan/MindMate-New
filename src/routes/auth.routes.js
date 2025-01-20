const express = require('express');
const router = express.Router();
const { register, login, getMe, getUsers, refreshToken } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware
const validateRegistration = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role').isIn(['student', 'teacher', 'counselor', 'parent', 'admin'])
    .withMessage('Invalid role specified')
];

router.post('/register', validateRegistration, register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, getUsers);
router.post('/refresh-token', refreshToken);

// Debug route to check user info
router.get('/debug-token', protect, (req, res) => {
  res.json({
    user: req.user,
    message: 'Current user info'
  });
});

// Protected routes
router.use(protect);
router.get('/users', getUsers);

module.exports = router; 