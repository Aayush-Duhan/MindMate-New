import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  XMarkIcon,
  XIcon,
  FlagIcon,
  CalendarIcon,
  TagIcon,
  AcademicCapIcon,
  HeartIcon,
  UserGroupIcon,
  SparklesIcon,
  ChevronDoubleRightIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import AddGoalForm from './AddGoalForm';
import api from '../../utils/api';
import { useGoals } from '../../context/GoalContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

const categoryIcons = {
  'Mental Health': <HeartIcon className="w-5 h-5" />,
  'Academic': <AcademicCapIcon className="w-5 h-5" />,
  'Personal': <SparklesIcon className="w-5 h-5" />,
  'Social': <UserGroupIcon className="w-5 h-5" />,
  'Other': <FlagIcon className="w-5 h-5" />
};

const GoalList = ({ onClose }) => {
  const { goals, loading, fetchGoals, updateGoalProgress, deleteGoal } = useGoals();
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  useEffect(() => {
    if (selectedGoal) {
      const updatedGoal = goals.find(g => g._id === selectedGoal._id);
      if (updatedGoal) {
        setSelectedGoal(updatedGoal);
      }
    }
  }, [goals, selectedGoal?._id]);

  const handleProgressUpdate = async (goalId, newProgress) => {
    try {
      await updateGoalProgress(goalId, newProgress);
      // Update selectedGoal if it's the one being modified
      if (selectedGoal && selectedGoal._id === goalId) {
        setSelectedGoal(prevGoal => ({
          ...prevGoal,
          progress: newProgress
        }));
      }
      toast.success('Progress updated successfully');
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const handleSubmit = async (goalData) => {
    try {
      await api.post('/api/goals', goalData);
      toast.success('Goal created successfully!');
      setShowAddModal(false);
      fetchGoals();
    } catch (error) {
      toast.error('Failed to create goal');
    }
  };

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
  };

  const handleDeleteGoal = async (goalId, event) => {
    event.stopPropagation(); // Prevent triggering goal selection
    
    // Show confirmation toast
    toast((t) => (
      <div className="flex flex-col items-center space-y-4 p-4 min-w-[300px]">
        <div className="text-center">
          <p className="text-xl font-semibold text-white mb-2">Delete Goal?</p>
          <p className="text-gray-400">This action cannot be undone.</p>
        </div>
        <div className="flex space-x-4 mt-4">
          <button
            onClick={async () => {
              try {
                await deleteGoal(goalId);
                if (selectedGoal?._id === goalId) {
                  setSelectedGoal(null);
                }
                toast.dismiss(t.id);
                toast.success('Goal deleted successfully', {
                  icon: '🗑️',
                  position: 'center-center',
                  style: {
                    background: '#1F2937',
                    color: '#fff',
                    border: '1px solid #374151',
                    maxWidth: '500px',
                    width: '90%'
                  }
                });
              } catch (error) {
                toast.error('Failed to delete goal', {
                  icon: '❌',
                  position: 'center-center',
                  style: {
                    background: '#1F2937',
                    color: '#fff',
                    border: '1px solid #374151',
                    maxWidth: '500px',
                    width: '90%'
                  }
                });
              }
            }}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'center-center',
      style: {
        background: '#1F2937',
        color: '#fff',
        border: '1px solid #374151',
        maxWidth: '500px',
        width: '90%',
        padding: '0'
      }
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'bg-red-500/20 text-red-300 border-red-500/30',
      'Medium': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'Low': 'bg-green-500/20 text-green-300 border-green-500/30'
    };
    return colors[priority] || 'text-gray-500';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Completed': 'bg-green-500/20 text-green-300 border-green-500/30',
      'In Progress': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'Not Started': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      'On Hold': 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colors[status] || colors['Not Started'];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'In Progress':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'Not Started':
        return <XCircleIcon className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const getDaysRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderGoalDetails = (goal) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-gray-900 rounded-xl p-6 border border-gray-800 h-full overflow-y-auto shadow-xl"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">{goal.title}</h3>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(goal.status)}`}>
              {goal.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(goal.priority)}`}>
              {goal.priority} Priority
            </span>
          </div>
        </div>
        <button
          onClick={(e) => handleDeleteGoal(goal._id, e)}
          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
        <button onClick={() => setSelectedGoal(null)} className="text-gray-400 hover:text-white">
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-gray-400 text-sm mb-2">Description</h4>
          <p className="text-white">{goal.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-gray-400 mb-1">
              {categoryIcons[goal.category]}
              <span>Category</span>
            </div>
            <p className="text-white">{goal.category}</p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-gray-400 mb-1">
              <CalendarIcon className="w-5 h-5" />
              <span>Target Date</span>
            </div>
            <p className="text-white">
              {new Date(goal.targetDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Progress</span>
            <span className="text-white">{goal.progress}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${goal.progress}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-2 py-2">
            {[0, 25, 50, 75, 100].map((progress) => (
              <button
                key={progress}
                onClick={() => handleProgressUpdate(goal._id, progress)}
                className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
                  goal.progress === progress
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {progress}%
              </button>
            ))}
          </div>
        </div>

        {goal.milestones?.length > 0 && (
          <div>
            <h4 className="text-gray-400 text-sm mb-3">Milestones</h4>
            <div className="space-y-3">
              {goal.milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon
                      className={`w-5 h-5 ${
                        milestone.completed ? 'text-green-500' : 'text-gray-500'
                      }`}
                    />
                    <span className="text-white">{milestone.title}</span>
                  </div>
                  <span className="text-gray-400">
                    {new Date(milestone.dueDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 rounded-xl p-6 max-w-6xl w-full mx-auto my-8 relative shadow-xl border border-gray-800 min-h-[600px]"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Your Goals</h2>
            <p className="text-gray-400">Track and manage your personal goals</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Goal</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex gap-6 h-[calc(100vh-300px)] min-h-[400px]">
          <div className={`flex-1 ${selectedGoal ? 'hidden lg:block' : ''}`}>
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 h-full overflow-y-auto"
              >
                {goals.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center h-full text-center">
                    <FlagIcon className="w-16 h-16 text-gray-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No Goals Yet</h3>
                    <p className="text-gray-500">Click the "Add Goal" button above to get started!</p>
                  </div>
                ) : (
                  goals.map((goal) => (
                    <motion.div
                      key={goal._id}
                      variants={itemVariants}
                      className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-purple-500/50 transition-all hover:shadow-xl cursor-pointer group"
                      onClick={() => handleGoalSelect(goal)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2">
                          {categoryIcons[goal.category]}
                          <span className="text-gray-400 text-sm">{goal.category}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(goal.status)}
                          <button
                            onClick={(e) => handleDeleteGoal(goal._id, e)}
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                        {goal.title}
                      </h3>

                      <div className="mb-3">
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white">{goal.progress}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1 text-gray-400">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{getDaysRemaining(goal.targetDate)} days left</span>
                        </div>
                        <button
                          className="text-purple-400 hover:text-purple-300 flex items-center space-x-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedGoal(goal);
                          }}
                        >
                          <span>Details</span>
                          <ChevronDoubleRightIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </div>

          {selectedGoal && (
            <div className="lg:w-1/3 h-full overflow-y-auto">
              {renderGoalDetails(selectedGoal)}
            </div>
          )}
        </div>

        {showAddModal && (
          <AddGoalForm
            onSubmit={handleSubmit}
            onClose={() => setShowAddModal(false)}
          />
        )}
      </motion.div>
    </div>
  );
};

export default GoalList;
