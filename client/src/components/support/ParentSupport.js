import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from '../../utils/axios';
import { 
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  VideoCameraIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { requestConsultation } from '../../services/phoneConsultationService';
import { scheduleConsultation } from '../../services/videoConsultationService';
import PhoneConsultationModal from './PhoneConsultationModal';
import VideoConsultationModal from './VideoConsultationModal';

const ParentSupport = () => {
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGroupsTable, setShowGroupsTable] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const initialGroupState = {
    name: '',
    description: '',
    maxParticipants: 15,
    schedule: {
      dayOfWeek: '',
      time: '',
      duration: ''
    },
    topics: [],
    groupType: 'general'
  };

  const [newGroup, setNewGroup] = useState(initialGroupState);

  const handleOpenCreateModal = () => {
    setNewGroup(initialGroupState);
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setNewGroup(initialGroupState);
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (newGroup.schedule.dayOfWeek === '' || newGroup.schedule.time === '' || newGroup.schedule.duration === '') {
      toast.error('Please complete all schedule fields');
      return;
    }
    
    try {
      const formattedGroup = {
        ...newGroup,
        schedule: {
          ...newGroup.schedule,
          dayOfWeek: parseInt(newGroup.schedule.dayOfWeek),
          duration: parseInt(newGroup.schedule.duration)
        }
      };
      
      await axios.post('/api/groups', formattedGroup);
      toast.success('Group created successfully');
      handleCloseCreateModal();
      fetchGroups();
      fetchMyGroups();
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    }
  };

  const parentGroupTypes = [
    { 
      id: 'academic',
      name: 'Academic Support',
      description: 'Discuss strategies for supporting your child\'s academic journey and learning challenges.'
    },
    { 
      id: 'emotional',
      name: 'Emotional Well-being',
      description: 'Share experiences and learn techniques for supporting your child\'s emotional health.'
    },
    { 
      id: 'behavioral',
      name: 'Behavioral Management',
      description: 'Exchange ideas and get guidance on managing challenging behaviors and promoting positive ones.'
    },
    { 
      id: 'social',
      name: 'Social Skills Development',
      description: 'Learn ways to help your child develop strong social connections and communication skills.'
    },
    { 
      id: 'general',
      name: 'General Parenting Support',
      description: 'A space for discussing various parenting challenges and sharing experiences.'
    }
  ];

  const suggestedTopics = {
    academic: [
      'Homework Strategies',
      'Test Anxiety',
      'Learning Disabilities',
      'School-Life Balance',
      'Study Skills'
    ],
    emotional: [
      'Anxiety Management',
      'Building Self-esteem',
      'Dealing with Depression',
      'Emotional Regulation',
      'Stress Management'
    ],
    behavioral: [
      'Setting Boundaries',
      'Positive Reinforcement',
      'Screen Time Management',
      'Routine Building',
      'Conflict Resolution'
    ],
    social: [
      'Making Friends',
      'Bullying Prevention',
      'Social Anxiety',
      'Digital Communication',
      'Peer Pressure'
    ],
    general: [
      'Work-Life Balance',
      'Parent Self-care',
      'Family Communication',
      'Sibling Relationships',
      'Life Transitions'
    ]
  };

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
    fetchGroups();
    fetchMyGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('/api/groups');
      setGroups(response.data.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Failed to load support groups');
    }
  };

  const fetchMyGroups = async () => {
    try {
      const response = await axios.get('/api/groups/my');
      setMyGroups(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching my groups:', error);
      toast.error('Failed to load your groups');
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await axios.post(`/api/groups/${groupId}/join`);
      toast.success('Successfully joined the group');
      fetchGroups();
      fetchMyGroups();
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error(error.response?.data?.error || 'Failed to join group');
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      await axios.delete(`/api/groups/${groupId}/leave`);
      toast.success('Successfully left the group');
      fetchGroups();
      fetchMyGroups();
    } catch (error) {
      console.error('Error leaving group:', error);
      toast.error(error.response?.data?.error || 'Failed to leave group');
    }
  };

  const handleConsultationRequest = async (formData) => {
    try {
      await requestConsultation(formData);
      toast.success('Consultation request submitted successfully! A counselor will call you shortly.');
      setShowPhoneModal(false);
    } catch (error) {
      toast.error(error.message || 'Failed to request consultation');
    }
  };

  const handleVideoConsultation = async (formData) => {
    try {
      await scheduleConsultation(formData);
      toast.success('Video consultation scheduled successfully! Check your email for the meeting link.');
      setShowVideoModal(false);
    } catch (error) {
      toast.error(error.message || 'Failed to schedule video consultation');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Parent Support Center</h1>
          <p className="text-gray-400">Get the support you need to help your child thrive</p>
        </div>

        {/* Support Type Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setSelectedTab('all')}
            className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all ${
              selectedTab === 'all'
                ? 'bg-purple-500 text-white'
                : 'bg-[#111] text-gray-400 hover:bg-[#1a1a1a]'
            }`}
          >
            <span>All Support</span>
          </button>
          <button
            onClick={() => setSelectedTab('chat')}
            className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all ${
              selectedTab === 'chat'
                ? 'bg-purple-500 text-white'
                : 'bg-[#111] text-gray-400 hover:bg-[#1a1a1a]'
            }`}
          >
            <span>Chat Support</span>
          </button>
          <button
            onClick={() => setSelectedTab('phone')}
            className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all ${
              selectedTab === 'phone'
                ? 'bg-purple-500 text-white'
                : 'bg-[#111] text-gray-400 hover:bg-[#1a1a1a]'
            }`}
          >
            <span>Phone Support</span>
          </button>
          <button
            onClick={() => setSelectedTab('video')}
            className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all ${
              selectedTab === 'video'
                ? 'bg-purple-500 text-white'
                : 'bg-[#111] text-gray-400 hover:bg-[#1a1a1a]'
            }`}
          >
            <span>Video Sessions</span>
          </button>
          <button
            onClick={() => setSelectedTab('group')}
            className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all ${
              selectedTab === 'group'
                ? 'bg-purple-500 text-white'
                : 'bg-[#111] text-gray-400 hover:bg-[#1a1a1a]'
            }`}
          >
            <span>Support Groups</span>
          </button>
        </div>

        {/* Support Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chat Support Card */}
          {(selectedTab === 'all' || selectedTab === 'chat') && (
            <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Chat with Counselor</h3>
                  <p className="text-gray-400">Connect with our counselors through instant messaging</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-400 flex items-center">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  24/7 Support
                </span>
                <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
                  Start Chat
                </button>
              </div>
            </div>
          )}

          {/* Video Call Card */}
          {(selectedTab === 'all' || selectedTab === 'video') && (
            <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <VideoCameraIcon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Schedule Video Call</h3>
                  <p className="text-gray-400">Book a video consultation with our experts</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-400 flex items-center">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  Mon-Fri, 9AM-5PM
                </span>
                <button 
                  onClick={() => setShowVideoModal(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Book Session
                </button>
              </div>
            </div>
          )}

          {/* Phone Support Card */}
          {(selectedTab === 'all' || selectedTab === 'phone') && (
            <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <PhoneIcon className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Phone Consultation</h3>
                  <p className="text-gray-400">Get immediate support through phone call</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-400 flex items-center">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  24/7 Emergency
                </span>
                <button 
                  onClick={() => setShowPhoneModal(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Call Now
                </button>
              </div>
            </div>
          )}

          {/* Parent Support Group Card */}
          {(selectedTab === 'all' || selectedTab === 'group') && (
            <div 
              className="bg-[#111] border border-gray-800 rounded-2xl p-6 cursor-pointer hover:border-purple-500/30"
              onClick={() => setShowGroupsTable(true)}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <UserGroupIcon className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Parent Support Group</h3>
                  <p className="text-gray-400">Join our weekly parent support group sessions</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-400 flex items-center">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  Weekly Sessions
                </span>
                <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
                  Join Group
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Groups Table Modal */}
      {showGroupsTable && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#111] rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal content */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Parent Support Groups</h2>
              <button
                onClick={() => setShowGroupsTable(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              </div>
            ) : (
              <>
                {/* My Groups Section */}
                {myGroups.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">My Groups</h3>
                    <div className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-900">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Group</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Schedule</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Members</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {myGroups.map((group) => (
                            <tr key={group._id} className="hover:bg-gray-900/50">
                              <td className="px-6 py-4">
                                <div>
                                  <div className="text-sm font-medium text-white">{group.name}</div>
                                  <div className="text-sm text-gray-400">{group.description}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-300">
                                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][group.schedule.dayOfWeek]}<br/>
                                  {group.schedule.time} ({group.schedule.duration} min)
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-300">{group.participantCount || 0} members</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  group.role === 'facilitator' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                                }`}>
                                  {group.role}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {group.role !== 'facilitator' && (
                                  <button
                                    onClick={() => handleLeaveGroup(group._id)}
                                    className="text-red-400 hover:text-red-300 text-sm"
                                  >
                                    Leave
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Available Groups Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Available Groups</h3>
                  <div className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-900">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Group</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Schedule</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Facilitator</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Members</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {groups
                          .filter(group => !myGroups.some(mg => mg._id === group._id))
                          .map((group) => (
                            <tr key={group._id} className="hover:bg-gray-900/50">
                              <td className="px-6 py-4">
                                <div>
                                  <div className="text-sm font-medium text-white">{group.name}</div>
                                  <div className="text-sm text-gray-400">{group.description}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-300">
                                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][group.schedule.dayOfWeek]}<br/>
                                  {group.schedule.time} ({group.schedule.duration} min)
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-300">{group.facilitator?.name || 'Unknown'}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-300">{group.participantCount || 0} members</div>
                              </td>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => handleJoinGroup(group._id)}
                                  className="text-purple-400 hover:text-purple-300 text-sm"
                                >
                                  Join
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#111] rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Create Support Group</h2>
              <button
                onClick={handleCloseCreateModal}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`w-1/4 text-center text-sm ${
                      step === 1 ? 'text-purple-400' : 'text-gray-500'
                    }`}
                  >
                    {step === 1 && 'Type'}
                    {step === 2 && 'Details'}
                    {step === 3 && 'Topics'}
                    {step === 4 && 'Schedule'}
                  </div>
                ))}
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: '25%' }}
                />
              </div>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-6">
              {/* Step 1: Group Type */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-gray-400 mb-2">Group Type</label>
                  <select
                    value={newGroup.groupType}
                    onChange={(e) => {
                      setNewGroup({
                        ...newGroup,
                        groupType: e.target.value,
                        topics: []
                      });
                    }}
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 text-white"
                    required
                  >
                    {parentGroupTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-2">
                    {parentGroupTypes.find(t => t.id === newGroup.groupType)?.description}
                  </p>
                </div>
              </motion.div>

              {/* Step 2: Group Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-gray-400 mb-2">Group Name</label>
                  <input
                    type="text"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 text-white"
                    placeholder="E.g., Teen Anxiety Support Circle"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Description</label>
                  <textarea
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 text-white"
                    rows="3"
                    placeholder="Describe the purpose and goals of your group..."
                    required
                  />
                </div>
              </motion.div>

              {/* Step 3: Topics */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-gray-400 mb-2">Discussion Topics</label>
                  <p className="text-sm text-gray-500 mb-4">Select topics that will be discussed in your group sessions</p>
                  <div className="grid grid-cols-1 gap-2">
                    {suggestedTopics[newGroup.groupType].map((topic, index) => (
                      <label key={index} className="flex items-center space-x-2 text-gray-300 p-2 hover:bg-[#1a1a1a] rounded-lg">
                        <input
                          type="checkbox"
                          checked={newGroup.topics.includes(topic)}
                          onChange={(e) => {
                            const updatedTopics = e.target.checked
                              ? [...newGroup.topics, topic]
                              : newGroup.topics.filter(t => t !== topic);
                            setNewGroup({ ...newGroup, topics: updatedTopics });
                          }}
                          className="form-checkbox bg-[#1a1a1a] border-gray-800 text-purple-500 rounded"
                        />
                        <span>{topic}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Step 4: Schedule */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-2">Day of Week</label>
                    <select
                      value={newGroup.schedule.dayOfWeek}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewGroup(prev => ({
                          ...prev,
                          schedule: {
                            ...prev.schedule,
                            dayOfWeek: value
                          }
                        }));
                      }}
                      className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 text-white"
                      required
                    >
                      <option value="">Select a day</option>
                      {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                        <option key={index} value={index}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Time</label>
                    <input
                      type="time"
                      value={newGroup.schedule.time || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewGroup(prev => ({
                          ...prev,
                          schedule: {
                            ...prev.schedule,
                            time: value
                          }
                        }));
                      }}
                      className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Session Duration</label>
                  <select
                    value={newGroup.schedule.duration || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewGroup(prev => ({
                        ...prev,
                        schedule: {
                          ...prev.schedule,
                          duration: value
                        }
                      }));
                    }}
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 text-white"
                    required
                  >
                    <option value="">Select duration</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                </div>

                <div className="text-sm text-gray-400 mt-4">
                  <p>Selected Schedule:</p>
                  <p>
                    {newGroup.schedule.dayOfWeek !== '' 
                      ? `${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][newGroup.schedule.dayOfWeek]}, ` 
                      : ''}
                    {newGroup.schedule.time ? `${newGroup.schedule.time}, ` : ''}
                    {newGroup.schedule.duration ? `${newGroup.schedule.duration} minutes` : ''}
                  </p>
                </div>
              </motion.div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  className={`px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 ${
                    true ? 'invisible' : ''
                  }`}
                >
                  Previous
                </button>
                
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  Create Group
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Phone Consultation Modal */}
      <PhoneConsultationModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onSubmit={handleConsultationRequest}
      />

      {/* Video Consultation Modal */}
      <VideoConsultationModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        onSubmit={handleVideoConsultation}
      />
    </div>
  );
};

export default ParentSupport;