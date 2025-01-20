const Analytics = require('../models/Analytics');
const User = require('../models/User');
const MoodEntry = require('../models/MoodEntry');
const Chat = require('../models/Chat');
const mongoose = require('mongoose');

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
    const timeRange = req.query.timeRange || 'week';
    let timeFilter;
    
    switch(timeRange) {
      case 'day':
        timeFilter = 24 * 60 * 60 * 1000; // 1 day in ms
        break;
      case 'week':
        timeFilter = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
        break;
      case 'month':
        timeFilter = 30 * 24 * 60 * 60 * 1000; // 30 days in ms
        break;
      default:
        timeFilter = 7 * 24 * 60 * 60 * 1000; // default to week
    }

    const startDate = new Date(Date.now() - timeFilter);

    const [
      totalUsers,
      activeUsers,
      totalSessions,
      userActivity,
      userTypes,
      userEngagement
    ] = await Promise.all([
      User.countDocuments(),
      Analytics.distinct('userId', {
        timestamp: { $gte: startDate }
      }),
      // Calculate total sessions by summing totalMindsessions from all users
      User.aggregate([
        {
          $group: {
            _id: null,
            totalSessions: { $sum: "$totalMindsessions" }
          }
        }
      ]).then(result => result[0]?.totalSessions || 0),
      // Mind sessions activity over time
      User.aggregate([
        {
          $match: {
            lastActive: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$lastActive" }
            },
            dailySessions: { $sum: "$totalMindsessions" }
          }
        },
        {
          $sort: { "_id": 1 }
        },
        {
          $project: {
            _id: 1,
            count: "$dailySessions"
          }
        }
      ]),
      // User types distribution
      User.aggregate([
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 }
          }
        }
      ]),
      // User engagement (streak days)
      User.aggregate([
        {
          $group: {
            _id: null,
            lowStreak: {
              $sum: {
                $cond: [{ $and: [
                  { $gte: ["$streakDays", 1] },
                  { $lte: ["$streakDays", 7] }
                ]}, 1, 0]
              }
            },
            mediumStreak: {
              $sum: {
                $cond: [{ $and: [
                  { $gte: ["$streakDays", 8] },
                  { $lte: ["$streakDays", 14] }
                ]}, 1, 0]
              }
            },
            highStreak: {
              $sum: {
                $cond: [{ $and: [
                  { $gte: ["$streakDays", 15] },
                  { $lte: ["$streakDays", 30] }
                ]}, 1, 0]
              }
            },
            superStreak: {
              $sum: {
                $cond: [
                  { $gt: ["$streakDays", 30] },
                  1,
                  0
                ]
              }
            }
          }
        }
      ])
    ]);

    // Add empty dates between start date and now
    const dates = [];
    const now = new Date();
    let currentDate = new Date(startDate);
    
    while (currentDate <= now) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Fill in missing dates with 0 counts
    const activityMap = new Map(userActivity.map(item => [item._id, item.count]));
    const filledActivity = dates.map(date => ({
      _id: date,
      count: activityMap.get(date) || 0
    }));

    const response = {
      success: true,
      analytics: {
        overview: {
          totalUsers,
          activeUsers: activeUsers.length,
          totalSessions
        },
        userActivity: {
          labels: filledActivity.map(item => item._id),
          data: filledActivity.map(item => item.count)
        },
        userTypes: {
          labels: userTypes.map(item => item._id),
          data: userTypes.map(item => item.count)
        },
        userEngagement: {
          lowStreak: userEngagement[0]?.lowStreak || 0,
          mediumStreak: userEngagement[0]?.mediumStreak || 0,
          highStreak: userEngagement[0]?.highStreak || 0,
          superStreak: userEngagement[0]?.superStreak || 0
        }
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error in getSystemAnalytics:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching system analytics', 
      error: error.message 
    });
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