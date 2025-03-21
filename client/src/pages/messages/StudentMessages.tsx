import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { PaperAirplaneIcon, PaperClipIcon, FaceSmileIcon } from '@heroicons/react/24/outline';

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
    avatar: string;
    role: 'student' | 'alumni';
  };
  createdAt: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

interface Conversation {
  _id: string;
  participant: {
    _id: string;
    name: string;
    avatar: string;
    role: 'alumni';
    lastActive: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

const StudentMessages: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setConversations([
          {
            _id: 'c1',
            participant: {
              _id: 'a1',
              name: 'John Smith',
              avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
              role: 'alumni',
              lastActive: '2023-10-16T14:30:00Z'
            },
            lastMessage: 'Great work on the project! Let me know if you need any clarification.',
            lastMessageTime: '2023-10-16T14:30:00Z',
            unreadCount: 2,
            messages: [
              {
                _id: 'm1',
                content: 'Hi, I have a question about the mentorship program.',
                sender: {
                  _id: 's1',
                  name: 'Current User',
                  avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
                  role: 'student'
                },
                createdAt: '2023-10-16T14:00:00Z'
              },
              {
                _id: 'm2',
                content: 'Sure, I\'d be happy to help! What would you like to know?',
                sender: {
                  _id: 'a1',
                  name: 'John Smith',
                  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
                  role: 'alumni'
                },
                createdAt: '2023-10-16T14:15:00Z'
              }
            ]
          },
          {
            _id: 'c2',
            participant: {
              _id: 'a2',
              name: 'Sarah Johnson',
              avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
              role: 'alumni',
              lastActive: '2023-10-16T13:45:00Z'
            },
            lastMessage: 'The interview went well, thanks for your advice!',
            lastMessageTime: '2023-10-16T13:45:00Z',
            unreadCount: 0,
            messages: [
              {
                _id: 'm3',
                content: 'Thank you for sharing your interview experience.',
                sender: {
                  _id: 's1',
                  name: 'Current User',
                  avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
                  role: 'student'
                },
                createdAt: '2023-10-16T13:30:00Z'
              }
            ]
          }
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setIsLoading(false);
      }
    };
    
    fetchConversations();
  }, []);

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      _id: `new-${Date.now()}`,
      content: newMessage,
      sender: {
        _id: 's1',
        name: 'Current User',
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
        role: 'student'
      },
      createdAt: new Date().toISOString()
    };

    setConversations(prev =>
      prev.map(conv =>
        conv._id === selectedConversation._id
          ? {
              ...conv,
              lastMessage: newMessage,
              lastMessageTime: new Date().toISOString(),
              messages: [...conv.messages, message]
            }
          : conv
      )
    );

    setNewMessage('');
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // Mark conversation as read
    setConversations(prev =>
      prev.map(conv =>
        conv._id === conversation._id
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading messages..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
        {/* Conversations List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="overflow-y-auto h-[calc(100%-4rem)]">
            {filteredConversations.map(conversation => (
              <div
                key={conversation._id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedConversation?._id === conversation._id ? 'bg-indigo-50' : ''
                }`}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="flex items-center">
                  <img
                    src={conversation.participant.avatar}
                    alt={conversation.participant.name}
                    className="h-10 w-10 rounded-full mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">
                        {conversation.participant.name}
                      </h3>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {conversation.lastMessage}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(conversation.lastMessageTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages View */}
        <div className="md:col-span-2 bg-white rounded-lg shadow flex flex-col">
          {selectedConversation ? (
            <>
              {/* Messages Header */}
              <div className="p-4 border-b">
                <div className="flex items-center">
                  <img
                    src={selectedConversation.participant.avatar}
                    alt={selectedConversation.participant.name}
                    className="h-10 w-10 rounded-full mr-3"
                  />
                  <div>
                    <h2 className="font-medium text-gray-900">
                      {selectedConversation.participant.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Last active {new Date(selectedConversation.participant.lastActive).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map(message => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.sender._id === 's1' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender._id === 's1'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        <img
                          src={message.sender.avatar}
                          alt={message.sender.name}
                          className="h-6 w-6 rounded-full mr-2"
                        />
                        <span className="text-sm font-medium">
                          {message.sender.name}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map(attachment => (
                            <a
                              key={attachment.name}
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-blue-400 hover:text-blue-500"
                            >
                              <PaperClipIcon className="h-4 w-4 mr-1" />
                              {attachment.name}
                            </a>
                          ))}
                        </div>
                      )}
                      <p className="text-xs mt-1 opacity-75">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <PaperClipIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <FaceSmileIcon className="h-5 w-5" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentMessages; 