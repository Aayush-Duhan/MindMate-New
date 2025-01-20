const MoodEntry = require('../models/MoodEntry');

// Create new mood entry
const createMoodEntry = async (req, res) => {
  try {
    const { mood, intensity, notes, activities, triggers, tags } = req.body;
    
    const moodEntry = await MoodEntry.create({
      userId: req.user._id,
      mood,
      intensity,
      notes,
      activities,
      triggers,
      tags
    });

    res.status(201).json({
      success: true,
      data: moodEntry
    });
  } catch (error) {
    console.error('Error creating mood entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating mood entry',
      error: error.message
    });
  }
};

// Get user's mood entries
const getMoodEntries = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { userId: req.user._id };

    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const moodEntries = await MoodEntry.find(query)
      .sort({ timestamp: -1 })
      .limit(100);

    res.json({
      success: true,
      data: moodEntries
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
const getMoodStats = async (req, res) => {
  try {
    const stats = await MoodEntry.aggregate([
      { $match: { userId: req.user._id } },
      { $group: {
        _id: '$mood',
        count: { $sum: 1 },
        avgIntensity: { $avg: '$intensity' }
      }}
    ]);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching mood stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mood statistics',
      error: error.message
    });
  }
};

module.exports = {
  createMoodEntry,
  getMoodEntries,
  getMoodStats
}; 