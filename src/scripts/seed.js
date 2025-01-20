const mongoose = require('mongoose');
const seedCounselors = require('../seeds/counselorSeed');
require('dotenv').config();

const runSeed = async () => {
  try {
    console.log('Starting seed process...');
    console.log('MongoDB URI:', process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await seedCounselors();
    
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error running seed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

runSeed(); 