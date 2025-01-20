const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const checkCounselors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const counselors = await User.find({ role: 'counselor' });
    console.log('\nTotal counselors found:', counselors.length);

    counselors.forEach((counselor, index) => {
      console.log(`\nCounselor ${index + 1}:`);
      console.log('ID:', counselor._id);
      console.log('Name:', counselor.name);
      console.log('Email:', counselor.email);
      console.log('Role:', counselor.role);
      console.log('Specialization:', counselor.specialization);
      console.log('Is Active:', counselor.isActive);
      console.log('Profile:', counselor.profile);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

checkCounselors(); 