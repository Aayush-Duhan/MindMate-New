import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import { handleTokenExpiration } from '../../utils/auth';
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const CounselorChat = () => {
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const [assigning, setAssigning] = useState(false);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchActiveChats();
    const interval = setInterval(fetchActiveChats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchActiveChats = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/anonymous-chat/active', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          const newToken = await handleTokenExpiration(new Error('jwt expired'));
          if (newToken) {
            return fetchActiveChats();
          }
        }
        throw new Error('Failed to fetch chats');
      }

      const data = await response.json();
      if (data.success) {
        // Sort chats to show assigned chats first
        const sortedChats = (data.chats || []).sort((a, b) => {
          // First priority: counselor's own chats
          if (a.counselorId === localStorage.getItem('userId') && !b.counselorId) return -1;
          if (!a.counselorId && b.counselorId === localStorage.getItem('userId')) return 1;
          // Second priority: unassigned chats
          if (!a.counselorId && b.counselorId) return -1;
          if (a.counselorId && !b.counselorId) return 1;
          // Finally, sort by last activity
          return new Date(b.lastActivity) - new Date(a.lastActivity);
        });
        setActiveChats(sortedChats);
      }
    } catch (error) {
      console.error('Error fetching active chats:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectChat = async (chat) => {
    try {
      setSelectedChat(chat);
      await fetchMessages(chat._id);
    } catch (error) {
      console.error('Error selecting chat:', error);
      setError(error.message);
    }
  };

  const fetchMessages = async (chatId, retryCount = 3) => {
    try {
      const response = await fetch(`http://localhost:5000/api/anonymous-chat/${chatId}/messages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        // Filter out any messages that failed to decrypt
        const validMessages = data.messages.filter(msg => !msg.error);
        setMessages(validMessages);
        setActiveChats(prev => prev.map(chat => 
          chat._id === chatId 
            ? { ...chat, status: data.chatStatus }
            : chat
        ));
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        throw new Error(data.message || 'Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      
      // Retry logic
      if (retryCount > 0 && error.message.includes('ECONNRESET')) {
        console.log(`Retrying fetch messages... (${retryCount} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        return fetchMessages(chatId, retryCount - 1);
      }
      
      setError(error.message);
      
      // Check if token expired
      if (error.message.includes('401') || error.message.includes('403')) {
        // Handle token expiration
        const refreshed = await handleTokenExpiration();
        if (refreshed) {
          return fetchMessages(chatId, 1); // Try one more time with new token
        }
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedChat?._id) return;

    const messageText = inputMessage.trim();
    setInputMessage('');

    try {
      const response = await fetch(`http://localhost:5000/api/anonymous-chat/${selectedChat._id}/counselor-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message: messageText })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to send message');
      }

      // Remove immediate local state update
      // Let socket event handle the message update

    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message || 'Failed to send message. Please try again.');
      setInputMessage(messageText); // Restore message on error
    }
  };

  const handleAssignChat = async (chat) => {
    try {
      setAssigning(true);
      const response = await fetch(`http://localhost:5000/api/anonymous-chat/${chat._id}/assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to assign chat');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to assign chat');
      }

      // Update local state with the assigned chat
      setActiveChats(prev => prev.map(c => 
        c._id === chat._id 
          ? { ...c, status: 'active', counselorId: localStorage.getItem('userId') }
          : c
      ));

      // Update selected chat
      setSelectedChat(prev => ({
        ...prev,
        status: 'active',
        counselorId: localStorage.getItem('userId')
      }));

      // Fetch messages after assignment
      await fetchMessages(chat._id);
    } catch (error) {
      console.error('Error assigning chat:', error);
      setError(error.message);
    } finally {
      setAssigning(false);
    }
  };

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newSocket = io('http://localhost:5000', {
      auth: { token },
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setSocket(newSocket);
      
      // Join active chat room if exists
      if (selectedChat?._id) {
        console.log('Joining chat room:', selectedChat._id);
        newSocket.emit('joinChat', selectedChat._id);
      }
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      if (newSocket) {
        if (selectedChat?._id) {
          newSocket.emit('leaveChat', selectedChat._id);
        }
        newSocket.disconnect();
      }
    };
  }, []);

  // Handle chat room and messages
  useEffect(() => {
    if (!socket || !selectedChat?._id) return;

    // Join new chat room
    console.log('Joining chat room:', selectedChat._id);
    socket.emit('joinChat', selectedChat._id);

    // Listen for new messages
    const handleNewMessage = (data) => {
      console.log('New message received:', data);
      if (data.chatId === selectedChat._id) {
        setMessages(prevMessages => {
          // Prevent duplicates
          const isDuplicate = prevMessages.some(msg => 
            msg.content === data.message.content && 
            new Date(msg.timestamp).getTime() === new Date(data.message.timestamp).getTime()
          );
          
          if (!isDuplicate) {
            return [...prevMessages, data.message];
          }
          return prevMessages;
        });
      }
    };

    socket.on('newMessage', handleNewMessage);

    // Cleanup
    return () => {
      console.log('Leaving chat room:', selectedChat._id);
      socket.off('newMessage', handleNewMessage);
      socket.emit('leaveChat', selectedChat._id);
    };
  }, [socket, selectedChat]);

  useEffect(() => {
    console.log('Selected chat:', selectedChat);
    console.log('User token:', localStorage.getItem('token'));
    console.log('Socket connected:', socket?.connected);
  }, [selectedChat, socket]);

  // Add token expiration handler
  const handleTokenExpiration = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: localStorage.getItem('token')
        })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  };

  if (loading && !activeChats.length) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#050505]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
            <ArrowPathIcon className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
          <p className="text-gray-400">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#050505] py-8"
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          variants={itemVariants} 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-4rem)]"
        >
          {/* Chat List - Scrollable */}
          <div className="bg-[#111111] rounded-2xl shadow-xl border border-gray-800 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Active Chats</h2>
                  <p className="text-sm text-gray-400">{activeChats.length} ongoing sessions</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {activeChats.map((chat) => (
                <motion.button
                  key={chat._id}
                  onClick={() => selectChat(chat)}
                  whileHover={{ scale: 1.02 }}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    selectedChat?._id === chat._id
                      ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30'
                      : 'hover:bg-[#1a1a1a] border border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-medium ${
                      selectedChat?._id === chat._id ? 'text-purple-400' : 'text-gray-300'
                    }`}>
                      Case #{chat._id.slice(-4)}
                    </span>
                    <div className="flex items-center space-x-2">
                      {chat.counselorId === localStorage.getItem('userId') && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                          Assigned to you
                        </span>
                      )}
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 capitalize">
                        {chat.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-400 space-x-2">
                    <ClockIcon className="w-4 h-4" />
                    <span>Last active: {new Date(chat.lastMessage).toLocaleString()}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="md:col-span-3 bg-[#111111] rounded-2xl shadow-xl border border-gray-800 flex flex-col overflow-hidden">
            {selectedChat ? (
              <>
                {/* Chat Header - Fixed at top */}
                <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-purple-500/10 to-blue-500/10 flex-shrink-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                        <UserGroupIcon className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          Case #{selectedChat._id.slice(-4)}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Category: {selectedChat.category}
                        </p>
                      </div>
                    </div>
                    {(!selectedChat.counselorId || selectedChat.status === 'unassigned') && (
                      <button
                        onClick={() => handleAssignChat(selectedChat)}
                        disabled={assigning}
                        className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center space-x-2"
                      >
                        <ShieldCheckIcon className="w-5 h-5" />
                        <span>Take Case</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent min-h-0">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender === 'counselor' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        msg.sender === 'counselor'
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                          : 'bg-[#1a1a1a] text-gray-200 border border-gray-800'
                      }`}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input - Fixed at bottom */}
                <div className="p-4 border-t border-gray-800 bg-[#0a0a0a] flex-shrink-0">
                  <form onSubmit={handleSendMessage}>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={!inputMessage.trim()}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg p-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        <PaperAirplaneIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-8 h-8 text-purple-400" />
                </div>
                <p>Select a chat to start messaging</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CounselorChat; 