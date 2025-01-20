require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/Resource');

const resources = [
  // Academic Resources
  {
    title: "Effective Study Techniques",
    description: "Learn scientifically-proven study methods to improve your academic performance",
    content: "1. Active Recall: Test yourself on what you've learned\n2. Spaced Repetition: Review material at increasing intervals\n3. The Pomodoro Technique: Study in focused 25-minute blocks\n4. Mind Mapping: Create visual connections between concepts\n5. Teaching Others: Explain concepts to reinforce learning",
    url: "https://www.edutopia.org/article/5-research-backed-studying-techniques",
    category: "academic",
    tags: ["academics", "study-skills", "time-management"],
    targetAudience: "student",
    isActive: true
  },
  {
    title: "Time Management for Students",
    description: "Master the art of balancing academics, extracurriculars, and personal life",
    content: "1. Create a weekly schedule\n2. Prioritize tasks using the Eisenhower Matrix\n3. Set SMART goals for each subject\n4. Use digital tools for organization\n5. Schedule regular breaks and self-care time",
    url: "https://www.ox.ac.uk/students/academic/guidance/skills/time",
    category: "academic",
    tags: ["academics", "productivity", "organization"],
    targetAudience: "student",
    isActive: true
  },

  // Mental Health Resources
  {
    title: "Stress Management Techniques",
    description: "Practical strategies to manage academic and personal stress",
    content: "1. Deep breathing exercises\n2. Progressive muscle relaxation\n3. Mindfulness meditation\n4. Regular physical exercise\n5. Healthy sleep habits\n6. Journaling for stress relief",
    url: "https://www.verywellmind.com/tips-to-reduce-stress-3145195",
    category: "mental_health",
    tags: ["mental-health", "stress-management", "self-care"],
    targetAudience: "all",
    isActive: true
  },
  {
    title: "Dealing with Test Anxiety",
    description: "Overcome test anxiety with proven strategies",
    content: "1. Preparation techniques\n2. Relaxation exercises\n3. Positive self-talk\n4. Test-taking strategies\n5. When to seek help",
    url: "https://www.mayoclinic.org/diseases-conditions/anxiety/expert-answers/test-anxiety/faq-20058195",
    category: "mental_health",
    tags: ["mental-health", "anxiety", "academics"],
    targetAudience: "student",
    isActive: true
  },

  // Social Skills Resources
  {
    title: "Building Strong Friendships",
    description: "Tips for developing and maintaining meaningful friendships",
    content: "1. Active listening skills\n2. Showing empathy\n3. Being reliable and trustworthy\n4. Respecting boundaries\n5. Conflict resolution skills",
    url: "https://www.verywellmind.com/how-to-make-friends-in-college-5205775",
    category: "social",
    tags: ["social-skills", "relationships", "communication"],
    targetAudience: "student",
    isActive: true
  },
  {
    title: "Public Speaking Skills",
    description: "Develop confidence in presentations and public speaking",
    content: "1. Preparation techniques\n2. Body language tips\n3. Voice modulation\n4. Handling Q&A sessions\n5. Managing presentation anxiety",
    url: "https://studyepic.com/public-speaking-tips/",
    category: "social",
    tags: ["social-skills", "communication", "leadership"],
    targetAudience: "student",
    isActive: true
  }
];

async function seedResources() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing resources
    console.log('Clearing existing resources...');
    await Resource.deleteMany({});
    console.log('Cleared existing resources');

    // Add new resources one by one
    console.log('Adding new resources...');
    for (const resource of resources) {
      const newResource = new Resource(resource);
      await newResource.save();
      console.log('Added resource:', newResource.title);
    }
    console.log('Finished adding resources');

    // Verify resources were added
    const count = await Resource.countDocuments();
    console.log(`Total resources in database: ${count}`);

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding resources:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedResources();
