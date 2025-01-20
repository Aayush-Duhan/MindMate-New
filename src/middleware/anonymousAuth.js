const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');
const AnonymousChat = require('../models/AnonymousChat');

const validateAnonymousAccess = async (req, res, next) => {
  try {
    // Check MongoDB connection status
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB not connected. Current state:', mongoose.connection.readyState);
      return res.status(503).json({ message: 'Database connection unavailable' });
    }

    // Check if request is from counselor
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        
        if (!req.user) {
          return res.status(401).json({ message: 'User not found' });
        }
        
        return next();
      } catch (err) {
        console.error('Token validation error:', err);
        return res.status(401).json({ message: 'Invalid token' });
      }
    }

    // For anonymous access
    const anonymousId = req.headers['x-anonymous-id'];
    const chatId = req.params.chatId;

    if (!anonymousId && req.path !== '/create') {
      return res.status(401).json({ message: 'Anonymous ID required' });
    }

    if (chatId) {
      const chat = await AnonymousChat.findById(chatId);
      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
      }

      if (chat.anonymousId !== anonymousId) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      // Add chat to request for later use
      req.chat = chat;
    }

    // For anonymous access, mark the request
    req.isAnonymous = true;
    next();
  } catch (error) {
    console.error('Anonymous auth error:', {
      error: error.message,
      stack: error.stack,
      headers: req.headers,
      params: req.params
    });
    res.status(500).json({ message: 'Error validating access', error: error.message });
  }
};

module.exports = { validateAnonymousAccess }; 