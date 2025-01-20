import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ChartBarIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 0,
      activeUsers: 0,
      totalSessions: 0,
      averageSessionTime: 0
    },
    userActivity: {
      labels: [],
      data: []
    },
    userTypes: {
      labels: [],
      data: []
    },
    sessionMetrics: {
      labels: [],
      data: []
    }
  });

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

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/admin/analytics?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      } else {
        throw new Error(data.message || 'Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#9ca3af',
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 17, 17, 0.9)',
        titleColor: '#fff',
        titleFont: {
          size: 14,
          weight: 'bold',
          family: "'Inter', sans-serif"
        },
        bodyColor: '#9ca3af',
        bodyFont: {
          size: 12,
          family: "'Inter', sans-serif"
        },
        padding: 12,
        borderColor: 'rgba(75, 85, 99, 0.2)',
        borderWidth: 1,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += context.parsed.y;
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.1)',
          borderDash: [5, 5]
        },
        ticks: {
          color: '#9ca3af',
          font: {
            family: "'Inter', sans-serif",
            size: 11
          },
          padding: 10
        },
        border: {
          dash: [5, 5]
        }
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.1)',
          borderDash: [5, 5]
        },
        ticks: {
          color: '#9ca3af',
          font: {
            family: "'Inter', sans-serif",
            size: 11
          },
          padding: 10
        },
        border: {
          dash: [5, 5]
        }
      }
    }
  };

  const userActivityData = {
    labels: analytics.userActivity.labels,
    datasets: [
      {
        label: 'Active Users',
        data: analytics.userActivity.data,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#8b5cf6',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2
      }
    ]
  };

  const userTypesData = {
    labels: analytics.userTypes.labels,
    datasets: [
      {
        data: analytics.userTypes.data,
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)',  // Purple
          'rgba(59, 130, 246, 0.8)',  // Blue
          'rgba(16, 185, 129, 0.8)',  // Green
          'rgba(245, 158, 11, 0.8)'   // Yellow
        ],
        borderColor: [
          'rgba(139, 92, 246, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)'
        ],
        borderWidth: 2,
        hoverOffset: 4,
        spacing: 5,
        borderRadius: 4
      }
    ]
  };

  const sessionMetricsData = {
    labels: analytics.sessionMetrics.labels,
    datasets: [
      {
        label: 'Session Duration',
        data: analytics.sessionMetrics.data,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
        barThickness: 20,
        maxBarThickness: 25
      }
    ]
  };

  const lineChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        ...chartOptions.plugins.tooltip,
        mode: 'index',
        intersect: false
      }
    },
    hover: {
      mode: 'index',
      intersect: false
    }
  };

  const doughnutChartOptions = {
    ...chartOptions,
    cutout: '70%',
    radius: '90%',
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        ...chartOptions.plugins.tooltip,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  const barChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        ...chartOptions.plugins.tooltip,
        mode: 'index',
        intersect: false
      }
    },
    hover: {
      mode: 'index',
      intersect: false
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#050505]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#050505] py-8 px-4"
    >
      <motion.div variants={itemVariants} className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#111111] via-[#1a1a1a] to-[#111111] rounded-2xl shadow-2xl p-8 border border-gray-800">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
              <p className="text-gray-400">Monitor system performance and user engagement</p>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <motion.div variants={itemVariants} className="flex justify-end space-x-2">
          {['day', 'week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg ${
                timeRange === range
                  ? 'bg-purple-500 text-white'
                  : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#222]'
              } transition-colors`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Overview Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-purple-400">{analytics.overview.totalUsers}</span>
            </div>
            <h3 className="text-white mt-2">Total Users</h3>
            <p className="text-gray-400 text-sm">Platform-wide</p>
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <ArrowTrendingUpIcon className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-blue-400">{analytics.overview.activeUsers}</span>
            </div>
            <h3 className="text-white mt-2">Active Users</h3>
            <p className="text-gray-400 text-sm">Currently active</p>
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-green-400">{analytics.overview.totalSessions}</span>
            </div>
            <h3 className="text-white mt-2">Total Sessions</h3>
            <p className="text-gray-400 text-sm">All time</p>
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-2xl font-bold text-yellow-400">
                {Math.round(analytics.overview.averageSessionTime)}m
              </span>
            </div>
            <h3 className="text-white mt-2">Avg. Session Time</h3>
            <p className="text-gray-400 text-sm">In minutes</p>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Activity Chart */}
          <motion.div variants={itemVariants} className="bg-[#111] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">User Activity</h3>
            <div className="h-80">
              <Line data={userActivityData} options={lineChartOptions} />
            </div>
          </motion.div>

          {/* User Types Distribution */}
          <motion.div variants={itemVariants} className="bg-[#111] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">User Distribution</h3>
            <div className="h-80">
              <Doughnut data={userTypesData} options={doughnutChartOptions} />
            </div>
          </motion.div>

          {/* Session Metrics */}
          <motion.div variants={itemVariants} className="bg-[#111] border border-gray-800 rounded-2xl p-6 md:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4">Session Metrics</h3>
            <div className="h-80">
              <Bar data={sessionMetricsData} options={barChartOptions} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;