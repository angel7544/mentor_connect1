import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import RoleBasedRender from '../../components/common/RoleBasedRender';
import LoadingSpinner from '../../components/common/LoadingSpinner';

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
}

/**
 * Conversations List component
 */
const ConversationsList: React.FC<{
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversation: Conversation | null;
}> = ({ onSelectConversation, selectedConversation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dummy conversations data
  const conversations: Conversation[] = [
    {
      id: '1',
      participants: [
        {
          id: '2',
          name: 'Sarah Johnson',
          avatar: '',
          role: 'alumni',
          isOnline: true
        }
      ],
      lastMessage: {
        content: 'Do you have time for a quick chat about the internship?',
        timestamp: new Date(2023, 4, 15, 14, 30),
        senderId: '2'
      },
      unreadCount: 2
    },
    {
      id: '2',
      participants: [
        {
          id: '3',
          name: 'Michael Chen',
          avatar: '',
          role: 'alumni',
          isOnline: false
        }
      ],
      lastMessage: {
        content: 'I\'ve shared some resources about system design interviews.',
        timestamp: new Date(2023, 4, 14, 10, 15),
        senderId: '3'
      },
      unreadCount: 0
    },
    {
      id: '3',
      participants: [
        {
          id: '4',
          name: 'Emma Davis',
          avatar: '',
          role: 'student',
          isOnline: true
        }
      ],
      lastMessage: {
        content: 'Thanks for your help with the project!',
        timestamp: new Date(2023, 4, 13, 17, 45),
        senderId: '1' // current user
      },
      unreadCount: 0
    }
  ];

  const filteredConversations = searchQuery 
    ? conversations.filter(conv => 
        conv.participants.some(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : conversations;

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search messages..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="overflow-y-auto flex-grow">
        {filteredConversations.length > 0 ? (
          filteredConversations.map(conversation => (
            <div 
              key={conversation.id}
              className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                selectedConversation?.id === conversation.id ? 'bg-indigo-50' : ''
              }`}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gray-300"></div>
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: '2', // other person
      content: 'Hello! I had some questions about career paths in software engineering. Do you have time for a quick chat?',
      timestamp: new Date(2023, 4, 15, 14, 30),
      isRead: true
    },
    {
      id: '2',
      senderId: '1', // current user
      content: 'Hi there! I\'d be happy to help. What specific questions do you have?',
      timestamp: new Date(2023, 4, 15, 14, 35),
      isRead: true
    },
    {
      id: '3',
      senderId: '2', // other person
      content: 'I\'m trying to decide between focusing on frontend or backend development. What would you recommend for someone just starting their career?',
      timestamp: new Date(2023, 4, 15, 14, 40),
      isRead: true
    },
    {
      id: '4',
      senderId: '2', // other person
      content: 'Also, do you have time for a quick call sometime this week?',
      timestamp: new Date(2023, 4, 15, 14, 41),
      isRead: false
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      senderId: '1', // current user id
      content: message,
      timestamp: new Date(),
      isRead: false
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const templates = [
    "I'd be happy to review your resume. Please share it when convenient.",
    "Let's schedule a call to discuss this in more detail. Are you available this week?",
    "Thanks for reaching out. Here are some resources that might help you: [links]",
    "Great question! Based on my experience in the industry..."
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
          <button className="p-2 text-gray-500 hover:text-indigo-600 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
            </div>
            {msg.senderId !== '1' && (
              <button 
                onClick={() => pinMessage(msg.id)}
                className="text-gray-400 hover:text-yellow-500 ml-2"
              >
                <svg className={`w-4 h-4 ${msg.isPinned ? 'text-yellow-500' : ''}`} fill={msg.isPinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                </svg>
              </button>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-2">
            <button className="p-2 text-gray-500 hover:text-indigo-600 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
              </svg>
            </button>
            <button 
              className="p-2 text-gray-500 hover:text-indigo-600 rounded-full relative"
              onClick={() => setShowTemplates(!showTemplates)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                onClick={() => setMessage("That's a great question! For someone starting their career, I'd recommend...")}
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

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      senderId: '1', // current user id
      content: message,
      timestamp: new Date(),
      isRead: false
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
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