const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['login', 'session', 'resource_access', 'mood_entry', 'chat'],
    required: true
  },
  metadata: {
    type: Object,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for faster queries
analyticsSchema.index({ userId: 1, type: 1, timestamp: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema); 