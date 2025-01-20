const School = require('../models/School');

// @desc    Create new school
// @route   POST /api/schools
// @access  Private/Admin
const createSchool = async (req, res) => {
  try {
    const { name, address, contact } = req.body;

    const school = await School.create({
      name,
      adminId: req.user._id,
      address,
      contact
    });

    res.status(201).json(school);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all schools
// @route   GET /api/schools
// @access  Private/Admin
const getSchools = async (req, res) => {
  try {
    const schools = await School.find().populate('adminId', 'email profile');
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single school
// @route   GET /api/schools/:id
// @access  Private
const getSchool = async (req, res) => {
  try {
    const school = await School.findById(req.params.id).populate('adminId', 'email profile');
    
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    res.json(school);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update school
// @route   PUT /api/schools/:id
// @access  Private/Admin
const updateSchool = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);

    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    // Check if user is admin of this school
    if (school.adminId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this school' });
    }

    const updatedSchool = await School.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedSchool);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createSchool,
  getSchools,
  getSchool,
  updateSchool
}; 