const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Chat = require('../models/Chat');

// Debug middleware
router.use((req, res, next) => {
  console.log(`Counselor Route accessed: ${req.method} ${req.url}`);
  next();
});

// Get counselor stats
router.get('/stats', protect, authorize('counselor'), async (req, res) => {
  try {
    // Get active students (users with active chats with this counselor)
    const activeChats = await Chat.find({
      participants: req.user.id,
      status: 'active'
    });

    // Get unique student count from active chats
    const activeStudents = new Set(
      activeChats.flatMap(chat => 
        chat.participants.filter(p => p.toString() !== req.user.id.toString())
      )
    ).size;

    // Get total sessions
    const totalSessions = await Chat.countDocuments({
      participants: req.user.id
    });

    res.json({
      success: true,
      activeStudents,
      totalSessions
    });
  } catch (error) {
    console.error('Error fetching counselor stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get counselor profile
router.get('/profile', protect, authorize('counselor'), async (req, res) => {
  try {
    console.log('Fetching counselor profile for user:', req.user.id);
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      console.log('User not found');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('User found:', user);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error in /profile route:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update counselor profile
router.put('/profile', protect, authorize('counselor'), async (req, res) => {
  try {
    const {
      name,
      email,
      specialization,
      bio,
      yearsOfExperience,
      profile
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.name = name;
    user.email = email;
    user.specialization = specialization;
    user.bio = bio;
    user.yearsOfExperience = yearsOfExperience;
    user.profile = {
      ...user.profile,
      ...profile
    };

    await user.save();

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error updating counselor profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 