import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const DetailedMoodEntry = ({ onSubmit }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(3);
  const [notes, setNotes] = useState('');
  const [activities, setActivities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MOODS = [
    { value: 'happy', emoji: '😊', label: 'Happy', color: 'bg-yellow-500' },
    { value: 'sad', emoji: '😢', label: 'Sad', color: 'bg-blue-500' },
    { value: 'anxious', emoji: '😰', label: 'Anxious', color: 'bg-purple-500' },
    { value: 'calm', emoji: '😌', label: 'Calm', color: 'bg-green-500' },
    { value: 'stressed', emoji: '😫', label: 'Stressed', color: 'bg-red-500' },
    { value: 'energetic', emoji: '⚡', label: 'Energetic', color: 'bg-orange-500' },
    { value: 'tired', emoji: '😴', label: 'Tired', color: 'bg-indigo-500' },
    { value: 'neutral', emoji: '😐', label: 'Neutral', color: 'bg-gray-500' }
  ];

  const ACTIVITIES = [
    { id: 'exercise', label: '🏃‍♂️ Exercise' },
    { id: 'work', label: '💼 Work' },
    { id: 'social', label: '👥 Social' },
    { id: 'family', label: '👨‍👩‍👧‍👦 Family' },
    { id: 'hobby', label: '🎨 Hobby' },
    { id: 'rest', label: '🛋️ Rest' },
    { id: 'study', label: '📚 Study' },
    { id: 'meditation', label: '🧘‍♂️ Meditation' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood) {
      toast.error('Please select a mood');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        mood: selectedMood,
        intensity,
        notes: notes.trim(),
        activities,
        timestamp: new Date()
      });
      
      // Reset form
      setSelectedMood(null);
      setIntensity(3);
      setNotes('');
      setActivities([]);
      toast.success('Mood recorded successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleActivity = (activityId) => {
    setActivities(prev => 
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const getIntensityLabel = (value) => {
    switch (value) {
      case 1: return 'Very Mild';
      case 2: return 'Mild';
      case 3: return 'Moderate';
      case 4: return 'Strong';
      case 5: return 'Very Strong';
      default: return 'Moderate';
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Mood Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-400">How are you feeling?</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <AnimatePresence>
            {MOODS.map((mood) => (
              <motion.button
                key={mood.value}
                type="button"
                onClick={() => setSelectedMood(mood.value)}
                className={`
                  relative overflow-hidden rounded-xl transition-all duration-200
                  ${selectedMood === mood.value 
                    ? 'ring-2 ring-offset-2 ring-offset-[#111111] ring-blue-500 scale-105'
                    : 'hover:scale-105'
                  }
                `}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`
                  absolute inset-0 opacity-10 ${mood.color}
                  ${selectedMood === mood.value ? 'opacity-20' : ''}
                `} />
                <div className="relative p-4 flex flex-col items-center space-y-2">
                  <span className="text-3xl transform transition-transform duration-200">
                    {mood.emoji}
                  </span>
                  <span className={`
                    text-sm font-medium transition-colors duration-200
                    ${selectedMood === mood.value ? 'text-white' : 'text-gray-400'}
                  `}>
                    {mood.label}
                  </span>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Intensity Slider */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-400">
            How intense is this feeling?
          </label>
          <span className="text-sm font-medium text-blue-400">
            {getIntensityLabel(intensity)}
          </span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="1"
            max="5"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="
              w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
            style={{
              background: `linear-gradient(to right, rgb(59, 130, 246) ${(intensity - 1) * 25}%, rgb(31, 41, 55) ${(intensity - 1) * 25}%)`
            }}
          />
          <div className="flex justify-between px-2 mt-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <div
                key={value}
                className={`
                  w-1 h-1 rounded-full transition-colors duration-200
                  ${value <= intensity ? 'bg-blue-500' : 'bg-gray-700'}
                `}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <label className="block text-sm font-medium text-gray-400">
          What activities influenced your mood?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ACTIVITIES.map((activity) => (
            <button
              key={activity.id}
              type="button"
              onClick={() => toggleActivity(activity.id)}
              className={`
                p-3 rounded-lg text-sm font-medium transition-all duration-200
                ${activities.includes(activity.id)
                  ? 'bg-blue-900/20 text-blue-400 ring-1 ring-blue-500'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                }
              `}
            >
              {activity.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <label className="block text-sm font-medium text-gray-400">
          Additional notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did these activities affect your mood? Any specific thoughts or triggers?"
          rows="4"
          className="
            w-full px-4 py-3 rounded-xl
            bg-gray-800/50 border border-gray-700
            text-gray-200 placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500
            resize-none
          "
        />
      </motion.div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={!selectedMood || isSubmitting}
        className={`
          w-full py-3 px-4 rounded-xl font-medium
          transition-all duration-200 disabled:cursor-not-allowed
          ${selectedMood
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
            : 'bg-gray-800 text-gray-500'
          }
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="flex items-center justify-center">
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Recording...
            </>
          ) : (
            'Record Detailed Mood'
          )}
        </span>
      </motion.button>
    </motion.form>
  );
};

export default DetailedMoodEntry;