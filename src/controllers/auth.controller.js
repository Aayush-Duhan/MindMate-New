const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      preferences: {
        theme: 'dark',
        notifications: true,
        emailUpdates: true
      }
    });

    if (user) {
      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          preferences: user.preferences
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    
    // Check for user email
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check password using the matchPassword method
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Update last active
    user.lastActive = Date.now();
    await user.save({ validateBeforeSave: false }); // Skip validation during login

    // Generate token using the method from User model
    const token = user.getSignedJwtToken();
    
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name || '',
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add this new function to get all users
const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const query = { 
      _id: { $ne: req.user._id },
      isActive: true 
    };
    
    // Add role filter if specified
    if (role) {
      query.role = role;
    }
    
    const users = await User.find(query)
      .select('email role profile')
      .sort('profile.firstName');
    
    // Transform the data to ensure profile fields are present
    const transformedUsers = users.map(user => ({
      _id: user._id,
      email: user.email,
      role: user.role,
      profile: {
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        ...user.profile
      }
    }));
    
    res.json(transformedUsers);
  } catch (error) {
    console.error('Error in getUsers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add this new function
const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Verify the old token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    
    // Get user from token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new token
    const newToken = generateToken(user._id);

    res.json({
      success: true,
      token: newToken
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  getUsers,
  refreshToken
}; 