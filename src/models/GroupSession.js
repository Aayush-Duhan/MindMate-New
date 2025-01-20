const mongoose = require('mongoose');

const groupSessionSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  notes: {
    type: String,
    trim: true
  },
  recordingUrl: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for querying upcoming sessions
groupSessionSchema.index({ date: 1, status: 1 });

// Method to check if session can be joined
groupSessionSchema.methods.canJoin = function() {
  return this.status === 'scheduled' || this.status === 'ongoing';
};

const GroupSession = mongoose.model('GroupSession', groupSessionSchema);
module.exports = GroupSession;
