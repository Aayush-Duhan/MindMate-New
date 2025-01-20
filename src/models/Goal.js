const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: {
      values: ['Mental Health', 'Academic', 'Social', 'Personal', 'Other'],
      message: '{VALUE} is not a valid category'
    }
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  priority: {
    type: String,
    required: [true, 'Please select a priority'],
    enum: {
      values: ['High', 'Medium', 'Low'],
      message: '{VALUE} is not a valid priority level'
    },
    default: 'Medium'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  targetDate: {
    type: Date,
    required: [true, 'Please add a target date']
  },
  progress: {
    type: Number,
    min: [0, 'Progress cannot be less than 0'],
    max: [100, 'Progress cannot be more than 100'],
    default: 0
  },
  milestones: [{
    title: {
      type: String,
      required: [true, 'Please add a milestone title'],
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    }
  }],
  completedAt: {
    type: Date
  },
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
goalSchema.index({ user: 1, status: 1 });
goalSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Goal', goalSchema);
