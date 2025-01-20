const Chat = require('../models/Chat');

// @desc    Start a new chat
// @route   POST /api/chat
// @access  Private
const startChat = async (req, res) => {
  try {
    const { participantId, isAnonymous } = req.body;

    // Create new chat
    const chat = await Chat.create({
      participants: [req.user._id, participantId],
      isAnonymous
    });

    // Populate participants
    await chat.populate('participants', 'email profile');

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's chats
// @route   GET /api/chat
// @access  Private
const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
      status: 'active'
    })
      .populate('participants', 'email profile')
      .sort({ lastMessage: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get chat messages
// @route   GET /api/chat/:chatId
// @access  Private
const getChatMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('messages.sender', 'email profile')
      .populate('participants', 'email profile');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Format messages to match the socket message format
    const messages = chat.messages.map(msg => {
      console.log('Processing message:', {
        originalSender: msg.sender,
        senderId: msg.sender._id
      });
      
      return {
        _id: msg._id.toString(),
        content: msg.content,
        sender: msg.sender._id.toString(), // Convert ObjectId to string
        timestamp: msg.timestamp
      };
    });

    console.log('Sending formatted messages:', messages);
    res.json(messages);
  } catch (error) {
    console.error('Error in getChatMessages:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  startChat,
  getUserChats,
  getChatMessages
}; 