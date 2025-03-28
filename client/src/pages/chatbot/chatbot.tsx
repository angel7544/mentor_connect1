import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OLLAMA_API_BASE_URL = 'http://localhost:11434/api';

// Add a proxy URL for development
const PROXY_URL = 'http://localhost:3000/api/proxy'; // This will be our proxy endpoint

interface ChatMessage {
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  category?: string;
  reactions?: { [key: string]: number };
  attachments?: { name: string; url: string }[];
}

interface QuickAction {
  label: string;
  prompt: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Career Advice', prompt: 'Can you give me advice about my career path?' },
  { label: 'Technical Help', prompt: 'I need help with a technical problem.' },
  { label: 'Study Tips', prompt: 'What are some effective study techniques?' },
  { label: 'Interview Prep', prompt: 'How can I prepare for technical interviews?' }
];

const CATEGORIES = ['Career', 'Technical', 'Academic', 'Personal'] as const;

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

const Chatbot: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Add welcome message
    if (chatHistory.length === 0) {
      const welcomeMessage: ChatMessage = {
        type: 'bot',
        content: 'Hello! I\'m your AI mentor. How can I help you today?',
        timestamp: new Date()
      };
      setChatHistory([welcomeMessage]);
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, typingIndicator]);

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
    setTypingIndicator(true);

    try {
      // First try direct connection
      try {
        const res = await fetch(`${OLLAMA_API_BASE_URL}/generate`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ 
            model: 'llama3.2',
            prompt: message,
            stream: false 
          }),
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Direct API Response:', data);
        
        if (!data.response) {
          throw new Error('No response from model');
        }
        
        const botMessage: ChatMessage = {
          type: 'bot',
          content: formatBotResponse(data.response) || 'No response',
          timestamp: new Date(),
          category: selectedCategory || undefined
        };
        
        setChatHistory(prev => [...prev, botMessage]);
      } catch (directError) {
        console.log('Direct connection failed, trying proxy:', directError);
        
        // If direct connection fails, try through proxy
        const proxyRes = await fetch(PROXY_URL, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ 
            url: `${OLLAMA_API_BASE_URL}/generate`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              model: 'llama3.2',
              prompt: message,
              stream: false 
            })
          }),
        });
        
        if (!proxyRes.ok) {
          throw new Error(`Proxy error! status: ${proxyRes.status}`);
        }
        
        const proxyData = await proxyRes.json();
        console.log('Proxy API Response:', proxyData);
        
        if (!proxyData.response) {
          throw new Error('No response from model through proxy');
        }
        
        const botMessage: ChatMessage = {
          type: 'bot',
          content: formatBotResponse(proxyData.response) || 'No response',
          timestamp: new Date(),
          category: selectedCategory || undefined
        };
        
        setChatHistory(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: ChatMessage = {
        type: 'bot',
        content: `I apologize, but I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setTypingIndicator(false);
    }
  };

  const handleQuickAction = (prompt: string) => {
    setMessage(prompt);
    // Add a small delay to ensure the message is set before sending
    setTimeout(() => {
      generateResponse();
    }, 100);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Handle file upload logic here
      const file = files[0];
      const userMessage: ChatMessage = {
        type: 'user',
        content: `[Attached file: ${file.name}]`,
        timestamp: new Date(),
        attachments: [{ name: file.name, url: URL.createObjectURL(file) }]
      };
      setChatHistory(prev => [...prev, userMessage]);
    }
  };

  const addReaction = (messageIndex: number, reaction: string) => {
    setChatHistory(prev => {
      const newHistory = [...prev];
      const message = { ...newHistory[messageIndex] };
      
      // Initialize reactions object if it doesn't exist
      if (!message.reactions) {
        message.reactions = {};
      }
      
      // Toggle reaction count
      if (message.reactions[reaction]) {
        message.reactions[reaction]--;
        // Remove reaction if count reaches 0
        if (message.reactions[reaction] === 0) {
          delete message.reactions[reaction];
        }
      } else {
        message.reactions[reaction] = 1;
      }
      
      newHistory[messageIndex] = message;

      // Add AI feedback message
      const feedbackMessage: ChatMessage = {
        type: 'bot',
        content: reaction === '👍' 
          ? "Thank you for your positive feedback! I'm glad I could help. Is there anything else you'd like to know?"
          : "I'm sorry if my response wasn't helpful. Could you please let me know what specific aspects you'd like me to clarify or improve?",
        timestamp: new Date()
      };
      newHistory.push(feedbackMessage);
      
      return newHistory;
    });
  };

  const filteredMessages = chatHistory.filter(msg => {
    const matchesSearch = msg.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || msg.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      // Fallback for demo
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSearch = () => {
    // Just apply the search filter - it's already implemented in filteredMessages
    console.log('Searching for:', searchQuery);
  };

  const handleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    if (showEmojiPicker) {
      const emojis = ['😊', '👍', '👎', '❤️', '🎉', '🤔', '😂', '😍'];
      const selectedEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      setMessage(prev => prev + ' ' + selectedEmoji);
    }
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
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">MentorConnectAI</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                className="px-3 py-1 rounded-full bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70"
                onClick={handleSearch}
              >
                🔍
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm hover:shadow-md transition-shadow"
                onClick={() => handleQuickAction(action.prompt)}
              >
                {action.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="p-2 bg-white border-b">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Container */}
        <div 
          ref={chatContainerRef}
          className="h-[50vh] overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        >
          <AnimatePresence>
            {filteredMessages.map((chat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: chat.type === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    chat.type === 'user'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white shadow-md'
                  }`}
                >
                  {chat.attachments && (
                    <div className="mb-2">
                      {chat.attachments.map((attachment, idx) => (
                        <a
                          key={idx}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-200 hover:text-white flex items-center gap-1"
                        >
                          📎 {attachment.name}
                        </a>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-between items-start gap-2">
                    <p className={`text-sm whitespace-pre-wrap break-words ${chat.type === 'user' ? 'text-white' : 'text-gray-800'}`}>
                      {chat.content}
                    </p>
                    {chat.type === 'bot' && (
                      <button
                        onClick={() => copyToClipboard(chat.content, index)}
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        {copiedIndex === index ? "✓" : "📋"}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className={`text-xs ${chat.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {formatTime(chat.timestamp)}
                    </div>
                    {chat.type === 'bot' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => addReaction(index, '👍')}
                          className={`text-gray-500 hover:text-blue-600 transition-colors ${
                            chat.reactions?.['👍'] ? 'text-blue-600' : ''
                          }`}
                        >
                          👍 {chat.reactions?.['👍'] || ''}
                        </button>
                        <button
                          onClick={() => addReaction(index, '👎')}
                          className={`text-gray-500 hover:text-blue-600 transition-colors ${
                            chat.reactions?.['👎'] ? 'text-blue-600' : ''
                          }`}
                        >
                          👎 {chat.reactions?.['👎'] || ''}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Typing Indicator */}
          <AnimatePresence>
            {typingIndicator && (
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

        {/* Emoji Picker (simplified) */}
        {showEmojiPicker && (
          <div className="p-2 bg-white border-t">
            <div className="flex flex-wrap gap-2">
              {['😊', '👍', '👎', '❤️', '🎉', '🤔', '😂', '😍'].map((emoji, index) => (
                <button
                  key={index}
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={() => {
                    setMessage(prev => prev + ' ' + emoji);
                    setShowEmojiPicker(false);
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <motion.div 
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="p-4 bg-white border-t"
        >
          <div className="flex space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-500 hover:text-blue-600 rounded-full"
              onClick={() => fileInputRef.current?.click()}
            >
              📎
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-500 hover:text-blue-600 rounded-full"
              onClick={handleEmojiPicker}
            >
              😊
            </motion.button>
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
              ➤
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Chatbot;