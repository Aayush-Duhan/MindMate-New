const mongoose = require('mongoose');

const anonymousChatSchema = new mongoose.Schema({
  anonymousId: {
    type: String,
    required: true
  },
  counselorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  encryptedMessages: [{
    content: {
      type: String,
      required: true
    },
    sender: {
      type: String,
      required: true,
      enum: ['anonymous', 'counselor']
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['unassigned', 'active', 'resolved', 'escalated'],
    default: 'unassigned'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['academic', 'personal', 'social', 'mental_health', 'other'],
    required: true
  },
  metadata: {
    lastActivity: Date,
    totalMessages: {
      type: Number,
      default: 0,
      min: 0
    },
    isEmergency: Boolean
  }
}, {
  timestamps: true
});

// Add a pre-save hook to ensure status is set correctly
anonymousChatSchema.pre('save', function(next) {
  // Ensure proper status
  if (this.isNew) {
    this.status = 'unassigned';
  } else if (this.counselorId && this.status === 'unassigned') {
    this.status = 'active';
  }
  
  next();
});

module.exports = mongoose.model('AnonymousChat', anonymousChatSchema); 