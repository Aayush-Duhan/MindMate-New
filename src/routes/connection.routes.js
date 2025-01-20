const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  generateConnectionCode,
  connectWithChild,
  getConnectedChildren
} = require('../controllers/connection.controller');

router.post('/generate-code', protect, generateConnectionCode);
router.post('/connect', protect, connectWithChild);
router.get('/children', protect, getConnectedChildren);

module.exports = router;
