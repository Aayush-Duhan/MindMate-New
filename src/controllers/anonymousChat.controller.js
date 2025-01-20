const AnonymousChat = require('../models/AnonymousChat');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { broadcastToRoom } = require('../utils/socketUtils');

// Socket event emitter helper
const emitChatUpdate = (io, userId, event, data) => {
  if (!io) {
    console.warn('Socket.io instance not available');
    return;
  }
  io.to(userId).emit(event, data);
};

// Create new anonymous chat session
const createAnonymousChat = async (req, res) => {
  try {
    const { category } = req.body;  
    const chat = await AnonymousChat.create({
      anonymousId: req.user.id,
      category,
      metadata: {
        lastActivity: new Date(),
        totalMessages: 0,
        isEmergency: false
      }
    });

    if (req.io) {
      emitChatUpdate(req.io, req.user.id, 'newChat', chat);
    }

    res.status(201).json({
      success: true,
      chatId: chat._id
    });
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating anonymous chat',
      error: error.message
    });
  }
};

// Send message in anonymous chat
const sendAnonymousMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;
      
    const chat = await AnonymousChat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    const newMessage = {
      content: message,
      sender: 'anonymous',
      timestamp: new Date()
    };
    
    chat.encryptedMessages.push(newMessage);
    chat.metadata.lastActivity = new Date();
    chat.metadata.totalMessages += 1;
    
    await chat.save();

    // Broadcast to room
    broadcastToRoom(chatId, 'newMessage', {
      chatId,
      message: newMessage
    });
    
    res.json({ 
      success: true,
      message: newMessage 
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

// Get chat messages
const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    
    // Add validation for chatId
    if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid chat ID' 
      });
    }

    const chat = await AnonymousChat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ 
        success: false, 
        message: 'Chat not found' 
      });
    }

    // Modified authorization check to allow both counselor and chat owner
    if (chat.anonymousId !== req.user.id && // Chat owner
        (!chat.counselorId || !chat.counselorId.equals(req.user._id)) && // Assigned counselor
        req.user.role !== 'admin') { // Admin
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view messages' 
      });
    }

    // Return messages
    const messages = chat.encryptedMessages.map(msg => {
      try {
        return {
          content: msg.content,
          sender: msg.sender,
          timestamp: msg.timestamp
        };
      } catch (error) {
        console.error('Message decryption error:', error);
        return {
          error: true,
          sender: msg.sender,
          timestamp: msg.timestamp
        };
      }
    });

    res.json({
      success: true,
      messages,
      chatStatus: chat.status
    });
  } catch (error) {
    console.error('Error in getChatMessages:', {
      error: error.message,
      stack: error.stack,
      chatId: req.params.chatId,
      user: req.user,
      headers: req.headers
    });
    
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
};

// Assign counselor to chat
const assignCounselor = async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const chat = await AnonymousChat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    chat.counselorId = req.user._id;
    await chat.save();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error assigning counselor',
      error: error.message
    });
  }
};

// Get active chats (counselor only)
const getActiveChats = async (req, res) => {
  try {
    // Modified query to show all unassigned chats and chats assigned to this counselor
    const chats = await AnonymousChat.find({
      status: { $in: ['unassigned', 'active'] },
      $or: [
        { counselorId: { $exists: false } },
        { counselorId: null },
        { counselorId: req.user._id }
      ]
    }).sort({ 'metadata.lastActivity': -1 });

    res.json({
      success: true,
      chats
    });
  } catch (error) {
    console.error('Error in getActiveChats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active chats',
      error: error.message
    });
  }
};

// Send counselor message
const sendCounselorMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;
    
    const chat = await AnonymousChat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    const newMessage = {
      content: message,
      sender: 'counselor',
      timestamp: new Date()
    };
    
    chat.encryptedMessages.push(newMessage);
    chat.metadata.lastActivity = new Date();
    chat.metadata.totalMessages += 1;
    
    await chat.save();

    // Broadcast to room
    broadcastToRoom(chatId, 'newMessage', {
      chatId,
      message: newMessage
    });
    
    res.json({ 
      success: true,
      message: newMessage 
    });
  } catch (error) {
    console.error('Send counselor message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const executeWithRetry = async (operation, retries = MAX_RETRIES) => {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0 && (error.name === 'MongooseError' || error.name === 'MongoError')) {
      console.log(`Retrying operation. Attempts remaining: ${retries - 1}`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return executeWithRetry(operation, retries - 1);
    }
    throw error;
  }
};

const validateAnonymousAccess = async (req, res, next) => {
  try {
    await executeWithRetry(async () => {
      const anonymousId = req.headers['x-anonymous-id'];
      const chatId = req.params.chatId;

      if (chatId) {
        const chat = await AnonymousChat.findById(chatId);

        if (!chat) {
          return res.status(404).json({ message: 'Chat not found' });
        }

        if (chat.anonymousId !== anonymousId) {
          return res.status(403).json({ message: 'Not authorized' });
        }
      }
    });

    next();
  } catch (error) {
    console.error('Anonymous auth error:', error);
    res.status(500).json({ message: 'Error validating access', error: error.message });
  }
};

// Get user's previous chats
const getMyChats = async (req, res) => {
  try {
    const chats = await AnonymousChat.find({ 
      anonymousId: req.user.id,
      status: { $in: ['unassigned', 'active'] }
    })
    .select('category status metadata.lastActivity updatedAt')
    .sort({ 'metadata.lastActivity': -1 });

    res.json({
      success: true,
      chats
    });
  } catch (error) {
    console.error('Error fetching user chats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chats',
      error: error.message
    });
  }
};

// Close/Delete chat
const closeChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const chat = await AnonymousChat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ 
        success: false, 
        message: 'Chat not found' 
      });
    }
    
    // Verify user owns this chat
    if (chat.anonymousId !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }
    
    await AnonymousChat.findByIdAndDelete(chatId);
    
    if (req.io) {
      emitChatUpdate(req.io, req.user.id, 'chatDeleted', chatId);
      if (chat.counselorId) {
        emitChatUpdate(req.io, chat.counselorId, 'chatDeleted', chatId);
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Chat closed successfully' 
    });
  } catch (error) {
    console.error('Error closing chat:', error);
    res.status(500).json({
      success: false,
      message: 'Error closing chat',
      error: error.message
    });
  }
};

module.exports = {
  createAnonymousChat,
  sendAnonymousMessage,
  getChatMessages,
  assignCounselor,
  getActiveChats,
  sendCounselorMessage,
  getMyChats,
  closeChat
}; 