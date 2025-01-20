import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  UserCircleIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  AcademicCapIcon,
  UserGroupIcon,
  HeartIcon,
  UsersIcon,
  UserMinusIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import UserModal from './UserModal';
import { toast } from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    newThisMonth: 0,
    roleDistribution: {}
  });

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

  const roles = [
    { id: 'all', name: 'All Users', icon: UserGroupIcon },
    { id: 'student', name: 'Students', icon: AcademicCapIcon },
    { id: 'teacher', name: 'Teachers', icon: UserCircleIcon },
    { id: 'counselor', name: 'Counselors', icon: HeartIcon },
    { id: 'parent', name: 'Parents', icon: UserGroupIcon },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const calculateStats = (users) => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const newStats = {
      total: users.length,
      active: users.filter(user => user.isActive).length,
      inactive: users.filter(user => !user.isActive).length,
      newThisMonth: users.filter(user => new Date(user.createdAt) >= thisMonth).length,
      roleDistribution: users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {})
    };

    setStats(newStats);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
        calculateStats(data.users);
      } else {
        throw new Error(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(error.message || 'Failed to load users');
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();
        if (data.success) {
          setUsers(users.filter(user => user._id !== userId));
          toast.success('User deleted successfully');
        } else {
          throw new Error(data.message || 'Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error(error.message || 'Failed to delete user');
      }
    }
  };

  const handleUpdateUserStatus = async (userId, isActive) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive })
      });

      const data = await response.json();
      if (data.success) {
        setUsers(users.map(user => 
          user._id === userId ? { ...user, isActive } : user
        ));
        toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
      } else {
        throw new Error(data.message || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error(error.message || 'Failed to update user status');
    }
  };

  const handleAddUser = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      if (data.success) {
        setUsers([data.user, ...users]);
        setShowModal(false);
        toast.success('User created successfully');
      } else {
        throw new Error(data.message || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Failed to create user');
    }
  };

  const handleEditUser = async (userData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      if (data.success) {
        setUsers(users.map(user => 
          user._id === selectedUser._id ? data.user : user
        ));
        setShowModal(false);
        setSelectedUser(null);
        toast.success('User updated successfully');
      } else {
        throw new Error(data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.message || 'Failed to update user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.profile?.firstName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.profile?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#050505]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
              <p className="text-gray-400">Manage and monitor all system users</p>
            </div>
            <button
              onClick={() => {
                setSelectedUser(null);
                setShowModal(true);
              }}
              className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center space-x-2"
            >
              <UserPlusIcon className="w-5 h-5" />
              <span>Add User</span>
            </button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Total Users</h3>
                <p className="text-purple-400 text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <UserPlusIcon className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Active Users</h3>
                <p className="text-green-400 text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <UserMinusIcon className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Inactive Users</h3>
                <p className="text-red-400 text-2xl font-bold">{stats.inactive}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">New This Month</h3>
                <p className="text-blue-400 text-2xl font-bold">{stats.newThisMonth}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Role Distribution */}
        <motion.div variants={itemVariants} className="bg-[#111] border border-gray-800 rounded-2xl p-6 mb-8">
          <h3 className="text-white font-semibold mb-4">Role Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(stats.roleDistribution).map(([role, count]) => (
              <div key={role} className="bg-[#1a1a1a] rounded-xl p-4">
                <p className="text-gray-400 capitalize">{role}</p>
                <p className="text-2xl font-bold text-purple-400">{count}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-10 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex gap-4">
              {roles.map(role => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                    selectedRole === role.id
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#222]'
                  }`}
                >
                  <role.icon className="w-5 h-5" />
                  <span>{role.name}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div 
          variants={itemVariants}
          className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1a1a1a]">
                  <th className="px-6 py-4 text-left text-gray-400 font-medium">User</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-medium">Role</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-medium">Status</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-medium">Created</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-medium">Last Login</th>
                  <th className="px-6 py-4 text-right text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                          <UserCircleIcon className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {user.profile?.firstName} {user.profile?.lastName}
                          </div>
                          <div className="text-gray-400 text-sm">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        user.isActive 
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => handleUpdateUserStatus(user._id, !user.isActive)}
                          className="p-2 hover:bg-[#222] rounded-lg transition-colors"
                        >
                          {user.isActive ? (
                            <XCircleIcon className="w-5 h-5 text-red-400" />
                          ) : (
                            <CheckCircleIcon className="w-5 h-5 text-green-400" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowModal(true);
                          }}
                          className="p-2 hover:bg-[#222] rounded-lg transition-colors"
                        >
                          <PencilSquareIcon className="w-5 h-5 text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 hover:bg-[#222] rounded-lg transition-colors"
                        >
                          <TrashIcon className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      <UserModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSubmit={selectedUser ? handleEditUser : handleAddUser}
      />
    </motion.div>
  );
};

export default UserManagement; 