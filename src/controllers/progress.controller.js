const Goal = require('../models/Goal');
const asyncHandler = require('../middleware/async');

const getStudentProgress = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all goals for the user
    const goals = await Goal.find({ 
      user: userId,
      isArchived: { $ne: true } 
    }).sort('-updatedAt');
    
    // Calculate completed and ongoing goals
    const completedGoals = goals.filter(goal => goal.status === 'completed').length;
    const ongoingGoals = goals.filter(goal => goal.status === 'in-progress').length;
    const notStartedGoals = goals.filter(goal => goal.status === 'not-started').length;

    // Initialize category progress with new categories
    const categoryProgress = {
      'Academic': 0,
      'Mental Health': 0,
      'Social': 0,
      'Personal': 0,
      'Other': 0
    };

    const categoryStats = {
      'Academic': { total: 0, totalProgress: 0 },
      'Mental Health': { total: 0, totalProgress: 0 },
      'Social': { total: 0, totalProgress: 0 },
      'Personal': { total: 0, totalProgress: 0 },
      'Other': { total: 0, totalProgress: 0 }
    };

    // Calculate category-wise progress
    goals.forEach(goal => {
      const category = goal.category;
      if (category && categoryStats[category]) {
        categoryStats[category].total++;
        categoryStats[category].totalProgress += goal.progress || 0;
      }
    });

    // Calculate percentages for each category
    Object.keys(categoryProgress).forEach(category => {
      if (categoryStats[category].total > 0) {
        categoryProgress[category] = Math.round(
          categoryStats[category].totalProgress / categoryStats[category].total
        );
      }
    });

    // Calculate overall progress as the average progress of all goals
    const totalGoals = goals.length;
    const overallProgress = totalGoals > 0
      ? Math.round(
          goals.reduce((sum, goal) => sum + (goal.progress || 0), 0) / totalGoals
        )
      : 0;

    // Get recent achievements (completed goals)
    const recentAchievements = goals
      .filter(goal => goal.status === 'completed')
      .sort((a, b) => b.completedAt - a.completedAt)
      .slice(0, 5)
      .map(goal => ({
        id: goal._id,
        title: goal.title,
        category: goal.category,
        completedAt: goal.completedAt
      }));

    // Get upcoming goals (not completed, sorted by target date)
    const upcomingGoals = goals
      .filter(goal => goal.status !== 'completed')
      .sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate))
      .slice(0, 5)
      .map(goal => ({
        id: goal._id,
        title: goal.title,
        category: goal.category,
        targetDate: goal.targetDate,
        progress: goal.progress || 0
      }));

    res.json({
      success: true,
      data: {
        overallProgress,
        totalGoals,
        completedGoals,
        ongoingGoals,
        notStartedGoals,
        categoryProgress,
        categoryStats,
        recentAchievements,
        upcomingGoals
      }
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching progress data'
    });
  }
});

module.exports = {
  getStudentProgress
};
