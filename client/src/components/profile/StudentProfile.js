import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  CogIcon,
  TrophyIcon,
  CalendarIcon,
  FireIcon,
  ChartBarIcon,
  BellIcon,
  PencilIcon,
  CheckIcon,
  ClipboardIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const StudentProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [streak, setStreak] = useState(0);
  const [editForm, setEditForm] = useState({
    name: '',
    preferences: {
      theme: 'dark',
      notifications: true,
      emailUpdates: true,
    },
  });
  const [connectionCode, setConnectionCode] = useState(null);
  const [showConnectionCode, setShowConnectionCode] = useState(false);

  useEffect(() => {
    fetchProfileData();
    fetchStreak();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await api.get('/api/profile');
      setProfileData(response.data.data);
      setEditForm({
        name: response.data.data.user.name,
        preferences: response.data.data.user.preferences,
      });
    } catch (error) {
      toast.error('Failed to fetch profile data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStreak = async () => {
    try {
      const response = await api.get('/api/mood/streak');
      if (response.data.success) {
        setStreak(response.data.streak);
      }
    } catch (error) {
      console.error('Error fetching streak:', error);
      toast.error('Failed to fetch streak data');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await api.put('/api/profile', editForm);
      setProfileData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          name: response.data.data.name,
          preferences: response.data.data.preferences,
        },
      }));
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error:', error);
    }
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditForm({
        name: profileData.user.name,
        preferences: profileData.user.preferences,
      });
    }
  };

  const generateConnectionCode = async () => {
    try {
      const response = await api.post('/api/connection/generate-code');
      if (response.data.success) {
        setConnectionCode(response.data.data.code);
        setShowConnectionCode(true);
        // Auto-hide code after 1 hour
        setTimeout(() => {
          setConnectionCode(null);
          setShowConnectionCode(false);
        }, 60 * 60 * 1000);
        toast.success('Connection code generated successfully');
      }
    } catch (error) {
      toast.error('Failed to generate connection code');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">No profile data available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-[#050505] to-[#1a1a1a] p-0 lg:p-0"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-8 text-center"
      >
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Profile Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-lg p-3 shadow-2xl relative overflow-hidden"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 pointer-events-none" />
          
          {/* Profile Header */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2">
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-md flex items-center justify-center overflow-hidden border border-white/10">
                  {profileData.user.avatar ? (
                    <img src={profileData.user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserCircleIcon className="w-8 h-8 text-purple-400/80" />
                  )}
                </div>
              </motion.div>
              <div>
                <motion.h2 
                  className="text-lg font-bold text-white mb-0.5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {profileData.user.name}
                </motion.h2>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium">
                    Student
                  </span>
                  <span className="text-gray-400 text-sm">
                    Joined {new Date(profileData.user.joinedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <motion.button
              onClick={handleToggleEdit}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                isEditing 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isEditing ? (
                <>
                  <XMarkIcon className="w-5 h-5" />
                  <span>Cancel Editing</span>
                </>
              ) : (
                <>
                  <PencilIcon className="w-5 h-5" />
                  <span>Edit Profile</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div 
              className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-orange-500/20"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <FireIcon className="w-6 h-6 text-orange-400" />
                </div>
                <span className="text-3xl font-bold text-white">{streak}</span>
              </div>
              <h3 className="text-orange-400 font-medium mb-1">Current Streak</h3>
              <p className="text-gray-400 text-sm">consecutive days</p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <TrophyIcon className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-3xl font-bold text-white">
                  {profileData.stats.completedGoals}/{profileData.stats.totalGoals}
                </span>
              </div>
              <h3 className="text-green-400 font-medium mb-1">Goals Completed</h3>
              <p className="text-gray-400 text-sm">total achievements</p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl p-6 border border-blue-500/20"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <ChartBarIcon className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-3xl font-bold text-white">{profileData.stats.completionRate}%</span>
              </div>
              <h3 className="text-blue-400 font-medium mb-1">Completion Rate</h3>
              <p className="text-gray-400 text-sm">success ratio</p>
            </motion.div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <UserCircleIcon className="w-6 h-6 text-purple-400" />
                Personal Information
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full bg-white/5 rounded-xl p-4 text-white border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-lg text-white bg-white/5 rounded-xl p-4 border border-white/10">
                      {profileData.user.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-2">Email Address</label>
                  <p className="text-lg text-white bg-white/5 rounded-xl p-4 border border-white/10">
                    {profileData.user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <CogIcon className="w-6 h-6 text-purple-400" />
                Preferences
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Theme</label>
                  <select
                    value={editForm.preferences.theme}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        preferences: { ...editForm.preferences, theme: e.target.value },
                      })
                    }
                    disabled={!isEditing}
                    className="w-full bg-white/5 rounded-xl p-4 text-white border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  >
                    <option value="dark">Dark Theme</option>
                    <option value="light">Light Theme</option>
                    <option value="system">System Default</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/10">
                    <div>
                      <label className="text-white font-medium">Push Notifications</label>
                      <p className="text-sm text-gray-400">Get instant updates about your progress</p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={editForm.preferences.notifications}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            preferences: { ...editForm.preferences, notifications: e.target.checked },
                          })
                        }
                        disabled={!isEditing}
                        className="w-12 h-6 rounded-full bg-white/10 checked:bg-purple-500 transition-colors appearance-none cursor-pointer"
                      />
                      <div className="absolute inset-0 flex items-center pointer-events-none">
                        <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                          editForm.preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/10">
                    <div>
                      <label className="text-white font-medium">Email Updates</label>
                      <p className="text-sm text-gray-400">Receive weekly progress summaries</p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={editForm.preferences.emailUpdates}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            preferences: { ...editForm.preferences, emailUpdates: e.target.checked },
                          })
                        }
                        disabled={!isEditing}
                        className="w-12 h-6 rounded-full bg-white/10 checked:bg-purple-500 transition-colors appearance-none cursor-pointer"
                      />
                      <div className="absolute inset-0 flex items-center pointer-events-none">
                        <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                          editForm.preferences.emailUpdates ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <motion.div 
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                onClick={handleUpdateProfile}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl py-4 font-medium hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Save Changes
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Connection Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <BellIcon className="w-6 h-6 text-purple-400" />
                Parent Connection
              </h3>
              <p className="text-gray-400 mt-1">Connect with your parent to share your progress</p>
            </div>
            {!showConnectionCode && (
              <motion.button
                onClick={generateConnectionCode}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Generate Connection Code
              </motion.button>
            )}
          </div>
          
          {showConnectionCode && connectionCode && (
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-gray-400 mb-4">Share this code with your parent to connect:</p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                <div className="bg-white/5 px-8 py-4 rounded-2xl text-3xl font-mono text-white tracking-wider border border-white/10">
                  {connectionCode}
                </div>
                <motion.button
                  onClick={() => {
                    navigator.clipboard.writeText(connectionCode);
                    toast.success('Code copied to clipboard');
                  }}
                  className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ClipboardIcon className="w-6 h-6 text-purple-400" />
                </motion.button>
              </div>
              <p className="text-sm text-gray-500">This code will expire in 1 hour</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StudentProfile;
