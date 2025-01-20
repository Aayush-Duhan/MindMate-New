import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  BellAlertIcon,
  ArrowRightIcon,
  AcademicCapIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const TeacherDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [totalStudents, setTotalStudents] = useState(125);
  const [activeAlerts, setActiveAlerts] = useState(3);
  const [supportRequests, setSupportRequests] = useState(8);

  const [notifications, setNotifications] = useState([
    { id: 1, title: "Student Alert", message: "John Doe reported feeling anxious", type: "alert" },
    { id: 2, title: "Support Request", message: "New counseling request from Sarah", type: "request" },
    { id: 3, title: "Wellness Check", message: "Weekly student wellness report ready", type: "info" }
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
                Welcome back, {user?.name || 'Teacher'}! 👋
              </h1>
              <p className="text-gray-400 text-lg">Monitor and support your students</p>
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
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-2xl font-bold text-purple-400">{totalStudents}</span>
              </div>
              <h3 className="text-white mt-2">Total Students</h3>
              <p className="text-gray-400 text-sm">Under your supervision</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <BellAlertIcon className="w-6 h-6 text-red-400" />
                </div>
                <span className="text-2xl font-bold text-red-400">{activeAlerts}</span>
              </div>
              <h3 className="text-white mt-2">Active Alerts</h3>
              <p className="text-gray-400 text-sm">Require attention</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-2xl font-bold text-blue-400">{supportRequests}</span>
              </div>
              <h3 className="text-white mt-2">Support Requests</h3>
              <p className="text-gray-400 text-sm">Pending responses</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Actions Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Monitoring Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-2xl shadow-xl border border-gray-800 hover:border-purple-500/30 group"
        >
          <div className="p-6">
            <div className="w-14 h-14 bg-purple-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-900/30 transition-colors">
              <AcademicCapIcon className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors">Student Monitoring</h2>
            <p className="text-gray-400 mb-4">Track student well-being and progress</p>
            <button className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-900/20 text-purple-400 hover:bg-purple-900/30 font-medium transition-all group-hover:scale-105">
              View Students
              <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>

        {/* Support Center Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-2xl shadow-xl border border-gray-800 hover:border-blue-500/30 group"
        >
          <div className="p-6">
            <div className="w-14 h-14 bg-blue-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-900/30 transition-colors">
              <HeartIcon className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">Support Center</h2>
            <p className="text-gray-400 mb-4">Manage support requests and interventions</p>
            <button className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-900/20 text-blue-400 hover:bg-blue-900/30 font-medium transition-all group-hover:scale-105">
              View Requests
              <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Notifications */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800"
      >
        <h2 className="text-xl font-bold text-white mb-4">Recent Notifications</h2>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-white">{notification.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{notification.message}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  notification.type === 'alert' ? 'bg-red-500/20 text-red-400' :
                  notification.type === 'request' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {notification.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TeacherDashboard; 