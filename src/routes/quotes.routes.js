const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getDailyQuote, getRandomQuote } = require('../controllers/quotes.controller');

// Public routes - no authentication needed
router.get('/daily', getDailyQuote);
router.get('/random', getRandomQuote);

module.exports = router;
