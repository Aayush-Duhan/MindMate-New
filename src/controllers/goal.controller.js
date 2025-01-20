const Goal = require('../models/Goal');
const asyncHandler = require('../middleware/async');

// Create new goal
const createGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.create({
    ...req.body,
    userId: req.user._id
  });

  res.status(201).json({
    success: true,
    data: goal
  });
});

// Get all goals for a user
const getGoals = asyncHandler(async (req, res) => {
  const { status, category, archived } = req.query;
  
  // Build query
  const query = { userId: req.user._id };
  
  if (status) query.status = status;
  if (category) query.category = category;
  if (archived !== undefined) query.isArchived = archived === 'true';

  const goals = await Goal.find(query).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: goals.length,
    data: goals
  });
});

// Get single goal
const getGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!goal) {
    return res.status(404).json({
      success: false,
      error: 'Goal not found'
    });
  }

  res.json({
    success: true,
    data: goal
  });
});

// Update goal
const updateGoal = asyncHandler(async (req, res) => {
  let goal = await Goal.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!goal) {
    return res.status(404).json({
      success: false,
      error: 'Goal not found'
    });
  }

  // Update goal
  goal = await Goal.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.json({
    success: true,
    data: goal
  });
});

// Delete goal
const deleteGoal = asyncHandler(async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ 
      _id: req.params.id,
      userId: req.user._id 
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    res.json({
      success: true,
      data: goal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update goal progress
const updateProgress = asyncHandler(async (req, res) => {
  try {
    const { progress } = req.body;
  
    if (progress === undefined || progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        error: 'Please provide valid progress value between 0 and 100'
      });
    }

    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { progress, status: progress === 100 ? 'Completed' : 'In Progress' } },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    res.json({
      success: true,
      data: goal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add milestone to goal
const addMilestone = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user._id
    },
    {
      $push: { milestones: req.body }
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!goal) {
    return res.status(404).json({
      success: false,
      error: 'Goal not found'
    });
  }

  res.json({
    success: true,
    data: goal
  });
});

// Update milestone status
const updateMilestone = asyncHandler(async (req, res) => {
  const { milestoneId } = req.params;
  const { completed } = req.body;

  const goal = await Goal.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user._id,
      'milestones._id': milestoneId
    },
    {
      $set: { 'milestones.$.completed': completed }
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!goal) {
    return res.status(404).json({
      success: false,
      error: 'Goal or milestone not found'
    });
  }

  res.json({
    success: true,
    data: goal
  });
});

module.exports = {
  createGoal,
  getGoals,
  getGoal,
  updateGoal,
  deleteGoal,
  updateProgress,
  addMilestone,
  updateMilestone
};
