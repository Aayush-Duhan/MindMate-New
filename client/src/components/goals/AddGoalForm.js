import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  HeartIcon,
  AcademicCapIcon,
  UserGroupIcon,
  SparklesIcon,
  FlagIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const categoryIcons = {
  'Mental Health': <HeartIcon className="w-6 h-6" />,
  'Academic': <AcademicCapIcon className="w-6 h-6" />,
  'Personal': <SparklesIcon className="w-6 h-6" />,
  'Social': <UserGroupIcon className="w-6 h-6" />,
  'Other': <FlagIcon className="w-6 h-6" />
};

const priorityColors = {
  'High': 'bg-red-500/20 border-red-500/30 text-red-400',
  'Medium': 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
  'Low': 'bg-green-500/20 border-green-500/30 text-green-400'
};

const AddGoalForm = ({ onSubmit, onClose }) => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [goal, setGoal] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    targetDate: '',
    milestones: []
  });

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    switch (currentStep) {
      case 1:
        if (!goal.title.trim()) {
          newErrors.title = 'Title is required';
        } else if (goal.title.length > 100) {
          newErrors.title = 'Title cannot be more than 100 characters';
        }
        
        if (!goal.description.trim()) {
          newErrors.description = 'Description is required';
        } else if (goal.description.length > 500) {
          newErrors.description = 'Description cannot be more than 500 characters';
        }
        break;
        
      case 2:
        if (!goal.category) {
          newErrors.category = 'Please select a category';
        }
        if (!goal.priority) {
          newErrors.priority = 'Please select a priority level';
        }
        break;
        
      case 3:
        if (!goal.targetDate) {
          newErrors.targetDate = 'Please select a target date';
        } else {
          const targetDate = new Date(goal.targetDate);
          const today = new Date();
          if (targetDate < today) {
            newErrors.targetDate = 'Target date cannot be in the past';
          }
        }
        
        goal.milestones.forEach((milestone, index) => {
          if (!milestone.title.trim()) {
            newErrors[`milestone${index}`] = 'Milestone title is required';
          }
        });
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step) && step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    const formattedGoal = {
      ...goal,
      title: goal.title.trim(),
      description: goal.description.trim(),
      milestones: goal.milestones.map(milestone => ({
        title: milestone.title.trim(),
        dueDate: milestone.dueDate || null,
        completed: false
      })).filter(milestone => milestone.title),
      status: 'not-started',
      progress: 0
    };

    try {
      await onSubmit(formattedGoal);
    } catch (error) {
      setErrors({
        submit: error.response?.data?.error || 'Failed to create goal'
      });
    }
  };

  const addMilestone = () => {
    setGoal({
      ...goal,
      milestones: [...goal.milestones, { title: '', dueDate: '', completed: false }]
    });
  };

  const removeMilestone = (index) => {
    setGoal({
      ...goal,
      milestones: goal.milestones.filter((_, i) => i !== index)
    });
  };

  const updateMilestone = (index, field, value) => {
    const updatedMilestones = [...goal.milestones];
    updatedMilestones[index] = { ...updatedMilestones[index], [field]: value };
    setGoal({ ...goal, milestones: updatedMilestones });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Title</label>
              <input
                type="text"
                value={goal.title}
                onChange={(e) => setGoal({ ...goal, title: e.target.value })}
                className="w-full bg-gray-900 text-white rounded-lg px-4 py-3 border border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                placeholder="Enter goal title"
                required
              />
              {errors.title && <p className="text-red-400 text-sm">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm">Description</label>
              <textarea
                value={goal.description}
                onChange={(e) => setGoal({ ...goal, description: e.target.value })}
                className="w-full bg-gray-900 text-white rounded-lg px-4 py-3 border border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                rows="4"
                placeholder="Describe your goal"
              />
              {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-gray-300 mb-4 text-sm">Category</label>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(categoryIcons).map(([category, icon]) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setGoal({ ...goal, category })}
                    className={`flex items-center space-x-3 p-4 rounded-lg border transition-all ${
                      goal.category === category
                        ? 'bg-purple-600/20 border-purple-500 text-white'
                        : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    {icon}
                    <span>{category}</span>
                  </button>
                ))}
              </div>
              {errors.category && <p className="text-red-400 text-sm">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-gray-300 mb-4 text-sm">Priority</label>
              <div className="grid grid-cols-3 gap-4">
                {['High', 'Medium', 'Low'].map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setGoal({ ...goal, priority })}
                    className={`p-3 rounded-lg border transition-all ${
                      goal.priority === priority
                        ? priorityColors[priority]
                        : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
              {errors.priority && <p className="text-red-400 text-sm">{errors.priority}</p>}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Target Date</label>
              <input
                type="date"
                value={goal.targetDate}
                onChange={(e) => setGoal({ ...goal, targetDate: e.target.value })}
                className="w-full bg-gray-900 text-white rounded-lg px-4 py-3 border border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                required
              />
              {errors.targetDate && <p className="text-red-400 text-sm">{errors.targetDate}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-gray-300 text-sm">Milestones</label>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span className="text-sm">Add Milestone</span>
                </button>
              </div>

              <div className="space-y-4">
                {goal.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-4 bg-gray-900 rounded-lg p-4 border border-gray-800">
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={milestone.title}
                        onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                        className="w-full bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                        placeholder="Milestone title"
                      />
                      {errors[`milestone${index}`] && <p className="text-red-400 text-sm">{errors[`milestone${index}`]}</p>}
                      <input
                        type="date"
                        value={milestone.dueDate}
                        onChange={(e) => updateMilestone(index, 'dueDate', e.target.value)}
                        className="w-full bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-4">Review Your Goal</h3>
              
              <div className="space-y-4">
                <div>
                  <span className="text-gray-400 text-sm">Title</span>
                  <p className="text-white">{goal.title}</p>
                </div>

                <div>
                  <span className="text-gray-400 text-sm">Description</span>
                  <p className="text-white">{goal.description}</p>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-1">
                    <span className="text-gray-400 text-sm">Category</span>
                    <div className="flex items-center space-x-2 text-white">
                      {categoryIcons[goal.category]}
                      <span>{goal.category}</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <span className="text-gray-400 text-sm">Priority</span>
                    <p className={`inline-block px-3 py-1 rounded-full text-sm ${priorityColors[goal.priority]}`}>
                      {goal.priority}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 text-sm">Target Date</span>
                  <p className="text-white">{new Date(goal.targetDate).toLocaleDateString()}</p>
                </div>

                {goal.milestones.length > 0 && (
                  <div>
                    <span className="text-gray-400 text-sm">Milestones</span>
                    <div className="mt-2 space-y-2">
                      {goal.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center space-x-3 bg-gray-800/50 rounded-lg p-3">
                          <CheckCircleIcon className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-white">{milestone.title}</p>
                            <p className="text-gray-400 text-sm">
                              Due: {new Date(milestone.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full mx-4 border border-gray-800 shadow-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Create New Goal</h3>
            <div className="flex items-center space-x-2 mt-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full w-12 transition-colors ${
                    i === step ? 'bg-purple-500' : 'bg-gray-800'
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          <div className="flex justify-between pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={handleBack}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                step === 1
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-300 hover:text-white'
              }`}
              disabled={step === 1}
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back</span>
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <span>Next</span>
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <span>Create Goal</span>
                <CheckCircleIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddGoalForm;
