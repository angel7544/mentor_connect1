import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import RoleBasedRender from '../../components/common/RoleBasedRender';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const OLLAMA_API_BASE_URL = 'http://localhost:11434/api';

// Dummy data with Indian names and avatars
const INDIAN_AVATARS = [
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=4',
  'https://i.pravatar.cc/150?img=5',
];

const INDIAN_NAMES = {
  students: [
    { name: 'Priya Sharma', role: 'student', specialization: 'Computer Science' },
    { name: 'Arjun Patel', role: 'student', specialization: 'Data Science' },
    { name: 'Ananya Reddy', role: 'student', specialization: 'AI/ML' },
    { name: 'Rahul Verma', role: 'student', specialization: 'Web Development' },
    { name: 'Neha Gupta', role: 'student', specialization: 'Mobile Development' },
  ],
  alumni: [
    { name: 'Amit Kumar', role: 'alumni', company: 'Google', position: 'Senior Software Engineer' },
    { name: 'Deepika Singh', role: 'alumni', company: 'Microsoft', position: 'Product Manager' },
    { name: 'Rajesh Iyer', role: 'alumni', company: 'Amazon', position: 'Technical Lead' },
    { name: 'Sneha Menon', role: 'alumni', company: 'Meta', position: 'Full Stack Developer' },
    { name: 'Vikram Malhotra', role: 'alumni', company: 'Adobe', position: 'Architect' },
  ]
};

// Add AI response templates
const AI_RESPONSES = {
  career: [
    "Based on my experience, I'd recommend focusing on {specialization} as it's in high demand. Would you like to know more about specific career paths?",
    "In my role at {company}, I've seen many successful career transitions. Let me share some insights about {topic}.",
    "That's a great question! When I was starting my career, I focused on {skill}. Here's what I learned...",
    "Based on current industry trends, I'd suggest exploring {field}. Would you like to know more about the required skills?",
    "In my experience at {company}, we value {skill} the most. Let me share some tips on how to develop it."
  ],
  technical: [
    "For {topic}, I recommend starting with {framework}. Here's why...",
    "When working with {technology}, I've found that {approach} works best. Would you like to know more?",
    "Based on my experience at {company}, here's how we handle {topic}...",
    "For {problem}, I suggest using {solution}. Let me explain the benefits...",
    "When dealing with {topic}, I've learned that {practice} is crucial. Here's why..."
  ],
  general: [
    "That's an interesting question! Let me share my perspective on {topic}.",
    "Based on my experience, I can help you with {topic}. What specific aspects would you like to know more about?",
    "I've encountered similar situations in my career. Here's what I learned...",
    "That's a common challenge. Let me share some strategies that worked for me...",
    "I can help you with that! Would you like to know more about {topic}?"
  ]
};

