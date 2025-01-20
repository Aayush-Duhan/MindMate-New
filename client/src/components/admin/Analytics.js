import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ChartBarIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  FireIcon,
  ArrowTrendingUpIcon
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
    userEngagement: {
      lowStreak: 0,
      mediumStreak: 0,
      highStreak: 0,
      superStreak: 0
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
      const response = await fetch(`http://localhost:5000/api/analytics/system?timeRange=${timeRange}`, {
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

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 17, 17, 0.95)',
        titleColor: '#fff',
        titleFont: {
          size: 14,
          weight: 'bold',
          family: "'Inter', sans-serif"
        },
        bodyColor: '#9ca3af',
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif"
        },
        padding: {
          top: 12,
          right: 16,
          bottom: 12,
          left: 16
        },
        borderColor: 'rgba(75, 85, 99, 0.3)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          title: (context) => {
            return `Date: ${context[0].label}`;
          },
          label: (context) => {
            return `Mind Sessions: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          padding: 10,
          stepSize: 1
        }
      }
    },
    hover: {
      mode: 'index',
      intersect: false
    }
  };

  const userActivityData = {
    labels: analytics.userActivity.labels,
    datasets: [
      {
        label: 'Mind Sessions',
        data: analytics.userActivity.data,
        borderColor: 'rgba(147, 51, 234, 1)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: 'rgba(147, 51, 234, 1)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        pointHitRadius: 20,
        hoverBackgroundColor: 'rgba(147, 51, 234, 0.2)',
        hoverBorderColor: 'rgba(147, 51, 234, 1)',
        hoverBorderWidth: 3
      }
    ]
  };

  const userTypeChartOptions = {
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
        backgroundColor: 'rgba(17, 17, 17, 0.95)',
        titleColor: '#fff',
        titleFont: {
          size: 14,
          weight: 'bold',
          family: "'Inter', sans-serif"
        },
        bodyColor: '#9ca3af',
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif"
        },
        padding: {
          top: 12,
          right: 16,
          bottom: 12,
          left: 16
        },
        borderColor: 'rgba(75, 85, 99, 0.3)',
        borderWidth: 1,
        displayColors: true,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          title: () => '',
          label: function(context) {
            return `${context.label}: ${context.raw}`;
          },
          labelPointStyle: function(context) {
            return {
              pointStyle: 'circle',
              rotation: 0
            };
          }
        }
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    },
    cutout: '65%',
    radius: '90%',
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000
    },
    hover: {
      mode: 'nearest',
      intersect: true,
      animationDuration: 200
    },
    elements: {
      arc: {
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverBorderColor: 'rgb(255, 255, 255)',
        borderRadius: 6,
        hoverOffset: 8
      }
    }
  };

  const userTypeChartData = {
    labels: analytics.userTypes.labels,
    datasets: [
      {
        data: analytics.userTypes.data,
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',   // Purple
          'rgba(59, 130, 246, 0.8)',   // Blue
          'rgba(16, 185, 129, 0.8)',   // Green
          'rgba(245, 158, 11, 0.8)'    // Orange
        ],
        borderColor: [
          'rgba(147, 51, 234, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)'
        ],
        hoverBackgroundColor: [
          'rgba(147, 51, 234, 0.9)',
          'rgba(59, 130, 246, 0.9)',
          'rgba(16, 185, 129, 0.9)',
          'rgba(245, 158, 11, 0.9)'
        ],
        borderWidth: 2
      }
    ]
  };

  const userEngagementChartOptions = {
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
        backgroundColor: 'rgba(17, 17, 17, 0.95)',
        titleColor: '#fff',
        titleFont: {
          size: 14,
          weight: 'bold',
          family: "'Inter', sans-serif"
        },
        bodyColor: '#9ca3af',
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif"
        },
        padding: {
          top: 12,
          right: 16,
          bottom: 12,
          left: 16
        },
        borderColor: 'rgba(75, 85, 99, 0.3)',
        borderWidth: 1,
        displayColors: true,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          title: () => '',
          label: function(context) {
            return `${context.label}: ${context.raw} days`;
          }
        }
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    }
  };

  const userEngagementData = {
    labels: ['1-7 days', '8-14 days', '15-30 days', '30+ days'],
    datasets: [
      {
        data: [
          analytics.userEngagement?.lowStreak || 0,
          analytics.userEngagement?.mediumStreak || 0,
          analytics.userEngagement?.highStreak || 0,
          analytics.userEngagement?.superStreak || 0
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',   // Red
          'rgba(245, 158, 11, 0.8)',   // Orange
          'rgba(16, 185, 129, 0.8)',   // Green
          'rgba(147, 51, 234, 0.8)'    // Purple
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)',
          'rgb(16, 185, 129)',
          'rgb(147, 51, 234)'
        ],
        borderWidth: 2
      }
    ]
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
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <h3 className="text-white mt-2">Total Mind Sessions</h3>
            <p className="text-gray-400 text-sm">All time</p>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mind Sessions Activity Chart */}
          <motion.div variants={itemVariants} className="bg-[#111] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <ChatBubbleLeftRightIcon className="w-6 h-6 mr-2 text-purple-400" />
              Mind Sessions Activity
            </h3>
            <div className="h-80">
              <Line data={userActivityData} options={lineChartOptions} />
            </div>
          </motion.div>

          {/* User Types Distribution */}
          <motion.div variants={itemVariants} className="bg-[#111] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">User Distribution</h3>
            <div className="h-80">
              <Doughnut data={userTypeChartData} options={userTypeChartOptions} />
            </div>
          </motion.div>

          {/* User Engagement (Streak Days) */}
          <motion.div variants={itemVariants} className="bg-[#111] border border-gray-800 rounded-2xl p-6 md:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <FireIcon className="w-6 h-6 mr-2 text-red-500" />
              User Engagement (Streak Days)
            </h3>
            <div className="h-80 flex items-center justify-center">
              {analytics.userEngagement && 
               Object.values(analytics.userEngagement).some(value => value > 0) ? (
                <Doughnut data={userEngagementData} options={userEngagementChartOptions} />
              ) : (
                <div className="text-center text-gray-400">
                  <p className="text-lg mb-2">No engagement data available</p>
                  <p className="text-sm">Users haven't started their streaks yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;