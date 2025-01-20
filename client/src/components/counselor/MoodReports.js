import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format, subDays, subMonths, startOfWeek, endOfWeek } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MoodReports = ({ studentId }) => {
  const [timeframe, setTimeframe] = useState('week');
  const [moodData, setMoodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMoodData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      let endpoint = `http://localhost:5000/api/mood/student/${studentId}`;
      if (timeframe === 'week') {
        const startDate = startOfWeek(new Date());
        const endDate = endOfWeek(new Date());
        endpoint += `?start=${startDate.toISOString()}&end=${endDate.toISOString()}`;
      } else if (timeframe === 'month') {
        const startDate = subMonths(new Date(), 1);
        endpoint += `?start=${startDate.toISOString()}`;
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch mood data');
      const data = await response.json();
      setMoodData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoodData();
  }, [studentId, timeframe]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          color: 'rgb(156, 163, 175)'
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        }
      },
      x: {
        ticks: {
          color: 'rgb(156, 163, 175)'
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgb(156, 163, 175)'
        }
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-400 text-center p-4 bg-red-900/20 rounded-lg">
      Error: {error}
    </div>
  );

  if (!moodData || !moodData.entries || moodData.entries.length === 0) return (
    <div className="text-gray-400 text-center p-4 bg-gray-800/50 rounded-lg">
      No mood data available for this time period.
    </div>
  );

  const lineChartData = {
    labels: moodData.entries.map(entry => format(new Date(entry.timestamp), 'MMM dd')),
    datasets: [{
      label: 'Mood Intensity',
      data: moodData.entries.map(entry => entry.intensity),
      fill: false,
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      tension: 0.1
    }]
  };

  const moodFrequency = moodData.entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  const barChartData = {
    labels: Object.keys(moodFrequency),
    datasets: [{
      label: 'Mood Frequency',
      data: Object.values(moodFrequency),
      backgroundColor: Object.keys(moodFrequency).map((_, index) => 
        `hsla(${(index * 360) / Object.keys(moodFrequency).length}, 70%, 60%, 0.7)`
      )
    }]
  };

  const averageIntensity = (
    moodData.entries.reduce((sum, entry) => sum + entry.intensity, 0) / moodData.entries.length
  ).toFixed(1);

  const mostCommonMood = Object.entries(moodFrequency)
    .sort((a, b) => b[1] - a[1])[0][0];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="grid grid-cols-2 gap-4 flex-1">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Most Common Mood</p>
            <p className="text-xl font-semibold text-blue-400 mt-1">
              {mostCommonMood.charAt(0).toUpperCase() + mostCommonMood.slice(1)}
            </p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Average Intensity</p>
            <p className="text-xl font-semibold text-blue-400 mt-1">
              {averageIntensity}
            </p>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => setTimeframe('week')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              timeframe === 'week'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              timeframe === 'month'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-300 mb-4">Mood Intensity Over Time</h3>
          <div className="h-64">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-gray-800/50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-300 mb-4">Mood Distribution</h3>
          <div className="h-64">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodReports;
