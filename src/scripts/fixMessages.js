const mongoose = require('mongoose');
const AnonymousChat = require('../models/AnonymousChat');
require('dotenv').config();

async function fixMessages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const chats = await AnonymousChat.find({});
    console.log(`Found ${chats.length} chats to check`);

    for (const chat of chats) {
      let fixed = false;
      const validMessages = chat.encryptedMessages.filter(msg => {
        const isValid = msg.content && msg.content.iv && msg.content.encryptedData;
        if (!isValid) {
          fixed = true;
          console.log(`Found invalid message in chat ${chat._id}`);
        }
        return isValid;
      });

      if (fixed) {
        chat.encryptedMessages = validMessages;
        await chat.save();
        console.log(`Fixed chat ${chat._id}`);
      }
    }

    console.log('Finished fixing messages');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing messages:', error);
    process.exit(1);
  }
}

fixMessages(); 