import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  UserCircleIcon,
  KeyIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    joinDate: '',
    lastLogin: ''
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
      opacity: 1
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.profile);
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
      const response = await fetch('http://localhost:5000/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profile)
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Error updating profile');
      console.error('Profile update error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <UserCircleIcon className="w-8 h-8 mr-2 text-purple-500" />
          Admin Profile
        </h1>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-[#111] border border-gray-800 rounded-2xl p-6">
        <form onSubmit={handleUpdateProfile}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 mb-2">First Name</label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                disabled={!isEditing}
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Last Name</label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                disabled={!isEditing}
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                disabled={!isEditing}
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                disabled={!isEditing}
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Department</label>
              <input
                type="text"
                value={profile.department}
                onChange={(e) => setProfile({...profile, department: e.target.value})}
                disabled={!isEditing}
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Join Date</label>
              <input
                type="text"
                value={new Date(profile.joinDate).toLocaleDateString()}
                disabled
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-2 text-white"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <KeyIcon className="w-6 h-6 text-purple-500 mr-2" />
            <h3 className="text-lg font-semibold text-white">Security</h3>
          </div>
          <p className="text-gray-400">Last login: {new Date(profile.lastLogin).toLocaleString()}</p>
        </div>

        <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <BuildingOfficeIcon className="w-6 h-6 text-purple-500 mr-2" />
            <h3 className="text-lg font-semibold text-white">Department</h3>
          </div>
          <p className="text-gray-400">{profile.department}</p>
        </div>

        <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <CalendarIcon className="w-6 h-6 text-purple-500 mr-2" />
            <h3 className="text-lg font-semibold text-white">Member Since</h3>
          </div>
          <p className="text-gray-400">{new Date(profile.joinDate).toLocaleDateString()}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminProfile; 