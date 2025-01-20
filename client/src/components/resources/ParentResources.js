import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  BookOpenIcon, 
  HeartIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const ParentResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Resources', icon: BookOpenIcon },
    { id: 'parenting', name: 'Parenting Tips', icon: ShieldCheckIcon },
    { id: 'mental_health', name: 'Mental Health', icon: HeartIcon },
    { id: 'communication', name: 'Communication', icon: UserGroupIcon },
  ];

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

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/resources/parent', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch resources');
        }

        const data = await response.json();
        setResources(data.resources);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setError('Failed to load resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const filteredResources = selectedCategory === 'all' 
    ? resources
    : resources.filter(resource => resource.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#050505]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
            <ArrowPathIcon className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
          <p className="text-gray-400">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#050505] py-8 px-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Parent Resources</h1>
          <p className="text-gray-400">Access guides and materials to support your child's well-being</p>
        </motion.div>

        {/* Categories */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-wrap gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                    : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#222]'
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Resources Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource._id}
              variants={itemVariants}
              className="bg-[#111] border border-gray-800 rounded-2xl p-6 hover:border-purple-500/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {resource.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {resource.description}
                  </p>
                </div>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                  {resource.category}
                </span>
              </div>
              <div className="space-y-3">
                {resource.links?.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <BookOpenIcon className="w-4 h-4" />
                    <span>{link.title}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ParentResources; 