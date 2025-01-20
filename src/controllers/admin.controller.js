const User = require('../models/User');

const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin profile not found'
      });
    }

    res.json({
      success: true,
      profile: {
        firstName: admin.profile?.firstName || '',
        lastName: admin.profile?.lastName || '',
        email: admin.email,
        phone: admin.profile?.phone || '',
        department: admin.profile?.department || '',
        joinDate: admin.createdAt,
        lastLogin: admin.lastLogin || admin.createdAt
      }
    });
  } catch (error) {
    console.error('Error in getAdminProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin profile',
      error: error.message
    });
  }
};

const updateAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin profile not found'
      });
    }

    const { firstName, lastName, email, phone, department } = req.body;

    admin.profile = {
      ...admin.profile,
      firstName,
      lastName,
      phone,
      department
    };
    admin.email = email;

    await admin.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: {
        firstName: admin.profile.firstName,
        lastName: admin.profile.lastName,
        email: admin.email,
        phone: admin.profile.phone,
        department: admin.profile.department,
        joinDate: admin.createdAt,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    console.error('Error in updateAdminProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating admin profile',
      error: error.message
    });
  }
};

module.exports = {
  getAdminProfile,
  updateAdminProfile
}; 