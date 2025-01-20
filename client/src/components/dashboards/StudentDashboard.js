import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import './StudentDashboard.css';
import { 
  BookOpenIcon, 
  ChatBubbleLeftRightIcon,
  HeartIcon,
  FlagIcon,
  SparklesIcon,
  TrophyIcon,
  AcademicCapIcon,
  FaceSmileIcon,
  FaceFrownIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ChevronRightIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import GoalList from '../goals/GoalList';
import { useGoals } from '../../context/GoalContext';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { goals, loading: goalsLoading, fetchGoals } = useGoals();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showQuickMood, setShowQuickMood] = useState(false);
  const [dailyQuote, setDailyQuote] = useState({
    text: "Loading your daily inspiration...",
    author: ""
  });
  const [streak, setStreak] = useState(0);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Resource Available", message: "Check out our new meditation guide!", type: "info" },
    { id: 2, title: "Upcoming Session", message: "Counseling session tomorrow at 3 PM", type: "reminder" }
  ]);
  const [moodResponse, setMoodResponse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);
  const [moodInsights, setMoodInsights] = useState({
    mostFrequentMood: '',
    averageIntensity: 0,
    totalEntries: 0,
    recentTrend: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const moodOptions = [
    { icon: FaceSmileIcon, text: 'Great' },
    { icon: FaceSmileIcon, text: 'Good' },
    { icon: FaceSmileIcon, text: 'Okay' },
    { icon: FaceFrownIcon, text: 'Down' },
    { icon: FaceFrownIcon, text: 'Sad' }
  ];

  const quickActions = [
    {
      title: 'Chat with Counselor',
      icon: ChatBubbleLeftRightIcon,
      description: 'Connect with a counselor anonymously',
      link: '/student/chat',
      color: 'blue'
    },
    {
      title: 'Track Mood',
      icon: HeartIcon,
      description: 'Record your daily mood',
      link: '/mood',
      color: 'red'
    },
    {
      title: 'View Resources',
      icon: BookOpenIcon,
      description: 'Access helpful materials',
      link: '/student/resources',
      color: 'purple'
    },
    {
      title: 'View Progress',
      icon: ChartBarIcon,
      description: 'Track your goals and achievements',
      link: '/student/progress',
      color: 'green'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch daily quote
  useEffect(() => {
    const fetchDailyQuote = async () => {
      try {
        const { data } = await api.get('/api/quotes/daily');
        if (data.success) {
          setDailyQuote(data.data);
        }
      } catch (error) {
        console.error('Error fetching daily quote:', error);
        // Set a fallback quote in case of error
        setDailyQuote({
          text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
          author: "Nelson Mandela"
        });
      }
    };

    fetchDailyQuote();
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // Add fetchMoodHistory function
  const fetchMoodHistory = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/mood', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch mood history');
      }

      const data = await response.json();
      setMoodHistory(data.data);
    } catch (error) {
      console.error('Error fetching mood history:', error);
      toast.error('Failed to load mood history');
    } finally {
      setIsLoading(false);
    }
  };

  // Add useEffect to fetch mood history on component mount
  useEffect(() => {
    fetchMoodHistory();
  }, []);

  // Calculate mood insights
  useEffect(() => {
    if (moodHistory.length > 0) {
      // Count mood frequencies
      const moodFrequencies = moodHistory.reduce((acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
      }, {});

      // Calculate average intensity
      const avgIntensity = moodHistory.reduce((sum, entry) => sum + entry.intensity, 0) / moodHistory.length;

      // Find most frequent mood
      const mostFrequent = Object.entries(moodFrequencies)
        .sort(([,a], [,b]) => b - a)[0][0];

      // Determine recent trend (last 3 entries)
      const recent = moodHistory.slice(0, 3);
      let trend = 'stable';
      if (recent.length >= 2) {
        const intensityChanges = recent.slice(0, -1).map((entry, i) => {
          return recent[i].intensity - recent[i + 1].intensity;
        });
        const avgChange = intensityChanges.reduce((sum, change) => sum + change, 0) / intensityChanges.length;
        trend = avgChange > 0.5 ? 'improving' : avgChange < -0.5 ? 'declining' : 'stable';
      }

      setMoodInsights({
        mostFrequentMood: mostFrequent,
        averageIntensity: Math.round(avgIntensity * 10) / 10,
        totalEntries: moodHistory.length,
        recentTrend: trend
      });
    }
  }, [moodHistory]);

  // Fetch streak data
  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await api.get('/api/mood/streak');
        if (response.data.success) {
          setStreak(response.data.streak);
        }
      } catch (error) {
        console.error('Error fetching streak:', error);
        toast.error('Failed to fetch streak data');
      }
    };

    fetchStreak();
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

  const handleMoodSubmit = async (selectedMood) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const moodMapping = {
        'Great': { mood: 'happy', intensity: 5 },
        'Good': { mood: 'calm', intensity: 4 },
        'Okay': { mood: 'neutral', intensity: 3 },
        'Down': { mood: 'sad', intensity: 2 },
        'Sad': { mood: 'stressed', intensity: 1 }
      };

      const selectedMoodData = moodMapping[selectedMood.text] || { mood: 'neutral', intensity: 3 };
      
      const moodData = {
        mood: selectedMoodData.mood,
        intensity: selectedMoodData.intensity,
        timestamp: new Date().toISOString()
      };

      const response = await fetch('http://localhost:5000/api/mood/quick', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(moodData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit mood');
      }

      const data = await response.json();
      toast.success('Mood recorded successfully!');
      setShowQuickMood(false);
      
      // Refresh mood history after successful submission
      fetchMoodHistory();

      // Fetch updated streak after successful mood entry
      const streakResponse = await api.get('/api/mood/streak');
      if (streakResponse.data.success) {
        setStreak(streakResponse.data.streak);
      }
    } catch (error) {
      console.error('Error submitting mood:', error);
      toast.error(error.message || 'Failed to record mood');
    } finally {
      setIsSubmitting(false);
    }
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
                Welcome back! 👋
              </h1>
              <p className="text-gray-400 text-lg">Your mental wellness journey continues...</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-2xl font-bold text-white">{currentTime.toLocaleTimeString()}</p>
              <p className="text-gray-400">{currentTime.toLocaleDateString()}</p>
            </div>
          </div>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            {quickActions.map((action, index) => {
              const colorClasses = {
                blue: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300',
                red: 'bg-red-500/20 hover:bg-red-500/30 text-red-300',
                purple: 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300',
                green: 'bg-green-500/20 hover:bg-green-500/30 text-green-300'
              };
              
              return (
                <button 
                  key={index}
                  onClick={() => navigate(action.link)}
                  className={`px-4 py-2 ${colorClasses[action.color]} rounded-lg flex items-center space-x-2 transition-all hover:scale-105`}
                >
                  <action.icon className="w-5 h-5" />
                  <span>{action.title}</span>
                </button>
              );
            })}

            {/* Quick Mood Check */}
            <button 
              onClick={() => setShowQuickMood(true)}
              className="px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 rounded-lg flex items-center space-x-2 transition-all hover:scale-105"
            >
              <DocumentTextIcon className="w-5 h-5" />
              <span>Quick Mood Check</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Daily Quote Card */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-[#111111] to-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <p className="text-white text-lg italic">"{dailyQuote.text}"</p>
            <p className="text-gray-400 mt-2">— {dailyQuote.author}</p>
          </div>
        </div>
      </motion.div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Notifications */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          {/* Mood Insights Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Mood Insights</h2>
              <ChartBarIcon className="w-6 h-6 text-purple-400" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <HeartIcon className="w-5 h-5 text-pink-400" />
                  <span className="text-gray-300">Most Frequent Mood</span>
                </div>
                <span className="text-white font-medium capitalize">{moodInsights.mostFrequentMood || 'N/A'}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <SparklesIcon className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-300">Average Intensity</span>
                </div>
                <span className="text-white font-medium">{moodInsights.averageIntensity || 'N/A'}/5</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ChartBarIcon className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">Recent Trend</span>
                </div>
                <span className="text-white font-medium capitalize">
                  {moodInsights.recentTrend === 'improving' && '↗️ Improving'}
                  {moodInsights.recentTrend === 'declining' && '↘️ Declining'}
                  {moodInsights.recentTrend === 'stable' && '→ Stable'}
                  {!moodInsights.recentTrend && 'N/A'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Total Entries</span>
                </div>
                <span className="text-white font-medium">{moodInsights.totalEntries}</span>
              </div>
            </div>
          </motion.div>

          {/* Notifications Card */}
          <div className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">Notifications</h2>
            <div className="space-y-4">
              {notifications.map(notification => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl bg-white/5 border border-gray-800`}
                >
                  <h3 className="font-semibold text-white mb-1">{notification.title}</h3>
                  <p className="text-gray-400 text-sm">{notification.message}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Middle and Right Columns - Main Content */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          {/* Goals Progress Section */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Goal Progress</h2>
                <p className="text-gray-400">Track your journey</p>
              </div>
              <button
                onClick={() => setShowGoalModal(true)}
                className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <span>View All</span>
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>

            {goalsLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : goals.length === 0 ? (
              <div className="text-center py-8">
                <FlagIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No goals set yet</p>
                <button
                  onClick={() => setShowGoalModal(true)}
                  className="mt-4 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Set your first goal
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {goals.slice(0, 3).map((goal) => (
                  <div
                    key={goal._id}
                    className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          goal.category === 'Mental Health' ? 'bg-red-500/20 text-red-400' :
                          goal.category === 'Academic' ? 'bg-blue-500/20 text-blue-400' :
                          goal.category === 'Personal' ? 'bg-green-500/20 text-green-400' :
                          goal.category === 'Social' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {goal.category === 'Mental Health' ? <HeartIcon className="w-5 h-5" /> :
                           goal.category === 'Academic' ? <AcademicCapIcon className="w-5 h-5" /> :
                           goal.category === 'Personal' ? <SparklesIcon className="w-5 h-5" /> :
                           goal.category === 'Social' ? <UserGroupIcon className="w-5 h-5" /> :
                           <FlagIcon className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="text-white font-medium line-clamp-1">{goal.title}</h3>
                          <div className="flex items-center space-x-2 text-sm">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              goal.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                              goal.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {goal.priority}
                            </span>
                            <span className="text-gray-400">
                              {Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-medium">{goal.progress}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div
                        className={`rounded-full h-1.5 transition-all duration-300 ${
                          goal.progress === 100 ? 'bg-green-500' :
                          goal.progress >= 75 ? 'bg-blue-500' :
                          goal.progress >= 50 ? 'bg-yellow-500' :
                          goal.progress >= 25 ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
                {goals.length > 3 && (
                  <button
                    onClick={() => setShowGoalModal(true)}
                    className="w-full py-3 text-center text-gray-400 hover:text-white transition-colors bg-gray-800/50 rounded-lg hover:bg-gray-800"
                  >
                    View {goals.length - 3} more goals
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Middle Column - Streak */}
          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
            {/* Streak Card */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-green-400 mr-2">{streak}</span>
                  <span className="text-lg text-green-400">{streak === 1 ? 'day' : 'days'}</span>
                </div>
              </div>
              <h3 className="text-white mt-2">Day Streak</h3>
              <p className="text-gray-400 text-sm">Keep it up!</p>
            </motion.div>
          </motion.div>

          {/* Right Column */}
          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
            {showGoalModal && <GoalList onClose={() => setShowGoalModal(false)} />}
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showQuickMood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => !isSubmitting && setShowQuickMood(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-2xl shadow-2xl p-6 border border-gray-800 max-w-md w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-white">How are you feeling?</h3>
                <button 
                  onClick={() => !isSubmitting && setShowQuickMood(false)}
                  disabled={isSubmitting}
                  className={`text-gray-400 hover:text-white transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-3">
                {moodOptions.map((mood, index) => (
                  <motion.button
                    key={index}
                    disabled={isSubmitting}
                    className={`
                      w-full p-3 rounded-xl text-white transition-all flex items-center space-x-3
                      ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800 hover:scale-[1.02]'}
                      ${mood.text === 'Great' ? 'bg-green-500/20 hover:bg-green-500/30' : ''}
                      ${mood.text === 'Good' ? 'bg-blue-500/20 hover:bg-blue-500/30' : ''}
                      ${mood.text === 'Okay' ? 'bg-yellow-500/20 hover:bg-yellow-500/30' : ''}
                      ${mood.text === 'Down' ? 'bg-orange-500/20 hover:bg-orange-500/30' : ''}
                      ${mood.text === 'Sad' ? 'bg-red-500/20 hover:bg-red-500/30' : ''}
                      ${!['Great', 'Good', 'Okay', 'Down', 'Sad'].includes(mood.text) ? 'bg-gray-800/50' : ''}
                    `}
                    onClick={() => handleMoodSubmit(mood)}
                  >
                    <mood.icon className="w-5 h-5" />
                    <span>{mood.text}</span>
                    {isSubmitting && mood.text === moodResponse?.trend?.currentMood && (
                      <div className="ml-auto">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {moodResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-6 right-6 max-w-sm w-full bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-2xl shadow-2xl p-6 border border-gray-800"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">Mood Update</h3>
              <button 
                onClick={() => setMoodResponse(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Current Mood</span>
                <span className="text-white font-medium">{moodResponse.trend.currentMood}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Mood Trend</span>
                <span className="text-white font-medium">{moodResponse.trend.averageIntensity} avg</span>
              </div>
              <p className="text-gray-300 text-sm italic border-t border-gray-800 pt-4 mt-4">
                {moodResponse.supportMessage}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </motion.div>
  );
};

export default StudentDashboard;