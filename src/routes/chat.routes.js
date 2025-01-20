const express = require('express');
const router = express.Router();
const { 
  startChat, 
  getUserChats, 
  getChatMessages 
} = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware
const validateChat = [
  body('participantId')
    .isMongoId()
    .withMessage('Invalid participant ID'),
  body('isAnonymous')
    .optional()
    .isBoolean()
    .withMessage('isAnonymous must be a boolean')
];

// Routes
router.post('/', protect, validateChat, startChat);
router.get('/', protect, getUserChats);
router.get('/:chatId', protect, getChatMessages);

module.exports = router; 