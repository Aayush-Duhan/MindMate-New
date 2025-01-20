const User = require('../models/User');
const ConnectionCode = require('../models/ConnectionCode');
const Relationship = require('../models/Relationship');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// Generate a random 4-digit code
const generateConnectionCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// @desc    Generate connection code for student
// @route   POST /api/connection/generate-code
// @access  Private
exports.generateConnectionCode = asyncHandler(async (req, res, next) => {
  const student = await User.findById(req.user.id);

  if (!student) {
    return next(new ErrorResponse('User not found', 404));
  }

  if (student.role !== 'student') {
    return next(new ErrorResponse('Only students can generate connection codes', 403));
  }

  // Generate new code and set expiration to 1 hour from now
  const code = generateConnectionCode();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Create new connection code
  const connectionCode = await ConnectionCode.create({
    code,
    studentId: student._id,
    expiresAt
  });

  res.status(200).json({
    success: true,
    data: {
      code,
      expiresAt
    }
  });
});

// @desc    Connect parent with child using code
// @route   POST /api/connection/connect
// @access  Private
exports.connectWithChild = asyncHandler(async (req, res, next) => {
  const { code, relationshipType } = req.body;

  if (!code) {
    return next(new ErrorResponse('Please provide a connection code', 400));
  }

  if (!relationshipType) {
    return next(new ErrorResponse('Please specify your relationship with the child', 400));
  }

  const parent = await User.findById(req.user.id);

  if (!parent) {
    return next(new ErrorResponse('User not found', 404));
  }

  if (parent.role !== 'parent') {
    return next(new ErrorResponse('Only parents can connect with children', 403));
  }

  // Find valid connection code
  const connectionCode = await ConnectionCode.findOne({
    code,
    isUsed: false,
    expiresAt: { $gt: new Date() }
  });

  if (!connectionCode) {
    return next(new ErrorResponse('Invalid or expired connection code', 400));
  }

  // Get student details
  const student = await User.findById(connectionCode.studentId);
  if (!student) {
    return next(new ErrorResponse('Student not found', 404));
  }

  try {
    // Check if relationship already exists
    const existingRelationship = await Relationship.findOne({
      parentId: parent._id,
      childId: student._id
    });

    if (existingRelationship) {
      return next(new ErrorResponse('Already connected with this child', 400));
    }

    // Create relationship
    const relationship = await Relationship.create({
      parentId: parent._id,
      childId: student._id,
      relationshipType
    });

    // Mark code as used
    connectionCode.isUsed = true;
    await connectionCode.save();

    res.status(200).json({
      success: true,
      message: 'Successfully connected with child',
      data: {
        childName: student.name || 'Unknown',
        childEmail: student.email || '',
        relationship: relationship.relationshipType
      }
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new ErrorResponse('Already connected with this child', 400));
    }
    throw err;
  }
});

// @desc    Get connected children for parent
// @route   GET /api/connection/children
// @access  Private
exports.getConnectedChildren = asyncHandler(async (req, res, next) => {
  const parent = await User.findById(req.user.id);

  if (!parent) {
    return next(new ErrorResponse('User not found', 404));
  }

  if (parent.role !== 'parent') {
    return next(new ErrorResponse('Only parents can view connected children', 403));
  }

  // Find all active relationships for this parent
  const relationships = await Relationship.find({ 
    parentId: parent._id,
    status: 'active'
  }).populate('childId', 'name email');

  const children = relationships.map(rel => ({
    id: rel.childId._id,
    name: rel.childId.name || 'Unknown',
    email: rel.childId.email || '',
    relationshipType: rel.relationshipType,
    connectedSince: rel.createdAt
  }));

  res.status(200).json({
    success: true,
    data: children
  });
});
