const mongoose = require('mongoose');

const videoConsultationSchema = new mongoose.Schema({
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
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
    default: 'pending'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    default: 45, // Duration in minutes
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  meetingLink: {
    type: String
  },
  preferredTimeSlots: [{
    date: Date,
    time: String
  }],
  previousConsultations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VideoConsultation'
  }],
  cancellationReason: {
    type: String
  },
  reminderSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add index for querying consultations by date
videoConsultationSchema.index({ scheduledDate: 1 });

// Add index for querying user's consultations
videoConsultationSchema.index({ user: 1, scheduledDate: -1 });

module.exports = mongoose.model('VideoConsultation', videoConsultationSchema);
