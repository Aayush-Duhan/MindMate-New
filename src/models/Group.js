const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  facilitator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  groupType: {
    type: String,
    enum: ['academic', 'emotional', 'behavioral', 'social', 'general'],
    required: true,
    default: 'general'
  },
  maxParticipants: {
    type: Number,
    required: true,
    default: 15
  },
  schedule: {
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6
    },
    time: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    },
    duration: {
      type: Number,
      required: true,
      default: 60
    }
  },
  topics: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for current participants count
groupSchema.virtual('participantCount', {
  ref: 'GroupMembership',
  localField: '_id',
  foreignField: 'group',
  count: true,
  match: { status: 'active' }
});

// Check if group is full
groupSchema.methods.isFull = async function() {
  const count = await this.model('GroupMembership').countDocuments({
    group: this._id,
    status: 'active'
  });
  return count >= this.maxParticipants;
};

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