// Add helper function to check Ollama API availability
const checkOllamaAvailability = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${OLLAMA_API_BASE_URL}/tags`);
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Add helper function to generate AI response using Ollama chat endpoint
const generateAIResponse = async (userMessage: string, userRole: 'student' | 'alumni', company?: string, specialization?: string): Promise<string> => {
  try {
    // First check if Ollama is available
    const isAvailable = await checkOllamaAvailability();
    if (!isAvailable) {
      throw new Error('Ollama service is not available');
    }

    const systemPrompt = `You are a helpful and friendly ${userRole} mentor. 
    ${company ? `You work at ${company} and have extensive experience in the industry.` : ''} 
    ${specialization ? `You have expertise in ${specialization} and can provide valuable insights.` : ''}
    You communicate in a warm, professional manner and always maintain a supportive tone.
    You provide detailed, practical advice based on real-world experience.
    You use natural, conversational language while maintaining professionalism.
    You occasionally share personal experiences to make your advice more relatable.
    You ask follow-up questions to better understand the student's needs.
    You use appropriate emojis sparingly to make the conversation more engaging.
    You always maintain a positive and encouraging tone.
    If you're not sure about something, be honest about it and suggest alternative resources.`;

    const response = await fetch(`${OLLAMA_API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          presence_penalty: 0.6,
          frequency_penalty: 0.5
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Validate the response
    if (!data.message || !data.message.content) {
      throw new Error('Invalid response format');
    }

    return data.message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // Provide more specific error messages based on the error type
    if (error.message === 'Ollama service is not available') {
      return "I notice that the mentoring service is currently unavailable. This might be because the service is starting up or undergoing maintenance. Could you please try again in a few moments? 🙏";
    } else if (error.message.includes('API error')) {
      return "I'm having trouble connecting to the mentoring service right now. This is likely a temporary issue. Would you mind trying again in a moment? 🙏";
    } else if (error.message === 'Invalid response format') {
      return "I received an unexpected response from the mentoring service. Let's try your question again to ensure you get the guidance you need. 🙏";
    } else {
      return "I'm experiencing some technical difficulties at the moment. Could you please try asking your question again? I want to make sure I can provide you with the best possible guidance. 🙏";
    }
  }
};

/**
 * Main Messages page component with role-based views for students and alumni
 */
const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  
  // Simulate API call to fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    
    fetchConversations();
  }, []);

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading messages..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[700px]">
          {/* Conversations List - Same for both roles */}
          <div className="col-span-1 border-r border-gray-200">
            <ConversationsList 
              onSelectConversation={setSelectedConversation}
              selectedConversation={selectedConversation}
            />
          </div>

          {/* Message area - Role-based */}
          <div className="col-span-2">
            {selectedConversation ? (
              <RoleBasedRender
                alumniView={<AlumniMessageView conversation={selectedConversation} />}
                studentView={<StudentMessageView conversation={selectedConversation} />}
                fallback={<div className="p-6 text-center text-gray-500">Please log in to view messages.</div>}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <p className="mt-2">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Types
interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'student' | 'alumni';
  isOnline: boolean;
  company?: string;
  position?: string;
  specialization?: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: {
    name: string;
    url: string;
    type: 'image' | 'document' | 'other';
  }[];
  isPinned?: boolean;
  reactions?: {
    [key: string]: string[];
  };
}

interface Conversation {
  id: string;
  participants: User[];
  lastMessage: {
    content: string;
    timestamp: Date;
    senderId: string;
  };
  unreadCount: number;
  tags?: string[];
}

/**
 * Conversations List component
 */
const ConversationsList: React.FC<{
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversation: Conversation | null;
}> = ({ onSelectConversation, selectedConversation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'students' | 'alumni'>('all');
  
  // Enhanced dummy conversations data with Indian names
  const conversations: Conversation[] = [
    {
      id: '1',
      participants: [
        {
          id: '2',
          name: 'Amit Kumar',
          avatar: INDIAN_AVATARS[0],
          role: 'alumni',
          isOnline: true,
          company: 'Google',
          position: 'Senior Software Engineer'
        }
      ],
      lastMessage: {
        content: 'Namaste! I can help you with your career guidance. What would you like to know?',
        timestamp: new Date(2023, 4, 15, 14, 30),
        senderId: '2'
      },
      unreadCount: 2,
      tags: ['Career Guidance', 'Google']
    },
    {
      id: '2',
      participants: [
        {
          id: '3',
          name: 'Deepika Singh',
          avatar: INDIAN_AVATARS[1],
          role: 'alumni',
          isOnline: false,
          company: 'Microsoft',
          position: 'Product Manager'
        }
      ],
      lastMessage: {
        content: 'I\'ve shared some resources about system design interviews. Let me know if you need more help!',
        timestamp: new Date(2023, 4, 14, 10, 15),
        senderId: '3'
      },
      unreadCount: 0,
      tags: ['Interview Prep', 'Microsoft']
    },
    {
      id: '3',
      participants: [
        {
          id: '4',
          name: 'Priya Sharma',
          avatar: INDIAN_AVATARS[2],
          role: 'student',
          isOnline: true,
          specialization: 'Computer Science'
        }
      ],
      lastMessage: {
        content: 'Thank you for your guidance! The resources were very helpful.',
        timestamp: new Date(2023, 4, 13, 17, 45),
        senderId: '1'
      },
      unreadCount: 0,
      tags: ['Computer Science']
    }
  ];

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = searchQuery 
      ? conv.participants.some(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.role === 'alumni' && p.company?.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : true;
    
    const matchesFilter = filter === 'all' 
      ? true 
      : conv.participants.some(p => p.role === filter);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200 space-y-3">
        <input
          type="text"
          placeholder="Search messages or companies..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'all' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'students' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilter('students')}
          >
            Students
          </button>
          <button 
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'alumni' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilter('alumni')}
          >
            Alumni
          </button>
        </div>
      </div>
      <div className="overflow-y-auto flex-grow">
        {filteredConversations.length > 0 ? (
          filteredConversations.map(conversation => (
            <div 
              key={conversation.id}
              className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversation?.id === conversation.id ? 'bg-indigo-50' : ''
              }`}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img 
                    src={conversation.participants[0].avatar} 
                    alt={conversation.participants[0].name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conversation.participants[0].isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.participants[0].name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatTime(conversation.lastMessage.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage.senderId === '1' ? 'You: ' : ''}
                    {conversation.lastMessage.content}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {conversation.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {conversation.unreadCount > 0 && (
                  <div className="ml-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No conversations found
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Format message timestamp
 */
const formatTime = (date: Date): string => {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

/**
 * Alumni Message View
 */
const AlumniMessageView: React.FC<{ conversation: Conversation }> = ({ conversation }) => {
  const [message, setMessage] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [isOllamaAvailable, setIsOllamaAvailable] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: '2',
      content: 'Namaste! I can help you with your career guidance. What would you like to know?',
      timestamp: new Date(2023, 4, 15, 14, 30),
      isRead: true,
      reactions: { '👍': ['2'] }
    },
    {
      id: '2',
      senderId: '1',
      content: 'Hi! I have questions about working at Google. What\'s the culture like?',
      timestamp: new Date(2023, 4, 15, 14, 35),
      isRead: true,
      reactions: { '👏': ['2'] }
    },
    {
      id: '3',
      senderId: '2',
      content: 'Google has an amazing culture! We focus on innovation and collaboration. Would you like to know more about specific teams?',
      timestamp: new Date(2023, 4, 15, 14, 40),
      isRead: true,
      reactions: {}
    },
    {
      id: '4',
      senderId: '2',
      content: 'I can also share some tips for the interview process if you\'re interested.',
      timestamp: new Date(2023, 4, 15, 14, 41),
      isRead: false,
      reactions: {}
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check Ollama availability on component mount
  useEffect(() => {
    const checkAvailability = async () => {
      const available = await checkOllamaAvailability();
      setIsOllamaAvailable(available);
    };
    checkAvailability();
  }, []);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;
    
    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      senderId: '1',
      content: message,
      timestamp: new Date(),
      isRead: false
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    setIsGeneratingResponse(true);

    try {
      const aiResponse = await generateAIResponse(
        message,
        conversation.participants[0].role,
        conversation.participants[0].company,
        conversation.participants[0].specialization
      );

      const aiMessage: Message = {
        id: (messages.length + 2).toString(),
        senderId: '2',
        content: aiResponse,
        timestamp: new Date(),
        isRead: false,
        reactions: {}
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error handling message:', error);
      const errorMessage: Message = {
        id: (messages.length + 2).toString(),
        senderId: '2',
        content: "I'm having a bit of trouble with my connection right now. Could you please rephrase your question? I want to make sure I can give you the most helpful response possible. 🙏",
        timestamp: new Date(),
        isRead: false,
        reactions: {}
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  const templates = [
    "Namaste! I'd be happy to review your resume. Please share it when convenient.",
    "Let's schedule a call to discuss this in more detail. Are you available this week?",
    "Here are some resources that might help you: [links]",
    "Based on my experience at Google, I can tell you that...",
    "Would you like to know more about the interview process?"
  ];

  const applyTemplate = (template: string) => {
    setMessage(template);
    setShowTemplates(false);
  };

  const pinMessage = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg
    ));
  };

  const emojis = ['👍', '👏', '🎉', '💡', '🤔', '💪', '🚀', '💻', '📚', '🎯'];

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || {};
        const users = reactions[emoji] || [];
        if (users.includes('1')) {
          // Remove reaction if already added
          const newUsers = users.filter(id => id !== '1');
          if (newUsers.length === 0) {
            const { [emoji]: _, ...rest } = reactions;
            return { ...msg, reactions: rest };
          }
          return { ...msg, reactions: { ...reactions, [emoji]: newUsers } };
        }
        // Add reaction
        return { 
          ...msg, 
          reactions: { ...reactions, [emoji]: [...users, '1'] }
        };
      }
      return msg;
    }));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img 
            src={conversation.participants[0].avatar} 
            alt={conversation.participants[0].name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              {conversation.participants[0].name}
            </h3>
            <p className="text-xs text-gray-500">
              {conversation.participants[0].position} at {conversation.participants[0].company}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-500 hover:text-indigo-600 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
          </button>
          <button className="p-2 text-gray-500 hover:text-indigo-600 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </button>
          <button className="p-2 text-gray-500 hover:text-indigo-600 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map(msg => (
          <div key={msg.id} className={`mb-4 ${msg.senderId === '1' ? 'text-right' : ''}`}>
            <div className={`inline-block max-w-[70%] p-3 rounded-lg ${
              msg.senderId === '1' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            } ${msg.isPinned ? 'border-2 border-yellow-400' : ''}`}>
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs mt-1 opacity-70">{formatTime(msg.timestamp)}</p>
              {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {Object.entries(msg.reactions).map(([emoji, users]) => (
                    <span 
                      key={emoji}
                      className="text-xs bg-white/20 px-2 py-0.5 rounded-full"
                    >
                      {emoji} {users.length}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {msg.senderId !== '1' && (
              <div className="flex space-x-2 mt-1">
                <button 
                  onClick={() => pinMessage(msg.id)}
                  className="text-gray-400 hover:text-yellow-500"
                >
                  <svg className={`w-4 h-4 ${msg.isPinned ? 'text-yellow-500' : ''}`} fill={msg.isPinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                  </svg>
                </button>
                <button 
                  onClick={() => setShowEmojiPicker(true)}
                  className="text-gray-400 hover:text-indigo-500"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </button>
              </div>
            )}
          </div>
        ))}
        {isGeneratingResponse && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            <span className="text-sm">Generating response...</span>
          </div>
        )}
        {isOllamaAvailable === false && (
          <div className="text-center text-red-500 text-sm mt-2">
            Mentoring service is currently unavailable. Please try again later.
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-2">
            <button className="p-2 text-gray-500 hover:text-indigo-600 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
              </svg>
            </button>
            <button 
              className="p-2 text-gray-500 hover:text-indigo-600 rounded-full relative"
              onClick={() => setShowTemplates(!showTemplates)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
              </svg>
            </button>
          </div>
          <div>
            <span className="text-xs text-gray-500">
              AI suggestions:
            </span>
            <div className="flex space-x-2 mt-1">
              <button 
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                onClick={() => setMessage("That's a great question! Based on my experience at Google...")}
              >
                Career advice
              </button>
              <button 
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                onClick={() => setMessage("I'm available for a call this Friday at 3pm. Would that work for you?")}
              >
                Schedule call
              </button>
            </div>
          </div>
        </div>
        
        {showTemplates && (
          <div className="mb-3 p-3 bg-gray-50 rounded-md border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Message Templates</h4>
            <div className="space-y-2 max-h-24 overflow-y-auto">
              {templates.map((template, index) => (
                <div 
                  key={index}
                  className="text-sm p-2 bg-white rounded cursor-pointer hover:bg-indigo-50"
                  onClick={() => applyTemplate(template)}
                >
                  {template}
                </div>
              ))}
            </div>
          </div>
        )}

        {showEmojiPicker && (
          <div className="mb-3 p-3 bg-gray-50 rounded-md border border-gray-200">
            <div className="grid grid-cols-5 gap-2">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  className="text-2xl hover:bg-white p-2 rounded"
                  onClick={() => {
                    addReaction(messages[messages.length - 1].id, emoji);
                    setShowEmojiPicker(false);
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Student Message View
 */
const StudentMessageView: React.FC<{ conversation: Conversation }> = ({ conversation }) => {
  const [message, setMessage] = useState('');
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: '1', // current user
      content: 'Hello! I had some questions about career paths in software engineering. Do you have time for a quick chat?',
      timestamp: new Date(2023, 4, 15, 14, 30),
      isRead: true
    },
    {
      id: '2',
      senderId: '2', // other person
      content: 'Hi there! I\'d be happy to help. What specific questions do you have?',
      timestamp: new Date(2023, 4, 15, 14, 35),
      isRead: true
    },
    {
      id: '3',
      senderId: '1', // current user
      content: 'I\'m trying to decide between focusing on frontend or backend development. What would you recommend for someone just starting their career?',
      timestamp: new Date(2023, 4, 15, 14, 40),
      isRead: true
    },
    {
      id: '4',
      senderId: '1', // current user
      content: 'Also, do you have time for a quick call sometime this week?',
      timestamp: new Date(2023, 4, 15, 14, 41),
      isRead: true
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;
    
    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      senderId: '1',
      content: message,
      timestamp: new Date(),
      isRead: false
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    setIsGeneratingResponse(true);

    try {
      const aiResponse = await generateAIResponse(
        message,
        conversation.participants[0].role,
        conversation.participants[0].company,
        conversation.participants[0].specialization
      );

      const aiMessage: Message = {
        id: (messages.length + 2).toString(),
        senderId: '2',
        content: aiResponse,
        timestamp: new Date(),
        isRead: false,
        reactions: {}
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error handling message:', error);
      const errorMessage: Message = {
        id: (messages.length + 2).toString(),
        senderId: '2',
        content: "I'm having a bit of trouble with my connection right now. Could you please rephrase your question? I want to make sure I can give you the most helpful response possible. 🙏",
        timestamp: new Date(),
        isRead: false,
        reactions: {}
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              {conversation.participants[0].name}
            </h3>
            <p className="text-xs text-gray-500">
              {conversation.participants[0].role === 'student' ? 'Student' : 'Alumni'}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-500 hover:text-indigo-600 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
          </button>
          <button className="p-2 text-gray-500 hover:text-indigo-600 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map(msg => (
          <div key={msg.id} className={`mb-4 ${msg.senderId === '1' ? 'text-right' : ''}`}>
            <div className={`inline-block max-w-[70%] p-3 rounded-lg ${
              msg.senderId === '1' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}>
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs mt-1 opacity-70">{formatTime(msg.timestamp)}</p>
            </div>
          </div>
        ))}
        {isGeneratingResponse && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            <span className="text-sm">Generating response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex space-x-2 mb-2">
          <button className="p-2 text-gray-500 hover:text-indigo-600 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
            </svg>
          </button>
          <div className="flex-grow">
            <span className="text-xs text-gray-500">
              Conversation starters:
            </span>
            <div className="flex space-x-2 mt-1 overflow-x-auto pb-1">
              <button 
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 whitespace-nowrap"
                onClick={() => setMessage("Could you tell me more about your career journey?")}
              >
                Career journey
              </button>
              <button 
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 whitespace-nowrap"
                onClick={() => setMessage("What skills should I focus on developing right now?")}
              >
                Skill development
              </button>
              <button 
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 whitespace-nowrap"
                onClick={() => setMessage("Do you have any advice for someone looking for their first internship?")}
              >
                Internship advice
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage; 