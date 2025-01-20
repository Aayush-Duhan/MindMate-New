import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const MoodVisualization = ({ entries }) => {
  const [activeView, setActiveView] = useState('intensity'); // 'intensity' or 'distribution'

  const getMoodColor = (mood) => {
    const colorMap = {
      happy: '#EAB308', // yellow-500
      sad: '#3B82F6',   // blue-500
      anxious: '#A855F7', // purple-500
      calm: '#22C55E',  // green-500
      stressed: '#EF4444', // red-500
      energetic: '#F97316', // orange-500
      tired: '#6366F1',  // indigo-500
      neutral: '#6B7280'  // gray-500
    };
    return colorMap[mood] || '#6B7280';
  };

  // Prepare data for intensity chart
  const intensityData = entries
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .map(entry => ({
      date: new Date(entry.timestamp).toLocaleDateString(),
      intensity: entry.intensity,
      mood: entry.mood
    }));

  // Prepare data for mood distribution over time
  const distributionData = entries
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .reduce((acc, entry) => {
      const date = new Date(entry.timestamp).toLocaleDateString();
      const existingDay = acc.find(d => d.date === date);
      
      if (existingDay) {
        existingDay[entry.mood] = (existingDay[entry.mood] || 0) + 1;
      } else {
        const newDay = { date };
        newDay[entry.mood] = 1;
        acc.push(newDay);
      }
      
      return acc;
    }, []);

  const uniqueMoods = [...new Set(entries.map(e => e.mood))];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="text-gray-300 text-sm mb-1">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <p className="text-gray-400 text-sm">
                <span className="capitalize">{entry.name}</span>: {entry.value}
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveView('intensity')}
          className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
            activeView === 'intensity'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-800/30 text-gray-400 hover:bg-gray-800/50'
          }`}
        >
          Intensity Trends
        </button>
        <button
          onClick={() => setActiveView('distribution')}
          className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
            activeView === 'distribution'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-800/30 text-gray-400 hover:bg-gray-800/50'
          }`}
        >
          Mood Distribution
        </button>
      </div>

      {/* Charts */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30"
          style={{ height: '400px' }}
        >
          {activeView === 'intensity' ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={intensityData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <XAxis
                  dataKey="date"
                  stroke="#6B7280"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <YAxis
                  stroke="#6B7280"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="intensity"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 6,
                    style: { fill: '#3B82F6', strokeWidth: 2 }
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={distributionData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <XAxis
                  dataKey="date"
                  stroke="#6B7280"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <YAxis
                  stroke="#6B7280"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                {uniqueMoods.map((mood) => (
                  <Area
                    key={mood}
                    type="monotone"
                    dataKey={mood}
                    stackId="1"
                    stroke={getMoodColor(mood)}
                    fill={getMoodColor(mood)}
                    fillOpacity={0.6}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      {activeView === 'distribution' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap gap-4"
        >
          {uniqueMoods.map(mood => (
            <div key={mood} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getMoodColor(mood) }}
              />
              <span className="text-gray-400 text-sm capitalize">{mood}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MoodVisualization;