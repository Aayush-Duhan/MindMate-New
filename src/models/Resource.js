const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['academic', 'mental_health', 'social']
  },
  tags: [{
    type: String,
    trim: true
  }],
  targetAudience: {
    type: String,
    required: true,
    enum: ['student', 'parent', 'all'],
    default: 'all'
  },
  isActive: {
    type: Boolean,
    default: true,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  strict: true,
  strictQuery: true
});

// Add index for better query performance
resourceSchema.index({ targetAudience: 1, isActive: 1 });
resourceSchema.index({ category: 1 });
resourceSchema.index({ tags: 1 });

module.exports = mongoose.model('Resource', resourceSchema);