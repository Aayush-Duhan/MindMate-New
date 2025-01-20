const axios = require('axios');

// Simple in-memory cache
const cache = {
    dailyQuote: null,
    lastFetched: null
};

// Cache duration in milliseconds (24 hours)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// @desc    Get daily quote
// @route   GET /api/v1/quotes/daily
// @access  Public
exports.getDailyQuote = async (req, res) => {
    try {
        // Check if we have a cached quote that's less than 24 hours old
        const now = new Date();
        if (cache.dailyQuote && cache.lastFetched && 
            (now.getTime() - cache.lastFetched.getTime() < CACHE_DURATION)) {
            return res.status(200).json({
                success: true,
                data: cache.dailyQuote,
                cached: true
            });
        }

        const response = await axios.get('https://zenquotes.io/api/today');
        const quote = response.data[0];
        
        // Update cache
        cache.dailyQuote = {
            text: quote.q,
            author: quote.a
        };
        cache.lastFetched = now;
        
        res.status(200).json({
            success: true,
            data: cache.dailyQuote
        });
    } catch (error) {
        // Use cached quote as fallback if available
        if (cache.dailyQuote) {
            return res.status(200).json({
                success: true,
                data: cache.dailyQuote,
                cached: true,
                fallback: true
            });
        }

        // Ultimate fallback quote
        res.status(200).json({
            success: true,
            data: {
                text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
                author: "Nelson Mandela"
            },
            fallback: true
        });
    }
};

// Cache for random quotes
const randomQuotesCache = [];
const RANDOM_CACHE_SIZE = 50;

// @desc    Get random quote
// @route   GET /api/v1/quotes/random
// @access  Public
exports.getRandomQuote = async (req, res) => {
    try {
        // If we have cached quotes, return a random one
        if (randomQuotesCache.length > 0) {
            const randomIndex = Math.floor(Math.random() * randomQuotesCache.length);
            return res.status(200).json({
                success: true,
                data: randomQuotesCache[randomIndex],
                cached: true
            });
        }

        // If cache is empty, fetch new quotes
        const response = await axios.get('https://zenquotes.io/api/random');
        const quote = response.data[0];
        
        // Add to cache if not already present
        const newQuote = {
            text: quote.q,
            author: quote.a
        };
        
        if (randomQuotesCache.length < RANDOM_CACHE_SIZE) {
            randomQuotesCache.push(newQuote);
        }
        
        res.status(200).json({
            success: true,
            data: newQuote
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error fetching quote'
        });
    }
};
