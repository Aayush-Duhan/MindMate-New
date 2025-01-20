import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const MoodReminder = () => {
  const [reminders, setReminders] = useState([
    { id: 1, time: '09:00', days: ['Mon', 'Wed', 'Fri'], active: true },
    { id: 2, time: '20:00', days: ['Tue', 'Thu', 'Sat'], active: false }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    time: '',
    days: [],
    active: true
  });

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleToggleDay = (day) => {
    setNewReminder(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const handleAddReminder = () => {
    if (!newReminder.time || newReminder.days.length === 0) {
      toast.error('Please select time and at least one day');
      return;
    }

    setReminders(prev => [
      ...prev,
      {
        ...newReminder,
        id: Math.max(...prev.map(r => r.id), 0) + 1
      }
    ]);
    setNewReminder({ time: '', days: [], active: true });
    setShowAddForm(false);
    toast.success('Reminder added successfully');
  };

  const handleToggleReminder = (id) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id
          ? { ...reminder, active: !reminder.active }
          : reminder
      )
    );
  };

  const handleDeleteReminder = (id) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
    toast.success('Reminder deleted');
  };

  return (
    <div className="space-y-6">
      {/* Existing Reminders */}
      <div className="space-y-4">
        {reminders.map(reminder => (
          <motion.div
            key={reminder.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`
              p-4 rounded-lg border transition-all duration-200
              ${reminder.active 
                ? 'bg-blue-500/10 border-blue-500/20' 
                : 'bg-gray-800/30 border-gray-700/30'}
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleToggleReminder(reminder.id)}
                  className={`
                    w-12 h-6 rounded-full relative transition-colors duration-200
                    ${reminder.active ? 'bg-blue-500' : 'bg-gray-700'}
                  `}
                >
                  <div
                    className={`
                      absolute top-1 w-4 h-4 rounded-full transition-all duration-200
                      ${reminder.active ? 'right-1 bg-white' : 'left-1 bg-gray-400'}
                    `}
                  />
                </button>
                <div>
                  <p className="text-white font-medium">{reminder.time}</p>
                  <p className="text-sm text-gray-400">
                    {reminder.days.join(', ')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteReminder(reminder.id)}
                className="text-gray-400 hover:text-red-400 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Reminder Button */}
      {!showAddForm && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowAddForm(true)}
          className="
            w-full py-3 rounded-lg border border-dashed border-gray-700
            text-gray-400 hover:text-gray-300 hover:border-gray-600
            transition-all duration-200
          "
        >
          + Add Reminder
        </motion.button>
      )}

      {/* Add Reminder Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Time</label>
                <input
                  type="time"
                  value={newReminder.time}
                  onChange={e => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                  className="
                    w-full bg-gray-900/50 border border-gray-700
                    rounded-lg px-3 py-2 text-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  "
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Days</label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map(day => (
                    <button
                      key={day}
                      onClick={() => handleToggleDay(day)}
                      className={`
                        px-3 py-1 rounded-full text-sm transition-all duration-200
                        ${newReminder.days.includes(day)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}
                      `}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="
                    px-4 py-2 rounded-lg text-gray-400
                    hover:text-gray-300 transition-colors duration-200
                  "
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddReminder}
                  className="
                    px-4 py-2 rounded-lg bg-blue-500 text-white
                    hover:bg-blue-600 transition-colors duration-200
                  "
                >
                  Add Reminder
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodReminder;