const User = require('../models/User');
const Goal = require('../models/Goal');
const asyncHandler = require('../middleware/async');

// @desc    Get student profile
// @route   GET /api/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Getting profile for user:', userId);
    
    // Get user data
    const user = await User.findById(userId).select('-password');
    console.log('Found user:', user);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Handle parent profile differently
    if (user.role === 'parent') {
      console.log('Handling parent profile');
      return res.json({
        success: true,
        data: {
          name: user.name,
          email: user.email,
          phone: user.phone || null,
          childName: user.profile?.childName || '',
          avatar: user.avatar
        }
      });
    }
    
    // For other roles (student, etc.)
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

// @desc    Update profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Updating profile for user:', userId);
    console.log('Update data:', req.body);

    // Find user and allow updating email
    const user = await User.findById(userId);
    console.log('Current user data:', user);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Handle parent profile update
    if (user.role === 'parent') {
      const { name, email, phone } = req.body;
      console.log('Updating parent profile with:', { name, email, phone });

      // Validate email uniqueness if it's being changed
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email, _id: { $ne: userId } });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            error: 'Email already in use'
          });
        }
      }

      try {
        // First try to add phone field if it doesn't exist
        await User.collection.updateOne(
          { _id: user._id },
          { $set: { phone: null } },
          { upsert: false }
        );

        // Update fields
        const updates = {};
        if (name) updates.name = name.trim();
        if (email) updates.email = email.trim();
        if (phone !== undefined) updates.phone = phone ? phone.trim() : null;

        console.log('Applying updates:', updates);

        // Update user with the changes
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $set: updates },
          { 
            new: true, 
            runValidators: true,
            context: 'query'
          }
        ).select('-password');

        console.log('Updated user:', updatedUser);

        if (!updatedUser) {
          throw new Error('Failed to update user');
        }

        return res.json({
          success: true,
          data: {
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone || null,
            avatar: updatedUser.avatar || null
          }
        });
      } catch (updateError) {
        console.error('Error during update operation:', updateError);
        return res.status(500).json({
          success: false,
          error: updateError.message || 'Error updating profile'
        });
      }
    }

    // Handle other roles (student, counselor, etc.)
    const { name, email, phone, preferences } = req.body;

    try {
      // First try to add phone field if it doesn't exist
      await User.collection.updateOne(
        { _id: user._id },
        { $set: { phone: null } },
        { upsert: false }
      );

      // Update fields
      const updates = {};
      if (name) updates.name = name.trim();
      if (email) updates.email = email.trim();
      if (phone !== undefined) updates.phone = phone ? phone.trim() : null;
      if (preferences) updates.preferences = { ...user.preferences, ...preferences };

      console.log('Applying updates:', updates);

      // Update user with the changes
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { 
          new: true, 
          runValidators: true,
          context: 'query'
        }
      ).select('-password');

      console.log('Updated user:', updatedUser);

      if (!updatedUser) {
        throw new Error('Failed to update user');
      }

      return res.json({
        success: true,
        data: {
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone || null,
          preferences: updatedUser.preferences,
          avatar: updatedUser.avatar || null
        }
      });
    } catch (updateError) {
      console.error('Error during update operation:', updateError);
      return res.status(500).json({
        success: false,
        error: updateError.message || 'Error updating profile'
      });
    }
  } catch (error) {
    console.error('Error in profile update:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Email already in use'
      });
    }
    return res.status(500).json({
      success: false,
      error: error.message || 'Error updating profile'
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
