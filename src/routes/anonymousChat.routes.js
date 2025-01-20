const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validateAnonymousAccess } = require('../middleware/anonymousAuth');
const {
  createAnonymousChat,
  sendAnonymousMessage,
  getChatMessages,
  assignCounselor,
  getActiveChats,
  sendCounselorMessage,
  getMyChats,
  closeChat
} = require('../controllers/anonymousChat.controller');

// All routes are protected
router.use(protect);

router.post('/create', createAnonymousChat);
router.get('/active', getActiveChats);
router.get('/my-chats', getMyChats);
router.post('/:chatId/counselor-message', sendCounselorMessage);
router.get('/:chatId/messages', getChatMessages);
router.post('/:chatId/message', sendAnonymousMessage);
router.post('/:chatId/assign', assignCounselor);
router.delete('/:chatId/close', closeChat);

module.exports = router; 