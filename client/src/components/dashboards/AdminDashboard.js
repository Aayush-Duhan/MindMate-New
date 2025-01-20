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
  ArrowRightIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    systemHealth: 98
  });
  const [analyticsData, setAnalyticsData] = useState({
    userActivity: {
      labels: [],
      data: []
    },
    userTypes: {
      labels: [],
      data: []
    }
  });

  useEffect(() => {
    fetchUserStats();
    fetchAnalytics();
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

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/analytics/system?timeRange=week', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      if (data.success) {
        setAnalyticsData(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
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
        className="bg-gradient-to-r from-[#111111] via-[#1a1a1a] to-[#111111] rounded-2xl shadow-2xl p-4 md:p-8 border border-gray-800 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <p className="text-gray-400 mb-2">{getTimeGreeting()}</p>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Welcome back, {user?.name || 'Admin'}! 👋
              </h1>
              <p className="text-base md:text-lg text-gray-400">System Overview & Management</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-xl md:text-2xl font-bold text-white">{currentTime.toLocaleTimeString()}</p>
              <p className="text-sm md:text-base text-gray-400">{currentTime.toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-6">
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-xl p-4 md:p-6 border border-gray-800">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-2xl font-bold text-purple-400">{stats.totalUsers}</span>
              </div>
              <h3 className="text-white mt-2">Total Users</h3>
              <p className="text-gray-400 text-sm">Platform-wide</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-xl p-4 md:p-6 border border-gray-800">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <ArrowTrendingUpIcon className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-2xl font-bold text-blue-400">{stats.activeUsers}</span>
              </div>
              <h3 className="text-white mt-2">Active Users</h3>
              <p className="text-gray-400 text-sm">Currently active</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-xl p-4 md:p-6 border border-gray-800">
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

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-2xl shadow-xl border border-gray-800 hover:border-purple-500/30 group"
          onClick={handleNavigateToUsers}
          style={{ cursor: 'pointer' }}
        >
          <div className="p-4 md:p-6">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-900/30 transition-colors">
              <UserGroupIcon className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
            </div>
            <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-white group-hover:text-purple-400 transition-colors">User Management</h2>
            <p className="text-sm md:text-base text-gray-400 mb-4">Manage users, roles, and permissions</p>
            <button className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-900/20 text-purple-400 hover:bg-purple-900/30 font-medium transition-all group-hover:scale-105">
              <span className="text-sm md:text-base">Manage Users</span>
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
          <div className="p-4 md:p-6">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-900/30 transition-colors">
              <Cog6ToothIcon className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
            </div>
            <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-white group-hover:text-blue-400 transition-colors">System Settings</h2>
            <p className="text-sm md:text-base text-gray-400 mb-4">Configure system preferences and settings</p>
            <button className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-900/20 text-blue-400 hover:bg-blue-900/30 font-medium transition-all group-hover:scale-105">
              <span className="text-sm md:text-base">Configure Settings</span>
              <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-2xl shadow-xl p-4 md:p-8 mb-4 md:mb-8 border border-gray-800"
      >
        <h2 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">
          Analytics Overview
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          <motion.div
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            className="bg-[#1a1a1a] rounded-xl p-4 md:p-6 border border-gray-800 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer"
          >
            <h3 className="text-sm md:text-base font-medium text-gray-400 mb-4 flex items-center group">
              <ChartBarIcon className="w-4 h-4 md:w-5 md:h-5 mr-2 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
              User Activity
            </h3>
            <div className="h-48 md:h-64 w-full">
              <Line
                data={{
                  labels: analyticsData.userActivity.labels,
                  datasets: [
                    {
                      label: 'Active Users',
                      data: analyticsData.userActivity.data,
                      fill: true,
                      borderColor: 'rgb(168, 85, 247)',
                      backgroundColor: 'rgba(168, 85, 247, 0.1)',
                      tension: 0.4,
                      pointBackgroundColor: 'rgb(168, 85, 247)',
                      pointBorderColor: '#fff',
                      pointHoverBackgroundColor: '#fff',
                      pointHoverBorderColor: 'rgb(168, 85, 247)',
                      pointRadius: 4,
                      pointHoverRadius: 6,
                      pointBorderWidth: 2,
                      pointHoverBorderWidth: 3,
                      borderWidth: 3
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  interaction: {
                    mode: 'index',
                    intersect: false,
                    axis: 'x'
                  },
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleColor: '#fff',
                      bodyColor: '#fff',
                      padding: 12,
                      borderColor: 'rgb(168, 85, 247)',
                      borderWidth: 1,
                      displayColors: false,
                      callbacks: {
                        label: function(context) {
                          return `Users: ${context.parsed.y}`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(75, 85, 99, 0.2)'
                      },
                      ticks: {
                        color: 'rgb(156, 163, 175)'
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      },
                      ticks: {
                        color: 'rgb(156, 163, 175)'
                      }
                    }
                  },
                  hover: {
                    mode: 'index',
                    intersect: false
                  }
                }}
              />
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-[#1a1a1a] rounded-xl p-4 md:p-6 border border-gray-800"
          >
            <h3 className="text-sm md:text-base font-medium text-gray-400 mb-4 flex items-center">
              <UsersIcon className="w-4 h-4 md:w-5 md:h-5 mr-2 text-purple-500" />
              User Distribution
            </h3>
            <div className="h-48 md:h-64 w-full">
              <Doughnut
                data={{
                  labels: analyticsData.userTypes.labels,
                  datasets: [
                    {
                      data: analyticsData.userTypes.data,
                      backgroundColor: [
                        'rgba(168, 85, 247, 0.8)',  // Purple
                        'rgba(236, 72, 153, 0.8)',  // Pink
                        'rgba(59, 130, 246, 0.8)',  // Blue
                        'rgba(16, 185, 129, 0.8)'   // Green
                      ],
                      borderColor: [
                        'rgb(168, 85, 247)',
                        'rgb(236, 72, 153)',
                        'rgb(59, 130, 246)',
                        'rgb(16, 185, 129)'
                      ],
                      borderWidth: 2
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        boxWidth: 12,
                        padding: 15,
                        color: 'rgb(156, 163, 175)',
                        font: {
                          size: 12
                        }
                      }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleColor: '#fff',
                      bodyColor: '#fff',
                      padding: 12,
                      borderColor: 'rgb(168, 85, 247)',
                      borderWidth: 1
                    }
                  }
                }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard; 