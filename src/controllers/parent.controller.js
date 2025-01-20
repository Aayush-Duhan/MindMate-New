const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get parent profile
// @route   GET /api/parent/profile
// @access  Private
exports.getParentProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('name email phone profile.childName');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  if (user.role !== 'parent') {
    return next(new ErrorResponse('Not authorized to access parent profile', 403));
  }

  res.status(200).json({
    success: true,
    data: {
      name: user.name,
      email: user.email,
      phone: user.phone || null,
      childName: user.profile?.childName || ''
    }
  });
});

// @desc    Update parent profile
// @route   PUT /api/parent/profile
// @access  Private
exports.updateParentProfile = asyncHandler(async (req, res, next) => {
  const { name, email, phone, childName } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  if (user.role !== 'parent') {
    return next(new ErrorResponse('Not authorized to update parent profile', 403));
  }

  // Update basic fields
  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;

  // Update or initialize profile if it doesn't exist
  if (!user.profile) {
    user.profile = {};
  }
  user.profile.childName = childName || user.profile.childName;

  await user.save();

  res.status(200).json({
    success: true,
    data: {
      name: user.name,
      email: user.email,
      phone: user.phone || null,
      childName: user.profile.childName
    }
  });
});
