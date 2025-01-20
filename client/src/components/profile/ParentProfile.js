import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserGroupIcon,
  PlusCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const ParentProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectionCode, setConnectionCode] = useState('');
  const [relationshipType, setRelationshipType] = useState('mother');
  const [connectedChildren, setConnectedChildren] = useState([]);

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
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchProfile();
    fetchConnectedChildren();
  }, []);

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile...');
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No auth token found');
      }

      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      console.log('Received profile data:', JSON.stringify(data, null, 2));
      
      if (response.ok && data.success) {
        const userData = data.data;
        setProfile({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          avatar: userData.avatar || ''
        });
      } else {
        const errorMessage = data.error || 'Failed to fetch profile';
        console.error('Profile fetch failed:', errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      toast.error('Error fetching profile data');
      if (err.message === 'No auth token found') {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchConnectedChildren = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No auth token found');
      }

      console.log('Fetching connected children...');
      const response = await fetch('http://localhost:5000/api/connection/children', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Failed to fetch children. Status:', response.status);
        setConnectedChildren([]);
        return;
      }

      const data = await response.json();
      console.log('Received children data:', JSON.stringify(data, null, 2));
      
      if (data.success) {
        setConnectedChildren(data.data || []);
      } else {
        console.warn('Failed to fetch connected children:', data);
        setConnectedChildren([]);
      }
    } catch (err) {
      console.error('Error fetching connected children:', err);
      setConnectedChildren([]);
    }
  };

  const handleConnectChild = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No auth token found');
      }

      const response = await fetch('http://localhost:5000/api/connection/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          code: connectionCode,
          relationshipType
        })
      });

      const data = await response.json();
      console.log('Connection response:', JSON.stringify(data, null, 2));
      
      if (response.ok && data.success) {
        toast.success('Successfully connected with child');
        setShowConnectModal(false);
        setConnectionCode('');
        fetchConnectedChildren(); // Refresh children list
      } else {
        toast.error(data.message || 'Failed to connect with child');
      }
    } catch (err) {
      console.error('Error connecting with child:', err);
      toast.error('Error connecting with child');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleCancelEdit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    fetchProfile(); // Reset to original values
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No auth token found');
      }

      // Validate required fields
      if (!profile.name.trim()) {
        toast.error('Name is required');
        return;
      }

      if (!profile.email.trim()) {
        toast.error('Email is required');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profile.email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      // Phone validation (optional)
      if (profile.phone && !/^\+?[\d\s-]{10,}$/.test(profile.phone)) {
        toast.error('Please enter a valid phone number');
        return;
      }

      const updateData = {
        name: profile.name.trim(),
        email: profile.email.trim(),
        phone: profile.phone ? profile.phone.trim() : null
      };

      console.log('Sending update data:', updateData);

      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();
      console.log('Profile update response:', data);

      if (response.ok && data.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        // Update the profile with the returned data
        setProfile(prev => ({
          ...prev,
          ...data.data
        }));
      } else {
        const errorMessage = data.error || 'Failed to update profile';
        console.error('Profile update failed:', errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
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
          Parent Profile
        </h1>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-[#111] border border-gray-800 rounded-2xl p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 mb-2">
                <UserCircleIcon className="w-5 h-5 inline mr-2" />
                Name
              </label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-2 text-white"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">
                <EnvelopeIcon className="w-5 h-5 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-2 text-white"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">
                <PhoneIcon className="w-5 h-5 inline mr-2" />
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-2 text-white"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            {!isEditing ? (
              <button
                onClick={handleEditClick}
                type="button"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancelEdit}
                  type="button"
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  type="button"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 flex items-center"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Connected Children Section */}
      <motion.div
        variants={itemVariants}
        className="mt-6 bg-[#111] border border-gray-800 rounded-2xl p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Connected Children</h2>
          <button
            onClick={() => setShowConnectModal(true)}
            className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Connect Child
          </button>
        </div>

        <div className="space-y-4">
          {connectedChildren.map((child) => (
            <div
              key={child.id}
              className="flex items-center justify-between bg-[#1a1a1a] p-4 rounded-xl"
            >
              <div className="flex items-center">
                <UserCircleIcon className="w-8 h-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-white font-medium">{child.name}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-400 text-sm">{child.email}</p>
                    <span className="text-gray-500">•</span>
                    <p className="text-gray-400 text-sm capitalize">{child.relationshipType}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {connectedChildren.length === 0 && (
            <p className="text-gray-400 text-center py-4">No children connected yet</p>
          )}
        </div>
      </motion.div>

      {/* Connect Child Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#111] border border-gray-800 rounded-2xl p-6 max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Connect with Child</h3>
              <button
                onClick={() => {
                  setShowConnectModal(false);
                  setConnectionCode('');
                }}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleConnectChild}>
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">
                  Enter Connection Code
                </label>
                <input
                  type="text"
                  value={connectionCode}
                  onChange={(e) => setConnectionCode(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-2 text-white"
                  placeholder="Enter 4-digit code"
                  maxLength="4"
                  pattern="[0-9]{4}"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-400 mb-2">
                  Your Relationship
                </label>
                <select
                  value={relationshipType}
                  onChange={(e) => setRelationshipType(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-2 text-white"
                  required
                >
                  <option value="mother">Mother</option>
                  <option value="father">Father</option>
                  <option value="guardian">Guardian</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowConnectModal(false);
                    setConnectionCode('');
                  }}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  Connect
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ParentProfile;