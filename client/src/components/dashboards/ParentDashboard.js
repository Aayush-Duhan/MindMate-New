import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  UserIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  BookOpenIcon,
  HeartIcon,
  ArrowRightIcon,
  ClockIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';

const ParentDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [childMoodScore, setChildMoodScore] = useState(85);
  const [lastCheckIn, setLastCheckIn] = useState('2 hours ago');
  const [pendingActions, setPendingActions] = useState(2);

  const [activities, setActivities] = useState([
    { id: 1, title: "Counseling Session", time: "Tomorrow, 2:00 PM", status: "upcoming" },
    { id: 2, title: "Mood Check-in", time: "Today, 10:30 AM", status: "completed" },
    { id: 3, title: "Support Group", time: "Friday, 3:00 PM", status: "scheduled" }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Enhanced Header with Time */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-r from-[#111111] via-[#1a1a1a] to-[#111111] rounded-2xl shadow-2xl p-8 border border-gray-800 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <p className="text-gray-400 mb-2">{getTimeGreeting()}</p>
              <h1 className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Welcome back, {user?.name || 'Parent'}! 👋
              </h1>
              <p className="text-gray-400 text-lg">Monitor your child's well-being</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-2xl font-bold text-white">{currentTime.toLocaleTimeString()}</p>
              <p className="text-gray-400">{currentTime.toLocaleDateString()}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <HeartIcon className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-2xl font-bold text-green-400">{childMoodScore}%</span>
              </div>
              <h3 className="text-white mt-2">Well-being Score</h3>
              <p className="text-gray-400 text-sm">Current mood status</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-2xl font-bold text-blue-400">{lastCheckIn}</span>
              </div>
              <h3 className="text-white mt-2">Last Check-in</h3>
              <p className="text-gray-400 text-sm">Most recent activity</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <BellAlertIcon className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-2xl font-bold text-purple-400">{pendingActions}</span>
              </div>
              <h3 className="text-white mt-2">Pending Actions</h3>
              <p className="text-gray-400 text-sm">Require attention</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Actions Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Child Progress Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-2xl shadow-xl border border-gray-800 hover:border-purple-500/30 group"
        >
          <div className="p-6">
            <div className="w-14 h-14 bg-purple-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-900/30 transition-colors">
              <ChartBarIcon className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors">Progress Tracking</h2>
            <p className="text-gray-400 mb-4">Monitor your child's emotional well-being</p>
            <button 
              onClick={() => navigate('/parent/progress')}
              className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-900/20 text-purple-400 hover:bg-purple-900/30 font-medium transition-all group-hover:scale-105"
            >
              View Progress
              <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>

        {/* Support Resources Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-2xl shadow-xl border border-gray-800 hover:border-blue-500/30 group"
        >
          <div className="p-6">
            <div className="w-14 h-14 bg-blue-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-900/30 transition-colors">
              <BookOpenIcon className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">Support Resources</h2>
            <p className="text-gray-400 mb-4">Access parental guidance materials</p>
            <button 
              onClick={() => navigate('/parent/resources')}
              className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-900/20 text-blue-400 hover:bg-blue-900/30 font-medium transition-all group-hover:scale-105"
            >
              View Resources
              <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Upcoming Activities */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800"
      >
        <h2 className="text-xl font-bold text-white mb-4">Upcoming Activities</h2>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-white">{activity.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{activity.time}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  activity.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                  activity.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {activity.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ParentDashboard; 