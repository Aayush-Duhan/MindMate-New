import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  {
    id: 1,
    text: "How would you rate your energy level today?",
    type: "scale",
    options: [
      { value: 1, label: "Very Low", emoji: "😴" },
      { value: 2, label: "Low", emoji: "😪" },
      { value: 3, label: "Moderate", emoji: "😐" },
      { value: 4, label: "High", emoji: "😊" },
      { value: 5, label: "Very High", emoji: "⚡" }
    ]
  },
  {
    id: 2,
    text: "Have you been feeling overwhelmed lately?",
    type: "choice",
    options: [
      { value: "not_at_all", label: "Not at all" },
      { value: "slightly", label: "Slightly" },
      { value: "moderately", label: "Moderately" },
      { value: "very_much", label: "Very much" }
    ]
  },
  {
    id: 3,
    text: "What's been on your mind recently?",
    type: "text",
    placeholder: "Share your thoughts..."
  },
  {
    id: 4,
    text: "How has your sleep been?",
    type: "scale",
    options: [
      { value: 1, label: "Very Poor", emoji: "😫" },
      { value: 2, label: "Poor", emoji: "😕" },
      { value: 3, label: "Fair", emoji: "😐" },
      { value: 4, label: "Good", emoji: "😊" },
      { value: 5, label: "Very Good", emoji: "😴" }
    ]
  }
];

const MoodAssessment = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [textInput, setTextInput] = useState('');

  const handleAnswer = async (answer) => {
    if (questions[currentQuestion].type === 'text' && !answer.trim()) {
      return;
    }

    const newAnswers = { ...answers, [questions[currentQuestion].id]: answer };
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      setIsAnalyzing(true);
      try {
        const formattedData = {
          energy: newAnswers[1],
          overwhelm: newAnswers[2],
          thoughts: newAnswers[3],
          sleep: newAnswers[4]
        };

        const response = await fetch('http://localhost:5000/api/mood/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(formattedData)
        });
        
        const analysis = await response.json();
        onComplete(analysis);
      } catch (error) {
        console.error('Error analyzing mood:', error);
      }
    } else {
      setTextInput('');
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];

    switch (question.type) {
      case 'scale':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center space-x-4">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-[#1a1a1a] transition-colors"
                >
                  <span className="text-3xl mb-2">{option.emoji}</span>
                  <span className="text-sm text-gray-400">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'choice':
        return (
          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className="w-full p-4 text-left rounded-lg border border-gray-800 hover:bg-[#1a1a1a] text-gray-300 transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
        );

      case 'text':
        return (
          <div>
            <textarea
              className="w-full p-4 rounded-lg border resize-none"
              rows="4"
              placeholder={question.placeholder}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => handleAnswer(textInput)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isAnalyzing) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <p className="text-gray-400">Analyzing your responses...</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              {questions[currentQuestion].text}
            </h2>
            <span className="text-sm text-gray-400">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-blue-500 rounded-full h-2 transition-all duration-300"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>
        {renderQuestion()}
      </motion.div>
    </AnimatePresence>
  );
};

export default MoodAssessment; 