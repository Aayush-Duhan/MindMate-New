import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  DocumentChartBarIcon,
  BellAlertIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const CounselorDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeStudents, setActiveStudents] = useState(12);
  const [pendingSessions, setPendingSessions] = useState(5);
  const [totalCases, setTotalCases] = useState(156);
  
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Support Request", message: "Student John D. has requested counseling support", type: "urgent" },
    { id: 2, title: "Session Reminder", message: "Upcoming session with Sarah M. at 2 PM", type: "reminder" },
    { id: 3, title: "Mood Alert", message: "Multiple students reported low mood today", type: "alert" }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const getTimeGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 p-6 max-w-7xl mx-auto"
    >
      {/* Enhanced Header with Time and Quick Actions */}
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
                Welcome back, {user?.name || user?.email || 'Counselor'}! 👋
              </h1>
              <p className="text-gray-400 text-lg">Supporting student well-being</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-2xl font-bold text-white">{currentTime.toLocaleTimeString()}</p>
              <p className="text-gray-400">{currentTime.toLocaleDateString()}</p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            <button 
              onClick={() => navigate('/counselor/chats')}
              className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg flex items-center space-x-2 transition-all hover:scale-105"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              <span>Active Chats</span>
            </button>
            <button 
              onClick={() => navigate('/counselor/sessions')}
              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg flex items-center space-x-2 transition-all hover:scale-105"
            >
              <CalendarDaysIcon className="w-5 h-5" />
              <span>Schedule Session</span>
            </button>
            <button 
              className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg flex items-center space-x-2 transition-all hover:scale-105"
            >
              <ChartBarIcon className="w-5 h-5" />
              <span>View Reports</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-2xl font-bold text-purple-400">{activeStudents}</span>
          </div>
          <h3 className="text-white mt-2">Active Cases</h3>
          <p className="text-gray-400 text-sm">Current students</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-blue-400">{pendingSessions}</span>
          </div>
          <h3 className="text-white mt-2">Pending Sessions</h3>
          <p className="text-gray-400 text-sm">To be scheduled</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <DocumentChartBarIcon className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-2xl font-bold text-green-400">{totalCases}</span>
          </div>
          <h3 className="text-white mt-2">Total Cases</h3>
          <p className="text-gray-400 text-sm">All time</p>
        </motion.div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Active Cases and Notifications */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          {/* Active Cases List */}
          <div className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <span>Active Cases</span>
              <span className="ml-2 px-2 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">
                {activeStudents}
              </span>
            </h2>
            {/* Add active cases list here */}
          </div>

          {/* Notifications */}
          <div className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <span>Notifications</span>
              <span className="ml-2 px-2 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">
                {notifications.length}
              </span>
            </h2>
            <div className="space-y-4">
              {notifications.map(notification => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-xl bg-gray-800/50 border border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium">{notification.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      notification.type === 'urgent' ? 'bg-red-500/20 text-red-300' :
                      notification.type === 'alert' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {notification.type}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">{notification.message}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Main Content */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Anonymous Chats Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-2xl shadow-xl border border-gray-800 hover:border-purple-500/30 group"
            >
              <div className="p-6">
                <div className="w-14 h-14 bg-purple-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-900/30 transition-colors">
                  <ChatBubbleLeftRightIcon className="w-8 h-8 text-purple-400" />
                </div>
                <h2 className="text-xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors">Anonymous Chats</h2>
                <p className="text-gray-400 mb-4">Handle anonymous support requests from students</p>
                <button 
                  onClick={() => navigate('/counselor/chats')}
                  className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-900/20 text-purple-400 hover:bg-purple-900/30 font-medium transition-all group-hover:scale-105"
                >
                  View Chats
                  <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>

            {/* Sessions Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-2xl shadow-xl border border-gray-800 hover:border-blue-500/30 group"
            >
              <div className="p-6">
                <div className="w-14 h-14 bg-blue-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-900/30 transition-colors">
                  <CalendarDaysIcon className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">Counseling Sessions</h2>
                <p className="text-gray-400 mb-4">Schedule and manage counseling sessions</p>
                <button 
                  onClick={() => navigate('/counselor/sessions')}
                  className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-900/20 text-blue-400 hover:bg-blue-900/30 font-medium transition-all group-hover:scale-105"
                >
                  Manage Sessions
                  <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Analytics Overview */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800"
          >
            <h2 className="text-xl font-bold text-white mb-4">Analytics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Well-being Trends */}
              <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Well-being Trends</h3>
                <div className="h-48 flex items-center justify-center text-gray-500">
                  Chart placeholder
                </div>
              </div>
              
              {/* Support Metrics */}
              <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Support Metrics</h3>
                <div className="h-48 flex items-center justify-center text-gray-500">
                  Metrics placeholder
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CounselorDashboard; 