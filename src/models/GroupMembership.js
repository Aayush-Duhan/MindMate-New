const mongoose = require('mongoose');

const groupMembershipSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['participant', 'facilitator'],
    default: 'participant'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
});

// Compound index for unique membership
groupMembershipSchema.index({ group: 1, user: 1 }, { unique: true });

// Method to check if user is facilitator
groupMembershipSchema.methods.isFacilitator = function() {
  return this.role === 'facilitator';
};

const GroupMembership = mongoose.model('GroupMembership', groupMembershipSchema);
module.exports = GroupMembership;
