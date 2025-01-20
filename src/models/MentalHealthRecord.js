const mongoose = require('mongoose');

const mentalHealthRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['assessment', 'session', 'report', 'observation'],
    required: true
  },
  encryptedData: {
    type: Object,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'archived'],
    default: 'open'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add index for faster queries
mentalHealthRecordSchema.index({ userId: 1, type: 1, status: 1 });

module.exports = mongoose.model('MentalHealthRecord', mentalHealthRecordSchema); 