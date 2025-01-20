import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log('Environment check:', {
      apiKey: process.env.REACT_APP_LANGFLOW_API_KEY ? 'Present' : 'Missing',
      nodeEnv: process.env.NODE_ENV,
      baseUrl: process.env.REACT_APP_API_URL
    });
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    console.log('Sending message:', inputMessage);

    const userMessage = { type: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      console.log('Making API call to Langflow...');
      const response = await fetch(
        `${process.env.REACT_APP_LANGFLOW_URL}/api/v1/run/252d5ec6-cf9d-45e5-8987-6eb6e2a5dd51?stream=false`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_LANGFLOW_API_KEY
          },
          body: JSON.stringify({
            input_value: inputMessage,
            output_type: "chat",
            input_type: "chat",
            tweaks: {
              "ChatInput-n8Uts": {},
              "ChatOutput-NmKcl": {},
              "Memory-kzq7d": {},
              "Prompt-ALQtp": {},
              "GroqModel-qK7IU": {}
            }
          }),
        }
      );

      console.log('Raw response:', response);
      const data = await response.json();
      console.log('Parsed response data:', {
        type: typeof data,
        keys: Object.keys(data),
        fullData: JSON.stringify(data, null, 2)
      });
      
      let botResponse;
      if (data.outputs && data.outputs[0]?.outputs?.[0]?.messages?.[0]?.message) {
        botResponse = data.outputs[0].outputs[0].messages[0].message;
      } else {
        console.log('Unexpected response structure:', data);
        botResponse = 'I received your message but encountered an unexpected response format.';
      }

      const botMessage = { 
        type: 'bot', 
        content: botResponse 
      };
      console.log('Adding bot message:', botMessage);
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Detailed error:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      toast.error('Failed to get response from chatbot');
      const errorMessage = { 
        type: 'bot', 
        content: 'Sorry, I encountered an error. Please try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInputMessage('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 w-96 bg-[#111] border border-gray-800 rounded-2xl shadow-xl"
          >
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-white font-semibold">MindMate Assistant</h2>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="h-96 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-purple-500/20 text-purple-100'
                        : 'bg-gray-800 text-gray-100'
                    }`}
                  >
                    <ReactMarkdown className="prose prose-invert prose-sm">
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 text-gray-100 p-3 rounded-2xl">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t border-gray-800">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="bg-purple-500 text-white p-4 rounded-full shadow-lg hover:bg-purple-600 transition-colors"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default ChatBot; 