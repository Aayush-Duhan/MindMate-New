import { useState, useEffect } from 'react';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const url = selectedCategory === 'all' 
          ? 'http://localhost:5000/api/resources'
          : `http://localhost:5000/api/resources/category/${selectedCategory}`;
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = '/login';
            return;
          }
          throw new Error('Failed to fetch resources');
        }
        
        const data = await response.json();
        setResources(data);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message || 'Failed to fetch resources. Please try logging in again.');
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to view resources');
      return;
    }

    fetchResources();
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Self-Help Resources</h1>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#111111] border-gray-800 text-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Resources</option>
            <option value="article">Articles</option>
            <option value="exercise">Exercises</option>
            <option value="guide">Guides</option>
            <option value="video">Videos</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div 
              key={resource._id}
              className="bg-[#111111] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-800 p-6"
            >
              <h2 className="text-xl font-semibold mb-2 text-white">{resource.title}</h2>
              <p className="text-gray-400 mb-4">{resource.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 capitalize">{resource.category}</span>
                <button 
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources; 