const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const counselors = [
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@mindmate.com',
    password: 'password123', // This will be hashed
    specialization: 'Anxiety & Depression',
    role: 'counselor',
    profile: {
      bio: 'Specializing in anxiety and depression treatment with 10+ years of experience',
      education: 'Ph.D. in Clinical Psychology, Stanford University',
      approach: 'Cognitive Behavioral Therapy (CBT) and Mindfulness-based approaches'
    }
  },
  {
    name: 'Dr. Michael Chen',
    email: 'michael.chen@mindmate.com',
    password: 'password123', // This will be hashed
    specialization: 'Stress Management',
    role: 'counselor',
    profile: {
      bio: 'Expert in stress management and work-life balance',
      education: 'Psy.D. in Clinical Psychology, UCLA',
      approach: 'Solution-Focused Therapy and Stress Reduction Techniques'
    }
  },
  {
    name: 'Dr. Emily Williams',
    email: 'emily.williams@mindmate.com',
    password: 'password123', // This will be hashed
    specialization: 'Mental Wellness',
    role: 'counselor',
    profile: {
      bio: 'Holistic approach to mental wellness and emotional health',
      education: 'Ph.D. in Counseling Psychology, Columbia University',
      approach: 'Integrative Therapy and Positive Psychology'
    }
  },
  {
    name: 'Dr. James Martinez',
    email: 'james.martinez@mindmate.com',
    specialization: 'Youth Counseling',
    profile: {
      bio: 'Dedicated to supporting young adults through life transitions',
      education: 'Ph.D. in Child Psychology, University of Michigan',
      approach: 'Developmental Psychology and Family Systems Therapy'
    }
  }
];

const seedCounselors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing counselors
    const deleteResult = await User.deleteMany({ role: 'counselor' });
    console.log('Cleared existing counselors:', deleteResult);

    // Create new counselors
    for (const counselorData of counselors) {
      try {
        const hashedPassword = await bcrypt.hash(counselorData.password, 10);
        const counselor = new User({
          ...counselorData,
          password: hashedPassword,
          isActive: true,
          isVerified: true
        });

        await counselor.save();
        console.log(`Created counselor: ${counselorData.name}`);
      } catch (error) {
        console.error(`Error creating counselor ${counselorData.name}:`, error);
      }
    }

    console.log('Counselors seeded successfully!');

    // Verify seeded counselors
    const seededCounselors = await User.find({ role: 'counselor' });
    console.log('\nSeeded counselors:', seededCounselors.map(c => ({
      name: c.name,
      email: c.email,
      specialization: c.specialization
    })));

  } catch (error) {
    console.error('Error seeding counselors:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

module.exports = seedCounselors; 