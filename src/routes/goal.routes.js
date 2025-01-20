const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Goal = require('../models/Goal');

// Get all goals
router.get('/', protect, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: goals });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new goal
router.post('/', protect, async (req, res) => {
  try {
    const goal = new Goal({
      ...req.body,
      user: req.user.id,
      progress: 0,
      status: 'not-started'
    });
    
    const savedGoal = await goal.save();
    res.status(201).json({ success: true, data: savedGoal });
  } catch (error) {
    console.error('Error creating goal:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        error: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update goal progress
router.put('/:id/progress', protect, async (req, res) => {
  try {
    const { progress } = req.body;
    
    if (progress === undefined || progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        error: 'Please provide valid progress value between 0 and 100'
      });
    }

    let status = 'in-progress';
    if (progress === 0) status = 'not-started';
    if (progress === 100) {
      status = 'completed';
    }

    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { 
        $set: { 
          progress,
          status,
          completedAt: status === 'completed' ? new Date() : null
        } 
      },
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }

    res.json({ success: true, data: goal });
  } catch (error) {
    console.error('Error updating goal progress:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete goal
router.delete('/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!goal) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }

    res.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
