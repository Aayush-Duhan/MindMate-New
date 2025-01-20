const mongoose = require('mongoose');
const AnonymousChat = require('../models/AnonymousChat');
require('dotenv').config();

async function fixChatStatus() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all chats
    const chats = await AnonymousChat.find({});
    console.log(`Found ${chats.length} chats to fix`);

    for (const chat of chats) {
      // Reset status based on counselorId
      if (!chat.counselorId) {
        chat.status = 'unassigned';
      } else if (chat.status === 'unassigned') {
        chat.status = 'active';
      }
      await chat.save();
    }

    console.log('Fixed all chat statuses');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing chat status:', error);
    process.exit(1);
  }
}

fixChatStatus(); 