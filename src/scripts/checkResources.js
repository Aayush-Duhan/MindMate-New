require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/Resource');

async function checkResources() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check student resources specifically
    console.log('\nChecking student resources:');
    const studentResources = await Resource.find({
      targetAudience: { $in: ['student', 'all'] },
      isActive: true
    }).select('title description category targetAudience');
    
    console.log('\nTotal student resources found:', studentResources.length);
    studentResources.forEach(resource => {
      console.log('\nResource:');
      console.log('Title:', resource.title);
      console.log('Description:', resource.description);
      console.log('Category:', resource.category);
      console.log('Target Audience:', resource.targetAudience);
    });

    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error checking resources:', error);
    process.exit(1);
  }
}

checkResources();
