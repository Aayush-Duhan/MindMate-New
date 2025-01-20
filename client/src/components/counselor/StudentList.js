import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  UserCircleIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { mockCases, moodTypes, getTimeAgo } from '../../mockData/counselorData';

const StudentList = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);

  const filteredCases = mockCases.filter(case_ => {
    if (activeTab === 'all') return true;
    if (activeTab === 'chats') return case_.type === 'chat' || case_.type === 'both';
    if (activeTab === 'mood') return case_.type === 'mood' || case_.type === 'both';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">Case Management</h1>
          <p className="text-gray-400">Monitor and manage your active cases</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            All Cases
          </button>
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'chats'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            Active Chats
          </button>
          <button
            onClick={() => setActiveTab('mood')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'mood'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            Mood Reports
          </button>
        </div>

        {/* Case List */}
        <div className="grid gap-4">
          {filteredCases.map((case_) => (
            <motion.div
              key={case_.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              className="bg-gray-800 rounded-xl p-6 cursor-pointer hover:bg-gray-750 transition-all duration-200"
              onClick={() => setSelectedCase(case_)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-xl font-semibold text-blue-400">
                      Case #{case_.id}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      case_.status === 'active' 
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-600/20 text-gray-400'
                    }`}>
                      {case_.status.charAt(0).toUpperCase() + case_.status.slice(1)}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {(case_.type === 'chat' || case_.type === 'both') && (
                      <div className="flex items-start space-x-3">
                        <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-gray-300 line-clamp-1">{case_.lastMessage}</p>
                          {case_.unreadCount > 0 && (
                            <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-lg mt-2">
                              {case_.unreadCount} unread message{case_.unreadCount > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {(case_.type === 'mood' || case_.type === 'both') && case_.moodReport && (
                      <div className="flex items-center space-x-3">
                        <ChartBarIcon className="h-5 w-5 text-gray-400" />
                        <div className="flex items-center space-x-2">
                          <span className={moodTypes[case_.moodReport.mood]?.color || 'text-gray-400'}>
                            {moodTypes[case_.moodReport.mood]?.emoji}
                          </span>
                          <span className="text-gray-300">
                            Level {case_.moodReport.intensity}
                          </span>
                          {case_.moodReport.notes && (
                            <span className="text-gray-400 text-sm ml-2 line-clamp-1">
                              - {case_.moodReport.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-4">
                  <div className="flex items-center text-gray-400 text-sm">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {getTimeAgo(case_.lastActivity)}
                  </div>

                  <div className="flex space-x-2">
                    {(case_.type === 'chat' || case_.type === 'both') && (
                      <button 
                        className={`p-2 rounded-lg transition-colors ${
                          case_.unreadCount > 0
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-600/10 text-blue-400 hover:bg-blue-600/20'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success('Opening chat...');
                        }}
                      >
                        <ChatBubbleLeftRightIcon className="h-5 w-5" />
                      </button>
                    )}
                    {(case_.type === 'mood' || case_.type === 'both') && (
                      <button 
                        className="p-2 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success('Opening mood report...');
                        }}
                      >
                        <DocumentTextIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              {case_.moodReport?.triggers && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {case_.moodReport.triggers.map((trigger, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded-lg text-sm ${
                          moodTypes[case_.moodReport.mood]?.bgColor || 'bg-gray-700'
                        } ${moodTypes[case_.moodReport.mood]?.color || 'text-gray-400'}`}
                      >
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {filteredCases.length === 0 && (
            <div className="text-center py-12 bg-gray-800/50 rounded-xl">
              <UserCircleIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-400">No cases found for the selected filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentList;
