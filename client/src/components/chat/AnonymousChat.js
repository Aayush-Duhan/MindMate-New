import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

// Toast Component
const Toast = ({ message, type = 'warning', onClose, action }) => {
  const getToastStyles = () => {
    switch (type) {
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-500/10';
      case 'success':
        return 'border-green-500/20 bg-green-500/10';
      case 'error':
        return 'border-red-500/20 bg-red-500/10';
      default:
        return 'border-gray-500/20 bg-gray-500/10';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'warning':
        return 'text-yellow-400';
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div 
        className={`relative flex flex-col items-center p-6 ${getToastStyles()} rounded-2xl shadow-2xl min-w-[320px] border`}
      >
        <XCircleIcon className={`w-8 h-8 ${getIconColor()} mb-3`} />
        <p className="text-white text-center mb-6">{message}</p>
        {action ? (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                action();
                onClose();
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </motion.div>
  );
};

const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

const AnonymousChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [category, setCategory] = useState('');
  const [previousChats, setPreviousChats] = useState([]);
  const [toast, setToast] = useState(null);
  const messagesEndRef = useRef(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const socketRef = useRef(null);

  const categories = [
    { id: 'mental_health', label: 'Mental Health' },
    { id: 'academic', label: 'Academic' },
    { id: 'personal', label: 'Personal' },
    { id: 'social', label: 'Social' },
    { id: 'other', label: 'Other' }
  ];

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize single socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setSocket(newSocket);
      socketRef.current = newSocket;
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  // Message handler with useCallback at component level
  const handleNewMessage = useCallback((data) => {
    if (data.chatId === chatId) {
      setMessages(prevMessages => {
        // Check if message already exists
        const messageExists = prevMessages.some(
          msg => 
            msg.content === data.message.content && 
            msg.timestamp === data.message.timestamp
        );
        
        if (messageExists) return prevMessages;
        return [...prevMessages, data.message];
      });
    }
  }, [chatId]);

  // Handle chat room and messages with optimized socket handling
  useEffect(() => {
    if (!socket || !chatId) return;

    console.log('Setting up chat room:', chatId);
    
    // Join chat room
    socket.emit('joinChat', chatId);

    // Message handler
    socket.on('newMessage', handleNewMessage);

    // Cleanup
    return () => {
      console.log('Leaving chat room:', chatId);
      socket.off('newMessage', handleNewMessage);
      socket.emit('leaveChat', chatId);
    };
  }, [socket, chatId, handleNewMessage]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !chatId) return;

    const messageText = inputMessage.trim();
    setInputMessage('');

    try {
      // Send message to server
      const response = await fetch(`http://localhost:5000/api/anonymous-chat/${chatId}/message`, {
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

      // After successful save, emit through socket
      socket.emit('sendMessage', {
        chatId,
        message: data.message
      });

    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      setInputMessage(messageText); // Restore message on error
    }
  };

  const startNewChat = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/anonymous-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ category })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create chat');
      }

      const newChatId = data.chatId;
      setChatId(newChatId);
      setMessages([]); // Clear messages for new chat
      await fetchChatMessages(newChatId);

    } catch (error) {
      console.error('Error starting chat:', error);
      setError('Failed to start chat. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Auto scroll on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchPreviousChats = async (retryCount = 3, delay = 1000) => {
    try {
      const response = await fetch('http://localhost:5000/api/anonymous-chat/my-chats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        if (response.status === 429) { // Too Many Requests
          if (retryCount > 0) {
            console.log(`Rate limited. Retrying in ${delay}ms... (${retryCount} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchPreviousChats(retryCount - 1, delay * 2);
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setPreviousChats(data.chats || []);
      } else {
        throw new Error(data.message || 'Failed to fetch chats');
      }
    } catch (error) {
      console.error('\n Error fetching previous chats:', error);
      setError('Failed to load previous chats. Please try again later.');
    }
  };

  const debouncedFetchChats = useDebounce(fetchPreviousChats, 1000);

  useEffect(() => {
    debouncedFetchChats();
  }, []);

  const fetchChatMessages = useCallback(async (chatId) => {
    try {
      setLoadingMessages(true);
      const response = await fetch(`http://localhost:5000/api/anonymous-chat/${chatId}/messages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setMessages(data.messages);
      } else {
        console.error('Failed to fetch messages:', data);
        setError('Failed to load chat messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load chat messages');
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const closeChat = async (chatIdToClose) => {
    try {
      setToast({
        message: 'Closing chat...',
        type: 'warning'
      });

      const response = await fetch(`http://localhost:5000/api/anonymous-chat/${chatIdToClose}/close`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        setPreviousChats(prev => prev.filter(chat => chat._id !== chatIdToClose));
        if (chatId === chatIdToClose) {
          setChatId(null);
          setCategory('');
          setMessages([]);
          socket?.disconnect();
          setSocket(null);
        }
        setToast({
          message: 'Chat closed successfully',
          type: 'success'
        });
        // Clear toast after 3 seconds
        setTimeout(() => setToast(null), 3000);
      } else {
        console.error('Failed to close chat:', data);
        setError('Failed to close chat');
        setToast({
          message: 'Failed to close chat',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error closing chat:', error);
      setError('Failed to close chat');
    }
  };

  const handleApiError = (error, response) => {
    if (response?.status === 429) {
      setError('Too many requests. Please wait a moment before trying again.');
      return;
    }
    
    if (response?.status === 401) {
      // Handle unauthorized - maybe redirect to login
      window.location.href = '/login';
      return;
    }
    
    setError('An error occurred. Please try again later.');
    console.error('API Error:', error);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#050505]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
            <ArrowPathIcon className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
          <p className="text-gray-400">Setting up your chat...</p>
        </div>
      </div>
    );
  }

  if (!chatId) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-[#050505] py-8 px-4"
      >
        <AnimatePresence>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
              action={toast.action}
            />
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto flex gap-6">
          {/* Chats Sidebar */}
          <motion.div
            variants={itemVariants}
            className="w-80 bg-[#111111] rounded-2xl shadow-xl border border-gray-800 h-[calc(100vh-8rem)] flex flex-col"
          >
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white">Your Chats</h3>
              <p className="text-sm text-gray-400">Recent conversations</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {previousChats.map((chat) => (
                <motion.button
                  key={chat._id}
                  onClick={async () => {
                    setChatId(chat._id);
                    setCategory(chat.category);
                    await fetchChatMessages(chat._id);
                  }}
                  whileHover={{ scale: 1.02 }}
                  className="w-full p-3 rounded-xl border text-left transition-all group bg-[#1a1a1a] border-gray-800 hover:border-purple-500/30"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-white group-hover:text-purple-400">
                        {chat.category.replace('_', ' ').charAt(0).toUpperCase() + chat.category.slice(1)}
                      </h4>
                      <p className="text-sm text-gray-400">
                        Last active: {new Date(chat.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      chat.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {chat.status}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Start New Chat Area */}
          <motion.div
            variants={itemVariants}
            className="flex-1 bg-[#111111] rounded-2xl shadow-xl border border-gray-800 p-8"
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Start New Chat</h2>
                <p className="text-gray-400">Choose a category to begin</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => {
                    setCategory(cat.id);
                    startNewChat();
                  }}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-[#1a1a1a] rounded-xl border border-gray-800 hover:border-purple-500/30 text-left transition-all group"
                >
                  <h3 className="text-lg font-semibold text-white group-hover:text-purple-400">
                    {cat.label}
                  </h3>
                </motion.button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <div className="flex items-center space-x-3">
                <ShieldCheckIcon className="w-5 h-5 text-blue-400" />
                <p className="text-sm text-gray-400">
                  Your privacy is our priority. All chats are anonymous and encrypted.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#050505] py-8 px-4"
    >
      {/* Toast Container */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
            action={toast.action}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto flex gap-6">
        {/* Chats Sidebar */}
        <motion.div
          variants={itemVariants}
          className="w-80 bg-[#111111] rounded-2xl shadow-xl border border-gray-800 h-[calc(100vh-8rem)] flex flex-col"
        >
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-lg font-semibold text-white">Your Chats</h3>
            <p className="text-sm text-gray-400">Recent conversations</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {previousChats.map((chat) => (
              <motion.button
                key={chat._id}
                onClick={async () => {
                  setChatId(chat._id);
                  setCategory(chat.category);
                  await fetchChatMessages(chat._id);
                }}
                whileHover={{ scale: 1.02 }}
                className={`w-full p-3 rounded-xl border text-left transition-all group
                  ${chat._id === chatId 
                    ? 'bg-purple-500/10 border-purple-500/50' 
                    : 'bg-[#1a1a1a] border-gray-800 hover:border-purple-500/30'}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className={`font-medium ${
                      chat._id === chatId ? 'text-purple-400' : 'text-white group-hover:text-purple-400'
                    }`}>
                      {chat.category.replace('_', ' ').charAt(0).toUpperCase() + chat.category.slice(1)}
                    </h4>
                    <p className="text-sm text-gray-400">
                      Last active: {new Date(chat.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      chat.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {chat.status}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Chat Area */}
        <motion.div
          variants={itemVariants}
          className="flex-1 bg-[#111111] rounded-2xl shadow-xl border border-gray-800 flex flex-col h-[calc(100vh-8rem)]"
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Anonymous Chat</h3>
                  <p className="text-sm text-gray-400 capitalize">Category: {category}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {error && (
                  <div className="flex items-center space-x-2 text-red-400">
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
                <button
                  onClick={() => {
                    setToast({
                      message: 'Are you sure you want to close this chat? This action cannot be undone.',
                      type: 'warning',
                      action: () => closeChat(chatId)
                    });
                  }}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all flex items-center space-x-2 border border-red-500/20 hover:border-red-500/30"
                >
                  <span className="text-sm font-medium">Close Chat</span>
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {loadingMessages ? (
              <div className="flex justify-center">
                <ArrowPathIcon className="w-6 h-6 text-purple-400 animate-spin" />
              </div>
            ) : (
              messages.map((msg, index) => (
                <motion.div
                  key={`${msg.timestamp}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'anonymous' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    msg.sender === 'anonymous'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : 'bg-[#1a1a1a] text-gray-200 border border-gray-800'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form 
            onSubmit={handleSendMessage} 
            className="p-4 border-t border-gray-800 bg-[#0a0a0a]"
          >
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
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnonymousChat;