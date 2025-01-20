const User = require('../models/User');
const Goal = require('../models/Goal');
const asyncHandler = require('../middleware/async');

// @desc    Get student profile
// @route   GET /api/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user data
    const user = await User.findById(userId).select('-password');
    
    // Get goals statistics
    const goals = await Goal.find({ user: userId });
    const completedGoals = goals.filter(goal => goal.status === 'completed').length;
    const totalGoals = goals.length;
    
    // Calculate completion rate
    const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
    
    // Get recent activity
    const recentActivity = await Goal.find({ user: userId })
      .sort('-updatedAt')
      .limit(5)
      .select('title status progress updatedAt');

    // Prepare response data
    const profileData = {
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        joinedAt: user.createdAt,
        preferences: user.preferences || {},
      },
      stats: {
        totalGoals,
        completedGoals,
        completionRate,
        streakDays: user.streakDays || 0,
        totalMindsessions: user.totalMindsessions || 0,
      },
      recentActivity,
    };

    res.json({
      success: true,
      data: profileData
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching profile data'
    });
  }
});

// @desc    Update student profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, preferences } = req.body;

    // Find and update user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (name) user.name = name;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    res.json({
      success: true,
      data: {
        name: user.name,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating profile'
    });
  }
});

// @desc    Update profile picture
// @route   PUT /api/profile/avatar
// @access  Private
const updateAvatar = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an avatar URL'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      data: {
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Error updating avatar:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating avatar'
    });
  }
});

module.exports = {
  getProfile,
  updateProfile,
  updateAvatar
};
