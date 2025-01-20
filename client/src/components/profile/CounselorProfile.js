import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  UserCircleIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import axios from '../../utils/axios';

const CounselorProfile = ({ user }) => {
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    specialization: user?.specialization || '',
    bio: user?.bio || '',
    yearsOfExperience: user?.yearsOfExperience || 0,
    availability: user?.availability || 'available',
    profile: {
      bio: user?.profile?.bio || '',
      education: user?.profile?.education || '',
      approach: user?.profile?.approach || ''
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Debug log
        
        const userResponse = await axios.get('/api/counselor/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('Profile response:', userResponse.data); // Debug log
        
        setProfileData(prev => ({
          ...prev,
          ...userResponse.data.data
        }));
      } catch (error) {
        console.error('Error fetching profile data:', error.response?.data || error.message);
        toast.error('Failed to load profile data');
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested profile fields
    if (name.includes('profile.')) {
      const field = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [field]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/counselor/profile', profileData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-[#050505] py-8 px-4"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="bg-gradient-to-r from-[#111111] via-[#1a1a1a] to-[#111111] rounded-2xl shadow-2xl p-8 border border-gray-800"
          >
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center">
                <UserCircleIcon className="w-12 h-12 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{profileData.name}</h1>
                <p className="text-gray-400">Counselor</p>
              </div>
            </div>
          </motion.div>

          {/* Profile Form */}
          <motion.div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Profile Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    disabled={true}
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={profileData.specialization}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Years of Experience</label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={profileData.yearsOfExperience}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* New Professional Details Section */}
              <div className="border-t border-gray-800 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Professional Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 mb-2">Professional Bio</label>
                    <textarea
                      name="profile.bio"
                      value={profileData.profile.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="3"
                      className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50"
                      placeholder="Share your professional background and expertise..."
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2">Education</label>
                    <input
                      type="text"
                      name="profile.education"
                      value={profileData.profile.education}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50"
                      placeholder="Your educational background..."
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2">Therapeutic Approach</label>
                    <textarea
                      name="profile.approach"
                      value={profileData.profile.approach}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="3"
                      className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50"
                      placeholder="Describe your counseling approach and methodology..."
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CounselorProfile;