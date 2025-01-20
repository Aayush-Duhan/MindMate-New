const mongoose = require('mongoose');

const sharedMoodDataSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  counselorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shareType: {
    type: String,
    enum: ['weekly', 'monthly', 'custom'],
    required: true
  },
  dateRange: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  message: String,
  moodEntries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MoodEntry'
  }],
  summary: {
    dominantMood: String,
    averageIntensity: Number,
    totalEntries: Number
  },
  status: {
    type: String,
    enum: ['pending', 'viewed', 'archived'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SharedMoodData', sharedMoodDataSchema); 