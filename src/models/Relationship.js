const mongoose = require('mongoose');

const RelationshipSchema = new mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  relationshipType: {
    type: String,
    enum: ['mother', 'father', 'guardian', 'other'],
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique parent-child relationships
RelationshipSchema.index({ parentId: 1, childId: 1 }, { unique: true });

module.exports = mongoose.model('Relationship', RelationshipSchema);
