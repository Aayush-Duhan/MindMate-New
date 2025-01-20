import React from 'react';
import { motion } from 'framer-motion';

const MoodStats = ({ entries }) => {
  // Helper function to get mood emoji
  const getMoodEmoji = (mood) => {
    const emojiMap = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      calm: '😌',
      stressed: '😫',
      energetic: '⚡',
      tired: '😴',
      neutral: '😐'
    };
    return emojiMap[mood] || '😐';
  };

  // Calculate mood frequency
  const moodFrequency = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  // Sort moods by frequency
  const sortedMoods = Object.entries(moodFrequency)
    .sort(([, a], [, b]) => b - a);

  // Calculate percentages
  const totalEntries = entries.length;
  const moodPercentages = sortedMoods.map(([mood, count]) => ({
    mood,
    count,
    percentage: ((count / totalEntries) * 100).toFixed(1)
  }));

  // Get mood color
  const getMoodColor = (mood) => {
    const colorMap = {
      happy: 'bg-yellow-500',
      sad: 'bg-blue-500',
      anxious: 'bg-purple-500',
      calm: 'bg-green-500',
      stressed: 'bg-red-500',
      energetic: 'bg-orange-500',
      tired: 'bg-indigo-500',
      neutral: 'bg-gray-500'
    };
    return colorMap[mood] || 'bg-gray-500';
  };

  // Calculate weekly trends
  const getWeeklyTrend = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentEntries = entries.filter(entry => 
      new Date(entry.timestamp) > oneWeekAgo
    );

    if (recentEntries.length === 0) return null;

    const dominantMood = Object.entries(
      recentEntries.reduce((acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
      }, {})
    ).sort(([, a], [, b]) => b - a)[0][0];

    const avgIntensity = (
      recentEntries.reduce((sum, entry) => sum + entry.intensity, 0) / 
      recentEntries.length
    ).toFixed(1);

    return { dominantMood, avgIntensity };
  };

  const weeklyTrend = getWeeklyTrend();

  return (
    <div className="space-y-8">
      {/* Weekly Insight */}
      {weeklyTrend && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30"
        >
          <h3 className="text-gray-400 text-sm mb-3">This Week's Mood</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getMoodEmoji(weeklyTrend.dominantMood)}</span>
              <div>
                <p className="text-white font-medium capitalize">{weeklyTrend.dominantMood}</p>
                <p className="text-sm text-gray-400">Most frequent mood</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">{weeklyTrend.avgIntensity}</p>
              <p className="text-sm text-gray-400">Avg intensity</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mood Distribution */}
      <div className="space-y-4">
        <h3 className="text-gray-400 text-sm">Mood Distribution</h3>
        <div className="space-y-3">
          {moodPercentages.map(({ mood, count, percentage }, index) => (
            <motion.div
              key={mood}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span>{getMoodEmoji(mood)}</span>
                  <span className="text-gray-300 capitalize">{mood}</span>
                </div>
                <div className="text-gray-400 text-sm">
                  {count} ({percentage}%)
                </div>
              </div>
              <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-full ${getMoodColor(mood)} bg-opacity-60`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/30 rounded-lg p-4">
          <p className="text-2xl font-medium text-white">{totalEntries}</p>
          <p className="text-sm text-gray-400">Total Entries</p>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-4">
          <p className="text-2xl font-medium text-white">
            {entries.length > 0 ? 
              (entries.reduce((sum, entry) => sum + entry.intensity, 0) / entries.length).toFixed(1) 
              : '0'}
          </p>
          <p className="text-sm text-gray-400">Average Intensity</p>
        </div>
      </div>
    </div>
  );
};

export default MoodStats;