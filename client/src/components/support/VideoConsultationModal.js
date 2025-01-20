import React, { useState, useEffect } from 'react';
import { VideoCameraIcon, XMarkIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { getAvailableSlots } from '../../services/videoConsultationService';

const VideoConsultationModal = ({ isOpen, onClose, onSubmit }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      const response = await getAvailableSlots(selectedDate);
      setAvailableSlots(response.data);
      setSelectedSlot(null);
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNextNDays = (n) => {
    const days = [];
    const today = new Date();
    
    for (let i = 1; i <= n; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        days.push({
          date: date.toISOString().split('T')[0],
          dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
          dayNumber: date.getDate(),
          month: date.toLocaleDateString('en-US', { month: 'short' })
        });
      }
    }
    return days;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedDate) {
      newErrors.date = 'Please select a date';
    }
    if (!selectedSlot) {
      newErrors.slot = 'Please select a time slot';
    }
    if (!topic.trim()) {
      newErrors.topic = 'Please enter a topic for consultation';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const scheduledDate = new Date(selectedDate);
      const [hours, minutes] = selectedSlot.split(':');
      scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      onSubmit({
        scheduledDate: scheduledDate.toISOString(),
        topic,
        duration: 45
      });
    }
  };

  const availableDays = getNextNDays(14); // Get next 14 days excluding weekends

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        
        <div className="relative bg-[#111] rounded-2xl w-full max-w-md p-8 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <VideoCameraIcon className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Schedule Video Consultation</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Select Date
              </label>
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {availableDays.map((day) => (
                  <button
                    key={day.date}
                    type="button"
                    onClick={() => setSelectedDate(day.date)}
                    className={`flex flex-col items-center p-3 rounded-lg border ${
                      selectedDate === day.date
                        ? 'bg-blue-500 border-blue-600 text-white'
                        : 'bg-[#1a1a1a] border-gray-700 text-gray-300 hover:border-blue-500'
                    }`}
                  >
                    <span className="text-sm font-medium">{day.dayName}</span>
                    <span className="text-lg font-bold">{day.dayNumber}</span>
                    <span className="text-xs">{day.month}</span>
                  </button>
                ))}
              </div>
              {errors.date && (
                <p className="mt-1 text-sm text-red-500">{errors.date}</p>
              )}
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Available Time Slots
              </label>
              {loading ? (
                <div className="text-center text-gray-400 py-4">Loading available slots...</div>
              ) : selectedDate ? (
                availableSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {availableSlots.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`flex items-center justify-center px-4 py-2 rounded-lg border ${
                          selectedSlot === slot
                            ? 'bg-blue-500 border-blue-600 text-white'
                            : 'bg-[#1a1a1a] border-gray-700 text-gray-300 hover:border-blue-500'
                        }`}
                      >
                        <ClockIcon className="w-4 h-4 mr-2" />
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-4">No available slots for this date</div>
                )
              ) : (
                <div className="text-center text-gray-400 py-4">Please select a date first</div>
              )}
              {errors.slot && (
                <p className="mt-1 text-sm text-red-500">{errors.slot}</p>
              )}
            </div>

            {/* Topic Input */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Consultation Topic
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className={`w-full px-4 py-2 bg-[#1a1a1a] border ${
                  errors.topic ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white focus:outline-none focus:border-blue-500 h-24 resize-none`}
                placeholder="Please briefly describe what you'd like to discuss..."
              />
              {errors.topic && (
                <p className="mt-1 text-sm text-red-500">{errors.topic}</p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Schedule Session
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VideoConsultationModal;
