const axios = require('axios');

const analyzeMood = async (answers) => {
  try {
    // Convert answers to a format suitable for analysis
    const userInput = {
      energy: answers[1],
      overwhelm: answers[2],
      thoughts: answers[3],
      sleep: answers[4]
    };

    // Send to Langflow API
    const response = await axios.post('http://localhost:7860/api/v1/process', {
      input: {
        text: JSON.stringify(userInput)
      },
      flow_id: 'your-langflow-id' // Replace with your Langflow flow ID
    });

    // Process the response
    const analysis = response.data;
    
    // Generate recommendations based on the analysis
    const recommendations = generateRecommendations(analysis);

    return {
      mood: analysis.mood,
      sentiment: analysis.sentiment,
      recommendations,
      suggestedActivities: analysis.suggestedActivities
    };
  } catch (error) {
    console.error('Error in mood analysis:', error);
    throw error;
  }
};

const generateRecommendations = (analysis) => {
  // Add your recommendation logic here
  const recommendations = [];
  
  if (analysis.mood === 'stressed') {
    recommendations.push({
      type: 'breathing',
      title: 'Deep Breathing Exercise',
      description: 'Try this 5-minute breathing exercise to reduce stress'
    });
  }
  
  if (analysis.energy < 3) {
    recommendations.push({
      type: 'activity',
      title: 'Energy Boost',
      description: 'Take a short walk or do some light stretching'
    });
  }
  
  return recommendations;
};

module.exports = {
  analyzeMood
}; 