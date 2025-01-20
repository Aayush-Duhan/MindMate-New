import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const UserModal = ({ isOpen, onClose, user, onSubmit }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student',
    profile: {
      firstName: '',
      lastName: ''
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        password: '',
        role: user.role,
        profile: {
          firstName: user.profile?.firstName || '',
          lastName: user.profile?.lastName || ''
        }
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111] border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {user ? 'Edit User' : 'Add New User'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              {!user && (
                <div>
                  <label className="block text-gray-400 mb-2">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    required={!user}
                    minLength={6}
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-400 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="counselor">Counselor</option>
                  <option value="parent">Parent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.profile.firstName}
                  onChange={(e) => setFormData({
                    ...formData,
                    profile: { ...formData.profile, firstName: e.target.value }
                  })}
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.profile.lastName}
                  onChange={(e) => setFormData({
                    ...formData,
                    profile: { ...formData.profile, lastName: e.target.value }
                  })}
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  {user ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserModal; 