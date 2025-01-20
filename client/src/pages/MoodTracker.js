import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import QuickMoodEntry from '../components/mood/QuickMoodEntry';
import DetailedMoodEntry from '../components/mood/DetailedMoodEntry';
import MoodStats from '../components/mood/MoodStats';
import MoodVisualization from '../components/mood/MoodVisualization';
import ShareWithCounselor from '../components/mood/ShareWithCounselor';
import MoodReminder from '../components/mood/MoodReminder';

const MoodTracker = () => {
  const [moodEntries, setMoodEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [entryMode, setEntryMode] = useState('quick');
  const [activeTab, setActiveTab] = useState('entry');

  // Move helper functions inside component to access moodEntries
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

  const getMostCommonMood = () => {
    if (!moodEntries.length) return 'N/A';
    
    const moodCounts = moodEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0][0];
  };

  const getAverageIntensity = () => {
    if (!moodEntries.length) return 'N/A';
    
    const sum = moodEntries.reduce((acc, entry) => acc + entry.intensity, 0);
    return (sum / moodEntries.length).toFixed(1);
  };

  useEffect(() => {
    fetchMoodEntries();
  }, []);

  const fetchMoodEntries = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:5000/api/mood', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch mood entries');
      }

      setMoodEntries(data.data);
    } catch (error) {
      console.error('Error fetching mood entries:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickMoodEntry = async (entry) => {
    try {
      const response = await fetch('http://localhost:5000/api/mood/quick', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(entry)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create mood entry');
      }

      if (data.recentEntries) {
        setMoodEntries(data.recentEntries);
      } else {
        fetchMoodEntries();
      }
    } catch (error) {
      console.error('Error creating mood entry:', error);
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-gray-400 flex items-center space-x-2"
        >
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading your mood data...</span>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'entry', label: 'Record Mood' },
    { id: 'stats', label: 'Statistics' },
    { id: 'share', label: 'Share' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-[#050505] text-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mood Tracker</h1>
          <p className="text-gray-400">Track and understand your emotional well-being</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-800">
            <nav className="-mb-px flex space-x-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'entry' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Entry Form */}
              <div className="bg-[#111111] rounded-xl p-6 shadow-lg">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">How are you feeling?</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEntryMode('quick')}
                        className={`px-3 py-1 rounded-full text-sm ${
                          entryMode === 'quick'
                            ? 'bg-blue-900/20 text-blue-400'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                      >
                        Quick
                      </button>
                      <button
                        onClick={() => setEntryMode('detailed')}
                        className={`px-3 py-1 rounded-full text-sm ${
                          entryMode === 'detailed'
                            ? 'bg-blue-900/20 text-blue-400'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                      >
                        Detailed
                      </button>
                    </div>
                  </div>
                  {entryMode === 'quick' ? (
                    <QuickMoodEntry onSubmit={handleQuickMoodEntry} />
                  ) : (
                    <DetailedMoodEntry onSubmit={handleQuickMoodEntry} />
                  )}
                </div>
              </div>

              {/* Recent Entries */}
              <div className="bg-[#111111] rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Recent Entries</h2>
                {moodEntries.length > 0 ? (
                  <div className="space-y-4">
                    {moodEntries.slice(0, 5).map((entry) => (
                      <motion.div
                        key={entry._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#1a1a1a] rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                            <div>
                              <p className="font-medium text-white capitalize">{entry.mood}</p>
                              <p className="text-sm text-gray-400">
                                {new Date(entry.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="px-2 py-1 rounded bg-blue-900/20 text-blue-400 text-sm">
                            Level {entry.intensity}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>No mood entries yet</p>
                    <p className="text-sm mt-2">Start tracking your mood to see your entries here</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Stats and Visualization */}
              <div className="space-y-8">
                <div className="bg-[#111111] rounded-xl p-6 shadow-lg">
                  <h2 className="text-xl font-semibold text-white mb-6">Mood Statistics</h2>
                  <MoodStats entries={moodEntries} />
                </div>

                <div className="bg-[#111111] rounded-xl p-6 shadow-lg">
                  <h2 className="text-xl font-semibold text-white mb-6">Mood Patterns</h2>
                  <MoodVisualization entries={moodEntries} />
                </div>
              </div>

              {/* Reminders and Settings */}
              <div className="space-y-8">
                <div className="bg-[#111111] rounded-xl p-6 shadow-lg">
                  <h2 className="text-xl font-semibold text-white mb-6">Mood Reminders</h2>
                  <MoodReminder />
                </div>

                {/* Optional: Additional stats or settings can go here */}
                <div className="bg-[#111111] rounded-xl p-6 shadow-lg">
                  <h2 className="text-xl font-semibold text-white mb-4">Quick Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                      <span className="text-gray-400">Total Entries</span>
                      <span className="text-white font-medium">{moodEntries.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                      <span className="text-gray-400">Most Common Mood</span>
                      <span className="text-white font-medium flex items-center space-x-2">
                        <span>{getMostCommonMood()}</span>
                        <span>{getMoodEmoji(getMostCommonMood())}</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                      <span className="text-gray-400">Average Intensity</span>
                      <span className="text-white font-medium">
                        {getAverageIntensity()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'share' && (
            <div className="bg-[#111111] rounded-xl p-6 shadow-lg">
              <ShareWithCounselor entries={moodEntries} />
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MoodTracker;