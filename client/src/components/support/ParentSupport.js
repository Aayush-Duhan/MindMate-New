import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  PhoneIcon,
  VideoCameraIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const ParentSupport = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const supportCategories = [
    { id: 'all', name: 'All Support', icon: QuestionMarkCircleIcon },
    { id: 'chat', name: 'Chat Support', icon: ChatBubbleLeftRightIcon },
    { id: 'call', name: 'Phone Support', icon: PhoneIcon },
    { id: 'video', name: 'Video Sessions', icon: VideoCameraIcon },
  ];

  const supportOptions = [
    {
      title: "Chat with Counselor",
      description: "Connect with our counselors through instant messaging",
      icon: ChatBubbleLeftRightIcon,
      category: 'chat',
      action: "Start Chat",
      availability: "24/7 Support"
    },
    {
      title: "Schedule Video Call",
      description: "Book a video consultation with our experts",
      icon: VideoCameraIcon,
      category: 'video',
      action: "Book Session",
      availability: "Mon-Fri, 9AM-5PM"
    },
    {
      title: "Phone Consultation",
      description: "Get immediate support through phone call",
      icon: PhoneIcon,
      category: 'call',
      action: "Call Now",
      availability: "24/7 Emergency"
    },
    {
      title: "Parent Support Group",
      description: "Join our weekly parent support group sessions",
      icon: UserGroupIcon,
      category: 'video',
      action: "Join Group",
      availability: "Weekly Sessions"
    }
  ];

  const filteredOptions = selectedCategory === 'all' 
    ? supportOptions 
    : supportOptions.filter(option => option.category === selectedCategory);

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
          <h1 className="text-3xl font-bold text-white mb-2">Parent Support Center</h1>
          <p className="text-gray-400">Get the support you need to help your child thrive</p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Response Time</h3>
                <p className="text-purple-400">Under 15 mins</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Next Available</h3>
                <p className="text-blue-400">Today, 2:00 PM</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Resources</h3>
                <p className="text-green-400">20+ Guides</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-wrap gap-4">
            {supportCategories.map(category => (
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

        {/* Support Options Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {filteredOptions.map((option, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-[#111] border border-gray-800 rounded-2xl p-6 hover:border-purple-500/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <option.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {option.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-6">
                <span className="text-sm text-gray-400 flex items-center">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  {option.availability}
                </span>
                <button className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors">
                  {option.action}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ParentSupport; 