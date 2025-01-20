import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const ShareWithCounselor = ({ entries = [] }) => {  
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState('');
  const [shareType, setShareType] = useState('weekly');
  const [customMessage, setCustomMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const shareOptions = [
    { id: 'weekly', label: 'Weekly Summary', icon: '📅' },
    { id: 'monthly', label: 'Monthly Report', icon: '📊' },
    { id: 'custom', label: 'Custom Range', icon: '📝' }
  ];

  // Fetch counselors on component mount
  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching counselors with token:', token);

      const response = await fetch('http://localhost:5000/api/mood/counselors', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch counselors');
      }

      if (!data.data || !Array.isArray(data.data)) {
        console.error('Invalid data format:', data);
        throw new Error('Invalid data format received from server');
      }

      setCounselors(data.data);
    } catch (error) {
      console.error('Error fetching counselors:', error);
      setError(error.message);
      toast.error(`Failed to load counselors: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!selectedCounselor) {
      toast.error('Please select a counselor');
      return;
    }

    setIsSharing(true);
    try {
      const response = await fetch('http://localhost:5000/api/mood/share', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          counselorId: selectedCounselor,
          shareType,
          message: customMessage
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to share mood data');
      }

      toast.success('Successfully shared with counselor');
      setSelectedCounselor('');
      setCustomMessage('');
    } catch (error) {
      console.error('Error sharing mood data:', error);
      toast.error(error.message);
    } finally {
      setIsSharing(false);
    }
  };

  const getMoodSummary = () => {
    if (!entries || entries.length === 0) return 'No mood entries yet';  

    const recentMoods = entries.slice(-7).map(entry => entry.mood);
    const dominantMood = recentMoods.reduce((acc, mood) => {
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {});

    const mostFrequent = Object.entries(dominantMood)
      .sort(([,a], [,b]) => b - a)[0][0];

    return `Most frequent mood: ${mostFrequent}`;
  };

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"
          />
          <p className="text-gray-400 mt-2">Loading counselors...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
        <h3 className="text-lg font-medium text-white mb-2">Share Your Progress</h3>
        <p className="text-gray-400">
          Share your mood tracking progress with a mental health professional for better guidance and support.
        </p>
      </div>

      {/* Counselor Selection */}
      <div className="space-y-4">
        <label className="block text-sm text-gray-400">Select Counselor</label>
        <div className="grid gap-3">
          {counselors && counselors.length > 0 ? (
            counselors.map(counselor => (
              <motion.button
                key={counselor._id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedCounselor(counselor._id)}
                className={`
                  p-4 rounded-lg border transition-all duration-200 text-left
                  ${selectedCounselor === counselor._id
                    ? 'bg-blue-500/10 border-blue-500/20'
                    : 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50'}
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{counselor.name}</h4>
                    <p className="text-sm text-gray-400">{counselor.specialization}</p>
                  </div>
                  {selectedCounselor === counselor._id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No counselors available</p>
              <p className="text-sm mt-2">Please try again later</p>
            </div>
          )}
        </div>
      </div>

      {/* Share Type Selection */}
      <div className="space-y-4">
        <label className="block text-sm text-gray-400">Share Type</label>
        <div className="grid grid-cols-3 gap-3">
          {shareOptions.map(option => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShareType(option.id)}
              className={`
                p-4 rounded-lg border text-center transition-all duration-200
                ${shareType === option.id
                  ? 'bg-blue-500/10 border-blue-500/20'
                  : 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50'}
              `}
            >
              <div className="text-2xl mb-2">{option.icon}</div>
              <div className="text-sm font-medium text-white">{option.label}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Custom Message */}
      <div className="space-y-4">
        <label className="block text-sm text-gray-400">Additional Notes (Optional)</label>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          placeholder="Add any specific concerns or questions..."
          className="
            w-full h-32 bg-gray-900/50 border border-gray-700 rounded-lg
            px-4 py-3 text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />
      </div>

      {/* Summary Preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30"
      >
        <h4 className="text-sm font-medium text-gray-400 mb-2">Summary Preview</h4>
        <p className="text-white">{getMoodSummary()}</p>
      </motion.div>

      {/* Share Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleShare}
        disabled={isSharing || !selectedCounselor}
        className={`
          w-full py-3 rounded-lg font-medium transition-all duration-200
          ${isSharing || !selectedCounselor
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'}
        `}
      >
        {isSharing ? (
          <div className="flex items-center justify-center space-x-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
            <span>Sharing...</span>
          </div>
        ) : (
          'Share with Counselor'
        )}
      </motion.button>
    </div>
  );
};

export default ShareWithCounselor;