import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  UsersIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    systemHealth: 98
  });

  useEffect(() => {
    fetchUserStats();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user stats');
      }

      const data = await response.json();
      if (data.success) {
        const activeCount = data.users.filter(user => user.isActive).length;
        setStats({
          totalUsers: data.users.length,
          activeUsers: activeCount,
          systemHealth: 98
        });
      } else {
        throw new Error(data.message || 'Failed to fetch user stats');
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      toast.error('Failed to load user statistics');
    }
  };

  const handleNavigateToUsers = () => {
    navigate('/admin/users');
  };

  const handleNavigateToSettings = () => {
    navigate('/admin/settings');
  };

  const handleNavigateToAnalytics = () => {
    navigate('/admin/analytics');
  };

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
                Welcome back, {user?.name || 'Admin'}! 👋
              </h1>
              <p className="text-gray-400 text-lg">System Overview & Management</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-2xl font-bold text-white">{currentTime.toLocaleTimeString()}</p>
              <p className="text-gray-400">{currentTime.toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-2xl font-bold text-purple-400">{stats.totalUsers}</span>
              </div>
              <h3 className="text-white mt-2">Total Users</h3>
              <p className="text-gray-400 text-sm">Platform-wide</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <ArrowTrendingUpIcon className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-2xl font-bold text-blue-400">{stats.activeUsers}</span>
              </div>
              <h3 className="text-white mt-2">Active Users</h3>
              <p className="text-gray-400 text-sm">Currently active</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <ShieldCheckIcon className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-2xl font-bold text-green-400">{stats.systemHealth}%</span>
              </div>
              <h3 className="text-white mt-2">System Health</h3>
              <p className="text-gray-400 text-sm">All systems operational</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-2xl shadow-xl border border-gray-800 hover:border-purple-500/30 group"
          onClick={handleNavigateToUsers}
          style={{ cursor: 'pointer' }}
        >
          <div className="p-6">
            <div className="w-14 h-14 bg-purple-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-900/30 transition-colors">
              <UserGroupIcon className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors">User Management</h2>
            <p className="text-gray-400 mb-4">Manage users, roles, and permissions</p>
            <button className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-900/20 text-purple-400 hover:bg-purple-900/30 font-medium transition-all group-hover:scale-105">
              Manage Users
              <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-2xl shadow-xl border border-gray-800 hover:border-blue-500/30 group"
          onClick={handleNavigateToSettings}
          style={{ cursor: 'pointer' }}
        >
          <div className="p-6">
            <div className="w-14 h-14 bg-blue-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-900/30 transition-colors">
              <Cog6ToothIcon className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">System Settings</h2>
            <p className="text-gray-400 mb-4">Configure system preferences and settings</p>
            <button className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-900/20 text-blue-400 hover:bg-blue-900/30 font-medium transition-all group-hover:scale-105">
              Configure Settings
              <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800"
        onClick={handleNavigateToAnalytics}
        style={{ cursor: 'pointer' }}
      >
        <h2 className="text-xl font-bold text-white mb-4">Analytics Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
            <h3 className="text-sm font-medium text-gray-400 mb-3">User Activity</h3>
            <div className="h-48 flex items-center justify-center text-gray-500">
              Chart placeholder
            </div>
          </div>
          
          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
            <h3 className="text-sm font-medium text-gray-400 mb-3">System Metrics</h3>
            <div className="h-48 flex items-center justify-center text-gray-500">
              Metrics placeholder
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard; 