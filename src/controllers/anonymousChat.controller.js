const AnonymousChat = require('../models/AnonymousChat');
const crypto = require('crypto');
const { emitChatUpdate } = require('../server');
const mongoose = require('mongoose');

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

    emitChatUpdate(req.user.id, 'newChat', chat);

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
    
    // Safely emit to all users in the chat
    if (req.io) {
      req.io.to(chatId).emit('newMessage', {
        chatId,
        message: newMessage
      });
    } else {
      console.warn('Socket.io instance not available');
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

// Get chat messages (counselor only)
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

    // Add authorization check
    if (!chat.counselorId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view messages' 
      });
    }

    // Add try-catch for message decryption
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
    
    // Send appropriate error response
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
    
    // Validate message
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid message format' 
      });
    }
    
    const chat = await AnonymousChat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    // Verify counselor authorization
    if (!chat.counselorId || !chat.counselorId.equals(req.user._id)) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized - only assigned counselor can send messages' 
      });
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
    
    // Safely emit to all users in the chat
    if (req.io) {
      req.io.to(chatId).emit('newMessage', {
        chatId,
        message: newMessage
      });
    } else {
      console.warn('Socket.io instance not available');
    }
    
    res.json({ success: true });
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
    
    emitChatUpdate(req.user.id, 'chatDeleted', chatId);
    if (chat.counselorId) {
      emitChatUpdate(chat.counselorId, 'chatDeleted', chatId);
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