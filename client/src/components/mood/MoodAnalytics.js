import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MoodAnalytics = ({ userId }) => {
  const [moodData, setMoodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/mood/analytics/${timeRange}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch mood data');
        }

        const data = await response.json();
        setMoodData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, [timeRange]);

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex space-x-4">
        {['week', 'month', 'year'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg ${
              timeRange === range 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Mood Trend Graph */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Mood Trends</h3>
        <div className="h-64">
          {/* Add your preferred charting library here */}
          {moodData?.trends.map((trend, index) => (
            <motion.div
              key={index}
              initial={{ width: 0 }}
              animate={{ width: `${trend.percentage}%` }}
              className="h-8 bg-blue-500 rounded-r-full mb-2"
            />
          ))}
        </div>
      </div>

      {/* Activity Correlation */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Activity Impact</h3>
        <div className="space-y-4">
          {moodData?.activities.map((activity) => (
            <div key={activity.name} className="flex items-center justify-between">
              <span>{activity.name}</span>
              <div className="flex items-center space-x-2">
                <span className={`text-${activity.impact > 0 ? 'green' : 'red'}-500`}>
                  {activity.impact > 0 ? '+' : ''}{activity.impact}%
                </span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-${activity.impact > 0 ? 'green' : 'red'}-500`}
                    style={{ width: `${Math.abs(activity.impact)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Personalized Insights</h3>
        <div className="space-y-4">
          {moodData?.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600">{index + 1}</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium">{rec.title}</h4>
                <p className="text-gray-600">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodAnalytics; 