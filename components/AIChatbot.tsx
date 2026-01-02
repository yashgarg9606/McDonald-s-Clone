'use client';

import { useState, useRef, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  type: 'user' | 'bot';
  text: string;
  products?: any[];
  suggestions?: any[];
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      text: "Hi! I'm your AI ordering assistant. How can I help you today? You can ask me to suggest meals by budget, preferences, or browse by category.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { type: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/ai/chatbot', { message: input });
      const botMessage: Message = {
        type: 'bot',
        text: response.data.text,
        products: response.data.products,
        suggestions: response.data.suggestions,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      toast.error('Failed to get response. Please try again.');
      setMessages((prev) => [
        ...prev,
        { type: 'bot', text: 'Sorry, I encountered an error. Please try rephrasing your question.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    if (suggestion.text) {
      setInput(suggestion.text);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Open AI Chatbot"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="relative">
          {/* Pulsing ring animation */}
          {!isOpen && (
            <motion.div
              className="absolute inset-0 bg-mcdonalds-yellow rounded-full opacity-75"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.75, 0, 0.75],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
          
          {/* Main button */}
          <div className="relative bg-gradient-to-br from-mcdonalds-red to-mcdonalds-dark-red text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center border-4 border-white dark:border-gray-800 group-hover:shadow-mcdonalds-red/50 transition-all duration-300">
            {/* Icon */}
            <motion.div
              animate={isOpen ? { rotate: 90, scale: 1.2 } : { rotate: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center"
            >
              {isOpen ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-7 h-7"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  <path d="M9 10h.01M15 10h.01"></path>
                </svg>
              )}
            </motion.div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          {/* Notification badge (optional - can be used for unread messages) */}
          {!isOpen && (
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-mcdonalds-yellow rounded-full border-2 border-white dark:border-gray-800"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-mcdonalds-red text-white p-4 rounded-t-lg">
              <h3 className="font-bold text-lg">AI Ordering Assistant</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-mcdonalds-red text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p>{message.text}</p>

                    {/* Products */}
                    {message.products && message.products.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.products.map((product: any) => (
                          <div
                            key={product._id}
                            className="bg-white dark:bg-gray-600 rounded p-2 text-sm"
                          >
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-mcdonalds-red">₹{product.price}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.suggestions.map((suggestion: any, sidx: number) => (
                          <button
                            key={sidx}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left text-sm bg-white/20 hover:bg-white/30 rounded p-2 mt-1"
                          >
                            {suggestion.text || 'View order'}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3">
                    <p>Thinking...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-300 dark:border-gray-600">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-mcdonalds-red bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={loading}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="bg-mcdonalds-red text-white px-4 py-2 rounded-lg hover:bg-mcdonalds-dark-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

