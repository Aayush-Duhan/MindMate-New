const mongoose = require('mongoose');
const AnonymousChat = require('../models/AnonymousChat');
require('dotenv').config();

async function reEncryptMessages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const chats = await AnonymousChat.find({});
    console.log(`Found ${chats.length} chats to process`);

    for (const chat of chats) {
      console.log(`Processing chat ${chat._id} with ${chat.encryptedMessages.length} messages`);
      
      const updatedMessages = [];
      
      for (const msg of chat.encryptedMessages) {
        try {
          // Skip if message is already in new format
          if (msg.content.authTag) {
            console.log('Message already in new format, skipping...');
            updatedMessages.push(msg);
            continue;
          }
          
          // Try to decrypt the old format message
          const decryptedContent = chat.decryptMessage(msg.content);
          
          // Re-encrypt with new method
          const newEncrypted = chat.encryptMessage(decryptedContent);
          
          updatedMessages.push({
            content: newEncrypted,
            sender: msg.sender,
            timestamp: msg.timestamp
          });
          console.log('Successfully re-encrypted message');
        } catch (error) {
          console.error(`Failed to process message in chat ${chat._id}:`, error);
          // Keep the original message if we can't process it
          updatedMessages.push(msg);
        }
      }
      
      chat.encryptedMessages = updatedMessages;
      await chat.save();
      console.log(`Updated chat ${chat._id}`);
    }

    console.log('Finished re-encrypting messages');
    process.exit(0);
  } catch (error) {
    console.error('Error re-encrypting messages:', error);
    process.exit(1);
  }
}

reEncryptMessages(); 