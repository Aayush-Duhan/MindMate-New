import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AcademicCapIcon,
  HeartIcon,
  UserGroupIcon,
  TrophyIcon,
  CalendarIcon,
  ChartBarIcon,
  SparklesIcon,
  FlagIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import React from 'react';

const CircularProgress = ({ value, size = 'large' }) => {
  const radius = size === 'large' ? 85 : 40;
  const strokeWidth = size === 'large' ? 12 : 8;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;
  const gradientId = `progress-gradient-${size}`;
  
  return (
    <div className={`relative ${size === 'large' ? 'w-48 h-48' : 'w-24 h-24'}`}>
      <svg className="w-full h-full transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle
          className="text-gray-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size === 'large' ? "96" : "48"}
          cy={size === 'large' ? "96" : "48"}
        />
        {/* Progress circle */}
        <circle
          className="transition-all duration-1000 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          stroke={`url(#${gradientId})`}
          fill="transparent"
          r={radius}
          cx={size === 'large' ? "96" : "48"}
          cy={size === 'large' ? "96" : "48"}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`${size === 'large' ? 'text-3xl' : 'text-xl'} font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500`}>
          {value}%
        </span>
      </div>
    </div>
  );
};

const StudentProgress = () => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const response = await api.get('/api/progress');
      setProgressData(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch progress data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">No progress data available</p>
      </div>
    );
  }

  const categoryIcons = {
    'Academic': AcademicCapIcon,
    'Mental Health': HeartIcon,
    'Social': UserGroupIcon,
    'Personal': SparklesIcon,
    'Other': FlagIcon
  };

  const categoryColors = {
    'Academic': '#4F46E5',
    'Mental Health': '#EC4899',
    'Social': '#10B981',
    'Personal': '#F59E0B',
    'Other': '#6B7280'
  };

  const categoryGradients = {
    'Academic': 'from-indigo-500 to-blue-500',
    'Mental Health': 'from-pink-500 to-rose-500',
    'Social': 'from-emerald-500 to-teal-500',
    'Personal': 'from-amber-500 to-orange-500',
    'Other': 'from-gray-500 to-slate-500'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-10"
    >
      {/* Header */}
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-6"
        >
          Your Progress Journey
        </motion.h1>
        <p className="text-gray-400 text-xl">Track your goals and achievements across different areas</p>
      </div>

      {/* Overall Progress */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-16">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-10 flex flex-col items-center justify-center shadow-lg"
        >
          <CircularProgress value={progressData.overallProgress || 0} />
          <h3 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mt-8">
            Overall Progress
          </h3>
        </motion.div>

        <div className="md:col-span-3 grid grid-cols-2 gap-6">
          <StatsCard
            title="Total Goals"
            value={progressData.totalGoals}
            icon={ChartBarIcon}
            gradient="from-blue-500 to-indigo-500"
          />
          <StatsCard
            title="Completed"
            value={progressData.completedGoals}
            icon={TrophyIcon}
            gradient="from-green-500 to-emerald-500"
          />
          <StatsCard
            title="In Progress"
            value={progressData.ongoingGoals}
            icon={ArrowTrendingUpIcon}
            gradient="from-amber-500 to-orange-500"
          />
          <StatsCard
            title="Not Started"
            value={progressData.notStartedGoals}
            icon={FlagIcon}
            gradient="from-red-500 to-rose-500"
          />
        </div>
      </div>

      {/* Category Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {Object.entries(progressData.categoryProgress).map(([category, progress], index) => {
          const Icon = categoryIcons[category];
          const gradient = categoryGradients[category];
          
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-20`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white ml-4">{category}</h3>
              </div>
              
              <div className="mt-6">
                <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${gradient}`}
                  />
                </div>
                <div className="flex justify-between mt-3">
                  <span className="text-base text-gray-400">Progress</span>
                  <span className={`text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
                    {progress}%
                  </span>
                </div>
                {progressData.categoryStats && (
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                    <span>Goals: {progressData.categoryStats[category]?.total || 0}</span>
                    <span>Avg Progress: {Math.round(
                      (progressData.categoryStats[category]?.totalProgress || 0) / 
                      (progressData.categoryStats[category]?.total || 1)
                    )}%</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Achievements and Upcoming Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Recent Achievements */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 lg:p-10 shadow-lg"
        >
          <h3 className="text-2xl lg:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-8 flex items-center">
            <TrophyIcon className="w-8 h-8 mr-4 text-emerald-500" />
            Recent Achievements
          </h3>
          <div className="space-y-6">
            {progressData.recentAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800 transition-colors duration-300"
              >
                <div className={`p-2 rounded-xl bg-gradient-to-br ${categoryGradients[achievement.category]}`}>
                  {categoryIcons[achievement.category] && React.createElement(categoryIcons[achievement.category], {
                    className: "w-5 h-5 text-white"
                  })}
                </div>
                <div className="flex-1">
                  <p className="text-gray-200 font-medium">{achievement.title}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Completed on {new Date(achievement.completedAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Goals */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 lg:p-10 shadow-lg"
        >
          <h3 className="text-2xl lg:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-8 flex items-center">
            <CalendarIcon className="w-8 h-8 mr-4 text-pink-500" />
            Upcoming Goals
          </h3>
          <div className="space-y-6">
            {progressData.upcomingGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800 transition-colors duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${categoryGradients[goal.category]}`}>
                    {categoryIcons[goal.category] && React.createElement(categoryIcons[goal.category], {
                      className: "w-5 h-5 text-white"
                    })}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-200 font-medium">{goal.title}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-400">
                        Due: {new Date(goal.targetDate).toLocaleDateString()}
                      </p>
                      <span className={`text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r ${categoryGradients[goal.category]}`}>
                        {goal.progress}%
                      </span>
                    </div>
                    <div className="relative h-1.5 bg-gray-700 rounded-full overflow-hidden mt-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 0.5 }}
                        className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${categoryGradients[goal.category]}`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const StatsCard = ({ title, value, icon: Icon, gradient }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: 1.02 }}
    className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full`}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-400 text-base mb-2">{title}</p>
        <p className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
          {value}
        </p>
      </div>
      <div className={`p-4 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-20`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
    </div>
  </motion.div>
);

export default StudentProgress;
