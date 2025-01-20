const mongoose = require('mongoose');
const AnonymousChat = require('../models/AnonymousChat');
require('dotenv').config();

async function fixMessageFormat() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const chats = await AnonymousChat.find({});
    console.log(`Found ${chats.length} chats to process`);

    for (const chat of chats) {
      console.log(`Processing chat ${chat._id} with ${chat.encryptedMessages.length} messages`);
      
      const updatedMessages = chat.encryptedMessages.map(msg => {
        // Convert any complex content objects to simple strings
        let content = msg.content;
        if (typeof content === 'object' && content !== null) {
          content = content.content || 'Invalid message format';
        }
        
        return {
          content: content,
          sender: msg.sender,
          timestamp: msg.timestamp
        };
      });
      
      chat.encryptedMessages = updatedMessages;
      await chat.save();
      console.log(`Updated chat ${chat._id}`);
    }

    console.log('Finished fixing message format');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing message format:', error);
    process.exit(1);
  }
}

fixMessageFormat(); 