const Analytics = require('../models/Analytics');
const User = require('../models/User');
const MoodEntry = require('../models/MoodEntry');
const Chat = require('../models/Chat');

// Get user engagement metrics
const getUserEngagement = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    
    const analytics = await Analytics.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          lastAccess: { $max: '$timestamp' }
        }
      }
    ]);

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};

// Get system-wide analytics (admin only)
const getSystemAnalytics = async (req, res) => {
  try {
    const [
      userCount,
      activeUsers,
      moodEntries,
      chatCount
    ] = await Promise.all([
      User.countDocuments(),
      Analytics.distinct('userId', {
        timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      MoodEntry.countDocuments(),
      Chat.countDocuments()
    ]);

    res.json({
      totalUsers: userCount,
      activeUsersLast7Days: activeUsers.length,
      totalMoodEntries: moodEntries,
      totalChats: chatCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching system analytics', error: error.message });
  }
};

// Get resource usage analytics
const getResourceAnalytics = async (req, res) => {
  try {
    const analytics = await Analytics.aggregate([
      { $match: { type: 'resource_access' } },
      {
        $group: {
          _id: '$metadata.resourceId',
          accessCount: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          accessCount: 1,
          uniqueUserCount: { $size: '$uniqueUsers' }
        }
      }
    ]);

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resource analytics', error: error.message });
  }
};

module.exports = {
  getUserEngagement,
  getSystemAnalytics,
  getResourceAnalytics
}; 