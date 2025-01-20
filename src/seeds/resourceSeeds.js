const mongoose = require('mongoose');
const Resource = require('../models/Resource');
require('dotenv').config();

const resources = [
  {
    title: "Managing Academic Stress",
    description: "Learn effective techniques to handle academic pressure and maintain mental well-being.",
    content: "Academic stress is a common experience...",
    category: "article",
    tags: ["stress", "academic", "self-help"]
  },
  {
    title: "5-Minute Breathing Exercise",
    description: "Quick breathing technique for instant stress relief and focus.",
    content: "Find a quiet place to sit comfortably...",
    category: "exercise",
    tags: ["breathing", "stress-relief", "quick-help"]
  },
  {
    title: "Understanding Anxiety",
    description: "A comprehensive guide to recognizing and managing anxiety symptoms.",
    content: "Anxiety is a natural response to stress...",
    category: "guide",
    tags: ["anxiety", "mental-health", "education"]
  },
  {
    title: "Mindful Meditation Basics",
    description: "Introduction to mindfulness meditation for beginners.",
    content: "Mindfulness meditation is a practice...",
    category: "video",
    tags: ["meditation", "mindfulness", "beginner"]
  }
];

const seedResources = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing resources
    await Resource.deleteMany({});
    console.log('Cleared existing resources');

    // Insert new resources
    await Resource.insertMany(resources);
    console.log('Added new resources');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding resources:', error);
    process.exit(1);
  }
};

seedResources(); 