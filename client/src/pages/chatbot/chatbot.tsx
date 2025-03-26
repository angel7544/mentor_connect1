import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiCopy, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const OLLAMA_API_BASE_URL = 'http://localhost:11434/api';

interface ChatMessage {
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}


const formatBotResponse = (text: string): string => {
  return text
    // Convert main titles (**### Title**) to proper bold H3
    .replace(/\*\*###\s+(.*?)\*\*/g, '### **$1**')

    // Convert extra-spaced headers (like **### ## Title**) to proper H3
    .replace(/\*\*###\s+##\s+(.*?)\*\*/g, '### **$1**')

    // Ensure proper paragraph spacing (convert single newline to double)
    .replace(/([^\n])\n([^\n])/g, '$1\n\n$2')

    // Remove excessive newlines (keep max two)
    .replace(/\n{3,}/g, '\n\n')

    .trim();
};


const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const generateResponse = async () => {
    if (!message.trim()) return;
    
    const userMessage: ChatMessage = {
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${OLLAMA_API_BASE_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'llama3.2', prompt: message, stream: false }),
      });
      const data = await res.json();
      
      const botMessage: ChatMessage = {
        type: 'bot',
        content: formatBotResponse(data.response) || 'No response',
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        type: 'bot',
        content: 'Error connecting to Ollama API',
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }
    setLoading(false);
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="bg-blue-600 p-4 text-white"
        >
          <h2 className="text-xl font-bold text-center">MentorConnectAI</h2>
        </motion.div>

        {/* Chat Container - Only this should scroll */}
        <div 
          ref={chatContainerRef}
          className="h-[60vh] overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        >
          <AnimatePresence>
            {chatHistory.map((chat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: chat.type === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    chat.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <p className={`text-sm whitespace-pre-wrap ${chat.type === 'user' ? 'text-white' : 'text-gray-800'}`}>
                      {chat.content}
                    </p>
                    {chat.type === 'bot' && (
                      // Fix for the copy button icons
                      <button
                        onClick={() => copyToClipboard(chat.content, index)}
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        {copiedIndex === index ? FiCheck({ size: 16 }) : FiCopy({ size: 16 })}
                      </button>
                    )}
                  </div>
                  <div className={`text-xs mt-2 ${chat.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {formatTime(chat.timestamp)}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Loading Animation */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex justify-start"
              >
                <motion.div className="bg-white shadow-md rounded-2xl p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200" />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <motion.div 
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="p-4 bg-white border-t"
        >
          <div className="flex space-x-2">
            <motion.textarea
              whileFocus={{ scale: 1.01 }}
              className="flex-1 p-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32"
              rows={1}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  generateResponse();
                }
              }}
              placeholder="Type your message here..."
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-xl flex items-center justify-center transition-colors ${
                loading || !message.trim()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              onClick={generateResponse}
              disabled={loading || !message.trim()}
            >
              {FiSend({ size: 20 })}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Chatbot;