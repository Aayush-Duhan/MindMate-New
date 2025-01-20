const MoodEntry = require('../models/MoodEntry');
const asyncHandler = require('../middleware/async');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const SharedMoodData = require('../models/SharedMoodData');

// Create new mood entry
const createMoodEntry = asyncHandler(async (req, res) => {
  try {
    const { mood, intensity, notes, activities, triggers, tags } = req.body;
    
    const moodEntry = await MoodEntry.create({
      user: req.user.id,
      mood,
      intensity: intensity || 3, // Changed default from 5 to 3 for a more neutral default
      notes: notes || '',
      activities: activities || [],
      triggers: triggers || [],
      tags: tags || []
    });

    res.status(201).json({
      success: true,
      data: moodEntry
    });
  } catch (error) {
    console.error('Error creating mood entry:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's mood entries
const getMoodEntries = async (req, res) => {
  try {
    const entries = await MoodEntry.find({ userId: req.user._id })
      .sort({ timestamp: -1 }); // Get all entries, sorted by most recent first

    // Format the entries for frontend
    const formattedEntries = entries.map(entry => ({
      _id: entry._id,
      mood: entry.mood,
      intensity: entry.intensity,
      timestamp: entry.timestamp,
      notes: entry.notes,
      activities: entry.activities
    }));

    res.json({
      success: true,
      data: formattedEntries
    });
  } catch (error) {
    console.error('Error fetching mood entries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mood entries',
      error: error.message
    });
  }
};

// Get mood statistics
const getMoodStats = asyncHandler(async (req, res) => {
  try {
    const stats = await MoodEntry.aggregate([
      { 
        $match: { 
          user: req.user.id,
          timestamp: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30))
          }
        }
      },
      {
        $group: {
          _id: '$mood',
          count: { $sum: 1 },
          avgIntensity: { $avg: '$intensity' }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching mood stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Share mood entries with counselor
const shareMoodEntries = asyncHandler(async (req, res) => {
  try {
    const { counselorId, startDate, endDate } = req.body;

    if (!counselorId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a counselor ID'
      });
    }

    // Verify counselor exists
    const counselor = await User.findOne({ 
      _id: counselorId,
      role: 'counselor'
    });

    if (!counselor) {
      return res.status(404).json({
        success: false,
        error: 'Counselor not found'
      });
    }

    const query = { user: req.user.id };
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const moodEntries = await MoodEntry.find(query)
      .sort({ timestamp: -1 });

    res.json({
      success: true,
      data: moodEntries
    });
  } catch (error) {
    console.error('Error sharing mood entries:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    Quick mood check
// @route   POST /api/mood/quick
// @access  Private
const quickMoodCheck = async (req, res) => {
  try {
    const { mood, intensity, timestamp } = req.body;

    // Validate the input
    if (!mood || !intensity) {
      return res.status(400).json({
        success: false,
        message: 'Mood and intensity are required'
      });
    }

    // Validate mood value
    const validMoods = ['happy', 'sad', 'anxious', 'calm', 'stressed', 'energetic', 'tired', 'neutral'];
    if (!validMoods.includes(mood)) {
      return res.status(400).json({
        success: false,
        message: `Invalid mood value. Must be one of: ${validMoods.join(', ')}`
      });
    }

    // Validate intensity
    if (intensity < 1 || intensity > 5) {
      return res.status(400).json({
        success: false,
        message: 'Intensity must be between 1 and 5'
      });
    }

    // Create mood entry
    const moodEntry = await MoodEntry.create({
      userId: req.user._id,
      mood,
      intensity,
      timestamp: timestamp || new Date(),
      entryType: 'quick'
    });

    // Get updated recent entries
    const recentEntries = await MoodEntry.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(5);

    res.status(201).json({
      success: true,
      data: moodEntry,
      recentEntries: recentEntries
    });
  } catch (error) {
    console.error('Error in quick mood check:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording mood',
      error: error.message
    });
  }
};

// Get available counselors
const getAvailableCounselors = async (req, res) => {
  try {
    console.log('Fetching counselors...');
    console.log('User making request:', req.user);

    // First, let's check if we can find any counselors without conditions
    const allCounselors = await User.find({ role: 'counselor' });
    console.log('All counselors found:', allCounselors.length);

    // Then apply the active filter
    const activeCounselors = await User.find({ 
      role: 'counselor',
      isActive: true 
    });
    console.log('Active counselors found:', activeCounselors.length);

    // Format the counselors data
    const formattedCounselors = activeCounselors.map(counselor => ({
      _id: counselor._id,
      name: counselor.name,
      specialization: counselor.specialization,
      profile: counselor.profile
    }));

    console.log('Formatted counselors:', formattedCounselors);

    if (formattedCounselors.length === 0) {
      console.log('Warning: No active counselors found');
    }

    res.json({
      success: true,
      data: formattedCounselors
    });
  } catch (error) {
    console.error('Error fetching counselors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching counselors',
      error: error.message
    });
  }
};

// Share mood data with counselor
const shareMoodData = async (req, res) => {
  try {
    const { counselorId, shareType, message } = req.body;
    const studentId = req.user._id;

    // Validate counselor exists
    const counselor = await User.findOne({ 
      _id: counselorId, 
      role: 'counselor' 
    });

    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: 'Counselor not found'
      });
    }

    // Calculate date range based on share type
    const now = new Date();
    let startDate, endDate = now;

    switch (shareType) {
      case 'weekly':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'monthly':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'custom':
        startDate = new Date(req.body.startDate);
        endDate = new Date(req.body.endDate);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid share type'
        });
    }

    // Get mood entries for the date range
    const moodEntries = await MoodEntry.find({
      userId: studentId,
      timestamp: {
        $gte: startDate,
        $lte: endDate
      }
    });

    // Calculate summary
    const summary = calculateMoodSummary(moodEntries);

    // Create shared data record
    const sharedData = await SharedMoodData.create({
      studentId,
      counselorId,
      shareType,
      dateRange: { start: startDate, end: endDate },
      message,
      moodEntries: moodEntries.map(entry => entry._id),
      summary
    });

    res.status(201).json({
      success: true,
      data: sharedData
    });
  } catch (error) {
    console.error('Error sharing mood data:', error);
    res.status(500).json({
      success: false,
      message: 'Error sharing mood data',
      error: error.message
    });
  }
};

// Calculate user's mood entry streak
const calculateStreak = asyncHandler(async (req, res) => {
  try {
    const entries = await MoodEntry.find({ 
      userId: req.user._id 
    }).sort({ timestamp: -1 });

    if (!entries.length) {
      return res.json({ success: true, streak: 0 });
    }

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Check if there's an entry for today
    const latestEntry = new Date(entries[0].timestamp);
    latestEntry.setHours(0, 0, 0, 0);
    
    if (latestEntry.getTime() !== currentDate.getTime()) {
      return res.json({ success: true, streak: 0 });
    }

    // Calculate streak by checking consecutive days
    streak = 1; // Count today
    for (let i = 1; i < entries.length; i++) {
      const entryDate = new Date(entries[i].timestamp);
      entryDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(currentDate);
      expectedDate.setDate(currentDate.getDate() - i);
      
      if (entryDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    res.json({
      success: true,
      streak,
      lastEntry: entries[0].timestamp
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Error calculating streak' 
    });
  }
});

// Helper function to calculate mood summary
const calculateMoodSummary = (entries) => {
  if (!entries.length) return null;

  const moodCounts = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  const dominantMood = Object.entries(moodCounts)
    .sort(([,a], [,b]) => b - a)[0][0];

  const averageIntensity = entries.reduce((sum, entry) => 
    sum + entry.intensity, 0) / entries.length;

  return {
    dominantMood,
    averageIntensity,
    totalEntries: entries.length
  };
};

module.exports = {
  createMoodEntry,
  getMoodEntries,
  getMoodStats,
  shareMoodEntries,
  quickMoodCheck,
  getAvailableCounselors,
  shareMoodData,
  calculateStreak
};