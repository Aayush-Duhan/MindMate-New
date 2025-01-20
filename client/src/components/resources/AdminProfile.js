import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  UserCircleIcon,
  EnvelopeIcon,
  BellIcon,
  CalendarIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatar: '',
    role: 'admin',
    isActive: true,
    isVerified: true,
    preferences: {
      theme: 'dark',
      notifications: true,
      emailUpdates: true
    },
    lastActive: new Date(),
    createdAt: new Date()
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

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
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Get the current user's ID from localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('User ID not found');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        // Ensure preferences exist with default values
        const preferences = data.user.preferences || {
          theme: 'dark',
          notifications: true,
          emailUpdates: true
        };
        
        setProfile({
          ...data.user,
          preferences
        });
      } else {
        toast.error('Failed to load profile');
      }
    } catch (error) {
      toast.error('Error loading profile');
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('User ID not found');
        return;
      }

      // Create update payload with only allowed fields
      const updatePayload = {
        name: profile.name,
        preferences: {
          theme: profile.preferences?.theme || 'dark',
          notifications: profile.preferences?.notifications ?? true,
          emailUpdates: profile.preferences?.emailUpdates ?? true
        }
      };

      console.log('Sending update payload:', updatePayload); // Debug log

      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatePayload)
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        // Refresh profile data
        fetchProfile();
      } else {
        toast.error(data.message || 'Update failed');
        console.error('Update error:', data); // Debug log
      }
    } catch (error) {
      toast.error('Error updating profile');
      console.error('Profile update error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#050505] to-[#1a1a1a]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-500/20 rounded-full animate-ping"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-[#050505] to-[#1a1a1a] w-full "
    >
      <motion.div variants={itemVariants} className="max-w-3xl mx-auto p-4 md:p-6 pt-16 md:pt-6">
        <div className="sticky top-0 z-10 bg-gradient-to-br from-[#050505] to-[#1a1a1a] py-4">
          <motion.h1 
            className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <UserCircleIcon className="w-8 h-8 md:w-10 md:h-10 mr-3 text-purple-500" />
            Admin Profile
          </motion.h1>
        </div>

        <motion.div 
          variants={itemVariants} 
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 md:p-8 shadow-2xl mt-4"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
            <div className="flex items-center">
              <motion.div 
                className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-2xl flex items-center justify-center mr-4 md:mr-5 relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Profile" className="w-14 h-14 md:w-16 md:h-16 rounded-xl object-cover" />
                ) : (
                  <UserCircleIcon className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
                )}
              </motion.div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{profile.name}</h2>
                <p className="text-purple-400/80">System Administrator</p>
              </div>
            </div>
            <motion.button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-colors ${
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
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <PencilSquareIcon className="w-5 h-5" />
                  <span>Edit Profile</span>
                </>
              )}
            </motion.button>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                variants={itemVariants}
                className="space-y-2"
              >
                <label className="block text-purple-400/80 text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  disabled={!isEditing}
                  className="w-full bg-black/20 backdrop-blur-xl border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your name"
                />
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="space-y-2"
              >
                <label className="block text-purple-400/80 text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full bg-black/10 backdrop-blur-xl border border-gray-800/50 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-xs text-gray-500">Not editable</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="space-y-2"
              >
                <label className="block text-purple-400/80 text-sm font-medium mb-2">Theme Preference</label>
                <select
                  value={profile.preferences?.theme || 'dark'}
                  onChange={(e) => setProfile({
                    ...profile,
                    preferences: { 
                      ...(profile.preferences || {}),
                      theme: e.target.value 
                    }
                  })}
                  disabled={!isEditing}
                  className="w-full bg-black/20 backdrop-blur-xl border border-purple-500/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="dark">Dark Theme</option>
                  <option value="light">Light Theme</option>
                  <option value="system">System Theme</option>
                </select>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="space-y-2"
              >
                <label className="block text-purple-400/80 text-sm font-medium mb-2">Account Status</label>
                <div className="flex items-center space-x-4 mt-2">
                  <div className={`px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-xl ${
                    profile.isActive 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {profile.isActive ? 'Active' : 'Inactive'}
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-xl ${
                    profile.isVerified 
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}>
                    {profile.isVerified ? 'Verified' : 'Unverified'}
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="space-y-4"
              >
                <label className="block text-purple-400/80 text-sm font-medium">Notification Preferences</label>
                <div className="space-y-3">
                  <label className="flex items-center group cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.preferences?.notifications || false}
                      onChange={(e) => setProfile({
                        ...profile,
                        preferences: { 
                          ...(profile.preferences || {}),
                          notifications: e.target.checked 
                        }
                      })}
                      disabled={!isEditing}
                      className="form-checkbox h-5 w-5 text-purple-500 rounded-lg border-purple-500/20 bg-black/20 focus:ring-purple-500 focus:ring-offset-0"
                    />
                    <span className="ml-3 text-white group-hover:text-purple-400 transition-colors">System Notifications</span>
                  </label>
                  <label className="flex items-center group cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.preferences?.emailUpdates || false}
                      onChange={(e) => setProfile({
                        ...profile,
                        preferences: { 
                          ...(profile.preferences || {}),
                          emailUpdates: e.target.checked 
                        }
                      })}
                      disabled={!isEditing}
                      className="form-checkbox h-5 w-5 text-purple-500 rounded-lg border-purple-500/20 bg-black/20 focus:ring-purple-500 focus:ring-offset-0"
                    />
                    <span className="ml-3 text-white group-hover:text-purple-400 transition-colors">Email Updates</span>
                  </label>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="space-y-2"
              >
                <label className="block text-purple-400/80 text-sm font-medium mb-2">Account Info</label>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-400">
                    <CalendarIcon className="w-4 h-4 mr-2 text-purple-500/50" />
                    <span>Last Active: {new Date(profile.lastActive).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <CalendarIcon className="w-4 h-4 mr-2 text-purple-500/50" />
                    <span>Member Since: {new Date(profile.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex justify-end pt-4"
                >
                  <motion.button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium flex items-center space-x-2 hover:opacity-90 transition-opacity"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CheckIcon className="w-5 h-5" />
                    <span>Save Changes</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AdminProfile;