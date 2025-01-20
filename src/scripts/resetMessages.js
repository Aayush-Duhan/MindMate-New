const mongoose = require('mongoose');
const AnonymousChat = require('../models/AnonymousChat');
require('dotenv').config();

async function resetMessages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const chats = await AnonymousChat.find({});
    console.log(`Found ${chats.length} chats to reset`);

    for (const chat of chats) {
      // Keep only the metadata and basic info
      chat.encryptedMessages = [];
      await chat.save();
      console.log(`Reset chat ${chat._id}`);
    }

    console.log('Finished resetting messages');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting messages:', error);
    process.exit(1);
  }
}

resetMessages(); 