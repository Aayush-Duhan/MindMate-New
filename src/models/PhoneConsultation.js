const mongoose = require('mongoose');

const phoneConsultationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  counselor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'cancelled'],
    default: 'pending'
  },
  requestTime: {
    type: Date,
    default: Date.now
  },
  scheduledTime: {
    type: Date
  },
  duration: {
    type: Number,
    default: 30 // Duration in minutes
  },
  reason: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  priority: {
    type: String,
    enum: ['normal', 'urgent'],
    default: 'normal'
  },
  phoneNumber: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PhoneConsultation', phoneConsultationSchema);
