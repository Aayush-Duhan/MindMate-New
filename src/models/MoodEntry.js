const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  counselorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'anxious', 'calm', 'stressed', 'energetic', 'tired', 'neutral'],
    required: true
  },
  intensity: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  entryType: {
    type: String,
    enum: ['quick', 'detailed'],
    default: 'quick'
  },
  isPrivate: {
    type: Boolean,
    default: true
  },
  sharedWithCounselor: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true
  },
  activities: [{
    type: String,
    enum: ['exercise', 'work', 'social', 'family', 'hobby', 'rest', 'study', 'meditation']
  }],
  triggers: [String],
  tags: [String],
  mediaUrls: [String],
  weather: {
    condition: String,
    temperature: Number
  }
}, {
  timestamps: true
});

// Add index for faster queries
moodEntrySchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('MoodEntry', moodEntrySchema); 