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
} from '@heroicons/react/24/outline';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const StudentProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    preferences: {
      theme: 'dark',
      notifications: true,
      emailUpdates: true,
    },
  });

  useEffect(() => {
    fetchProfileData();
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
      className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-10"
    >
      {/* Header */}
      <div className="text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-6"
        >
          Student Profile
        </motion.h1>
        <p className="text-gray-400 text-xl">Manage your personal information and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column - Personal Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-white">Personal Info</h2>
              <button
                onClick={handleToggleEdit}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                {isEditing ? (
                  <CheckIcon className="w-5 h-5 text-green-400" />
                ) : (
                  <PencilIcon className="w-5 h-5 text-gray-300" />
                )}
              </button>
            </div>

            <div className="space-y-6">
              {/* Avatar */}
              <div className="flex justify-center">
                {profileData.user.avatar ? (
                  <img
                    src={profileData.user.avatar}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-purple-500"
                  />
                ) : (
                  <UserCircleIcon className="w-32 h-32 text-gray-400" />
                )}
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-gray-700 rounded-lg p-2 text-white"
                  />
                ) : (
                  <p className="text-lg text-white">{profileData.user.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Email</label>
                <p className="text-lg text-white">{profileData.user.email}</p>
              </div>

              {/* Member Since */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Member Since</label>
                <p className="text-lg text-white">
                  {new Date(profileData.user.joinedAt).toLocaleDateString()}
                </p>
              </div>

              {isEditing && (
                <button
                  onClick={handleUpdateProfile}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg py-2 hover:opacity-90 transition-opacity"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Middle Column - Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-8">Statistics</h2>
            
            <div className="space-y-6">
              <StatCard
                icon={TrophyIcon}
                title="Goals Completed"
                value={profileData.stats.completedGoals}
                total={profileData.stats.totalGoals}
                gradient="from-green-500 to-emerald-500"
              />
              
              <StatCard
                icon={ChartBarIcon}
                title="Completion Rate"
                value={`${profileData.stats.completionRate}%`}
                gradient="from-blue-500 to-indigo-500"
              />
              
              <StatCard
                icon={FireIcon}
                title="Day Streak"
                value={profileData.stats.streakDays}
                gradient="from-orange-500 to-red-500"
              />
              
              <StatCard
                icon={CalendarIcon}
                title="Total Sessions"
                value={profileData.stats.totalMindsessions}
                gradient="from-purple-500 to-pink-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Right Column - Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-8">Recent Activity</h2>
            
            <div className="space-y-4">
              {profileData.recentActivity.map((activity) => (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800 transition-colors duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-lg bg-gray-700">
                      <CalendarIcon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-200 font-medium">{activity.title}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-gray-400">
                          {new Date(activity.updatedAt).toLocaleDateString()}
                        </p>
                        <span className="text-sm font-medium text-purple-400">
                          {activity.status} ({activity.progress}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Settings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 shadow-lg"
      >
        <div className="flex items-center mb-8">
          <CogIcon className="w-7 h-7 text-gray-400 mr-3" />
          <h2 className="text-2xl font-semibold text-white">Settings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Theme Preference */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Theme</h3>
            <select
              value={editForm.preferences.theme}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  preferences: { ...editForm.preferences, theme: e.target.value },
                })
              }
              disabled={!isEditing}
              className="w-full bg-gray-700 rounded-lg p-2 text-white"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Notifications</h3>
            <div className="flex items-center justify-between">
              <label className="text-gray-400">Push Notifications</label>
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
                className="w-5 h-5 rounded text-purple-500"
              />
            </div>
          </div>

          {/* Email Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Email Updates</h3>
            <div className="flex items-center justify-between">
              <label className="text-gray-400">Receive Updates</label>
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
                className="w-5 h-5 rounded text-purple-500"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const StatCard = ({ icon: Icon, title, value, total, gradient }) => (
  <div className="flex items-center space-x-4">
    <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-20`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
        {value} {total && <span className="text-gray-400 text-sm">/ {total}</span>}
      </p>
    </div>
  </div>
);

export default StudentProfile;
