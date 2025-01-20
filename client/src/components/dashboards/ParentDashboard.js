import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  VideoCameraIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  HeartIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';
import VideoConsultationModal from '../support/VideoConsultationModal';
import PhoneConsultationModal from '../support/PhoneConsultationModal';

const ParentDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [childMoodScore] = useState(85);
  const [lastCheckIn] = useState('2 hours ago');
  const [pendingActions] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

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

  const quickActions = [
    {
      title: 'Video Consultation',
      description: 'Schedule a video call with our experts',
      icon: VideoCameraIcon,
      action: () => setShowVideoModal(true),
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400'
    },
    {
      title: 'Phone Consultation',
      description: 'Request an urgent phone consultation',
      icon: PhoneIcon,
      action: () => setShowPhoneModal(true),
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-400'
    },
    {
      title: 'Support Groups',
      description: 'Join parent support groups',
      icon: ChatBubbleLeftRightIcon,
      action: () => navigate('/parent/support'),
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400'
    }
  ];

  const resources = [
    {
      title: 'Parenting Tips',
      description: 'Expert advice on child development',
      icon: BookOpenIcon,
      bgColor: 'bg-orange-500/20',
      textColor: 'text-orange-400',
      link: '/parent/resources'
    },
    {
      title: 'Upcoming Events',
      description: 'Workshops and webinars',
      icon: CalendarDaysIcon,
      bgColor: 'bg-pink-500/20',
      textColor: 'text-pink-400',
      link: '/parent/resources'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Parent-Teacher Meeting",
      date: "Jan 25, 2025",
      time: "2:00 PM",
      type: "meeting",
      icon: UserGroupIcon,
      bgColor: "bg-purple-500/20",
      textColor: "text-purple-400"
    },
    {
      id: 2,
      title: "Mental Health Workshop",
      date: "Jan 28, 2025",
      time: "3:30 PM",
      type: "workshop",
      icon: BookOpenIcon,
      bgColor: "bg-blue-500/20",
      textColor: "text-blue-400"
    },
    {
      id: 3,
      title: "Video Consultation",
      date: "Jan 30, 2025",
      time: "11:00 AM",
      type: "consultation",
      icon: VideoCameraIcon,
      bgColor: "bg-green-500/20",
      textColor: "text-green-400"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="bg-gradient-to-r from-[#111111] via-[#1a1a1a] to-[#111111] rounded-2xl shadow-2xl p-8 border border-gray-800 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div>
                <p className="text-gray-400 mb-2">{getTimeGreeting()}</p>
                <h1 className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Welcome back, {user?.name || 'Parent'}! 👋
                </h1>
                <p className="text-gray-400 text-lg">Monitor your child's well-being</p>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <p className="text-2xl font-bold text-white">{currentTime.toLocaleTimeString()}</p>
                <p className="text-gray-400">{currentTime.toLocaleDateString()}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <button
                onClick={() => setShowVideoModal(true)}
                className="bg-[#111]/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <VideoCameraIcon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-medium">Video Consultation</h3>
                    <p className="text-gray-400 text-sm">Schedule a video call</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setShowPhoneModal(true)}
                className="bg-[#111]/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <PhoneIcon className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-medium">Phone Consultation</h3>
                    <p className="text-gray-400 text-sm">Request a call back</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/parent/support')}
                className="bg-[#111]/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <UserGroupIcon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-medium">Support Groups</h3>
                    <p className="text-gray-400 text-sm">Join parent communities</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </motion.div>

      

        {/* Resources Section */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Resources & Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource, index) => (
              <button
                key={index}
                onClick={() => navigate(resource.link)}
                className="bg-[#111] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${resource.bgColor} rounded-xl flex items-center justify-center`}>
                      <resource.icon className={`w-6 h-6 ${resource.textColor}`} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-medium text-white">{resource.title}</h3>
                      <p className="text-gray-400 text-sm">{resource.description}</p>
                    </div>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-[#111] border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${event.bgColor} rounded-xl flex items-center justify-center`}>
                    <event.icon className={`w-6 h-6 ${event.textColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white">{event.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center text-gray-400">
                        <CalendarDaysIcon className="w-4 h-4 mr-1" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    className={`px-3 py-1 rounded-lg ${event.bgColor} ${event.textColor} text-sm font-medium`}
                    onClick={() => navigate('/parent/resources')}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consultation Modals */}
        <VideoConsultationModal
          isOpen={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          onSubmit={(data) => {
            console.log('Video consultation scheduled:', data);
            setShowVideoModal(false);
          }}
        />

        <PhoneConsultationModal
          isOpen={showPhoneModal}
          onClose={() => setShowPhoneModal(false)}
          onSubmit={(data) => {
            console.log('Phone consultation requested:', data);
            setShowPhoneModal(false);
          }}
        />
      </div>
    </div>
  );
};

export default ParentDashboard;