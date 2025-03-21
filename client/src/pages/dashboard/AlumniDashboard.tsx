import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  UserGroupIcon, 
  CalendarIcon, 
  ChatBubbleLeftRightIcon, 
  BookOpenIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import ErrorDisplay from '../../components/common/ErrorDisplay';

interface MentorshipRequest {
  _id: string;
  mentee: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  menteeProfile?: {
    bio?: string;
    skills?: string[];
    interests?: string[];
  };
  requestMessage?: string;
  status: 'pending' | 'active' | 'completed' | 'declined' | 'canceled';
  createdAt: string;
}

interface ActiveMentorship {
  _id: string;
  mentee: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  startDate: string;
  lastMessageDate?: string;
  topics?: string[];
}

interface UpcomingEvent {
  _id: string;
  title: string;
  startDate: string;
  location?: {
    type: 'virtual' | 'in-person' | 'hybrid';
    virtualLink?: string;
  };
}

interface DashboardStats {
  pendingRequests: number;
  activeMentorships: number;
  completedMentorships: number;
  upcomingEvents: number;
  unreadMessages: number;
}

// Add API response type interfaces
interface MentorshipRequestsResponse {
  data: {
    mentorships: MentorshipRequest[];
  };
}

interface ActiveMentorshipsResponse {
  data: {
    mentorships: ActiveMentorship[];
  };
}

interface UpcomingEventsResponse {
  data: {
    events: UpcomingEvent[];
  };
}

interface UnreadMessagesResponse {
  data: {
    count: number;
  };
}

const AlumniDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    pendingRequests: 0,
    activeMentorships: 0,
    completedMentorships: 0,
    upcomingEvents: 0,
    unreadMessages: 0
  });
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [activeMentorships, setActiveMentorships] = useState<ActiveMentorship[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Move fetchDashboardData to useCallback for better retry handling
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For development, always use mock data to ensure the dashboard loads
      // In production, we would try the API calls first
      const useMockData = true; // Set to false to attempt real API calls
      
      if (!useMockData) {
        // Add a delay to simulate network latency
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          // Actual API calls would go here
          // ... API calls ...
          setLoading(false);
        } catch (apiError) {
          throw apiError;
        }
      } else {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set mock data directly
        setMentorshipRequests([
          {
            _id: '1',
            mentee: {
              _id: '101',
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com'
            },
            menteeProfile: {
              bio: 'Computer Science student interested in AI and machine learning',
              skills: ['Python', 'JavaScript', 'React'],
              interests: ['Machine Learning', 'Web Development']
            },
            requestMessage: 'I would love to learn from your experience in the tech industry.',
            status: 'pending',
            createdAt: new Date().toISOString()
          },
          {
            _id: '2',
            mentee: {
              _id: '102',
              firstName: 'Jane',
              lastName: 'Smith',
              email: 'jane.smith@example.com'
            },
            menteeProfile: {
              bio: 'Business student looking to break into tech',
              skills: ['Marketing', 'Project Management'],
              interests: ['Product Management', 'Tech Startups']
            },
            requestMessage: 'I admire your career path and would appreciate your guidance.',
            status: 'pending',
            createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
          }
        ]);
        
        setActiveMentorships([
          {
            _id: '3',
            mentee: {
              _id: '103',
              firstName: 'Michael',
              lastName: 'Johnson',
              email: 'michael.j@example.com'
            },
            startDate: new Date(Date.now() - 30 * 86400000).toISOString(), // 30 days ago
            lastMessageDate: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
            topics: ['Career Transition', 'Interview Preparation']
          }
        ]);
        
        setUpcomingEvents([
          {
            _id: '1',
            title: 'Alumni Networking Event',
            startDate: new Date(Date.now() + 7 * 86400000).toISOString(), // 7 days from now
            location: {
              type: 'hybrid',
              virtualLink: 'https://zoom.us/j/example'
            }
          },
          {
            _id: '2',
            title: 'Mentorship Workshop',
            startDate: new Date(Date.now() + 14 * 86400000).toISOString(), // 14 days from now
            location: {
              type: 'virtual',
              virtualLink: 'https://teams.microsoft.com/l/meetup-join/example'
            }
          }
        ]);
        
        setStats({
          pendingRequests: 2,
          activeMentorships: 1,
          completedMentorships: 5,
          upcomingEvents: 2,
          unreadMessages: 3
        });
        
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      
      // Check if it's a network error
      if (err && typeof err === 'object' && 'isAxiosError' in err && !err.response) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError('Failed to load dashboard data. Please try again later.');
      }
      
      setLoading(false);
      
      // Set mock data anyway to ensure something displays
      // ... mock data setup ...
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await axios.put(`/api/mentorship/${requestId}/status`, { status: 'active' });
      
      // Update the UI
      setMentorshipRequests(prevRequests => 
        prevRequests.filter(request => request._id !== requestId)
      );
      
      // Refetch active mentorships or update the state directly
      // For demo, we'll just update the stats
      setStats(prevStats => ({
        ...prevStats,
        pendingRequests: prevStats.pendingRequests - 1,
        activeMentorships: prevStats.activeMentorships + 1
      }));
      
    } catch (err) {
      console.error('Error accepting mentorship request:', err);
      // Show error message to user
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      await axios.put(`/api/mentorship/${requestId}/status`, { status: 'declined' });
      
      // Update the UI
      setMentorshipRequests(prevRequests => 
        prevRequests.filter(request => request._id !== requestId)
      );
      
      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        pendingRequests: prevStats.pendingRequests - 1
      }));
      
    } catch (err) {
      console.error('Error declining mentorship request:', err);
      // Show error message to user
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay message={error} retry={fetchDashboardData} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Alumni Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <UserGroupIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Requests</p>
            <p className="text-xl font-semibold">{stats.pendingRequests}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <AcademicCapIcon className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Mentorships</p>
            <p className="text-xl font-semibold">{stats.activeMentorships}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <CheckCircleIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-xl font-semibold">{stats.completedMentorships}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <CalendarIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Upcoming Events</p>
            <p className="text-xl font-semibold">{stats.upcomingEvents}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-red-100 p-3 mr-4">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Unread Messages</p>
            <p className="text-xl font-semibold">{stats.unreadMessages}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mentorship Requests */}
        <div className="bg-white rounded-lg shadow col-span-1 lg:col-span-2">
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Mentorship Requests</h2>
          </div>
          
          <div className="p-6">
            {mentorshipRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending mentorship requests</p>
            ) : (
              <div className="space-y-4">
                {mentorshipRequests.map(request => (
                  <div key={request._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {request.mentee.firstName} {request.mentee.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">{request.mentee.email}</p>
                      </div>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {request.menteeProfile && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">{request.menteeProfile.bio}</p>
                        {request.menteeProfile.skills && request.menteeProfile.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-1">
                            {request.menteeProfile.skills.map(skill => (
                              <span key={skill} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                        {request.menteeProfile.interests && request.menteeProfile.interests.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {request.menteeProfile.interests.map(interest => (
                              <span key={interest} className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                {interest}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {request.requestMessage && (
                      <div className="bg-gray-50 p-3 rounded mb-3">
                        <p className="text-sm italic text-gray-700">"{request.requestMessage}"</p>
                      </div>
                    )}
                    
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleDeclineRequest(request._id)}
                        className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAcceptRequest(request._id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {mentorshipRequests.length > 0 && (
              <div className="mt-4 text-center">
                <Link to="/mentorship/requests" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View all requests
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
          </div>
          
          <div className="p-6">
            {upcomingEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming events</p>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <div key={event._id} className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{event.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {new Date(event.startDate).toLocaleDateString()} at {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {event.location && (
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="capitalize">{event.location.type}</span>
                        {event.location.virtualLink && (
                          <a href={event.location.virtualLink} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:text-blue-800">
                            Join link
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 text-center">
              <Link to="/events" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View all events
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Active Mentorships */}
      <div className="bg-white rounded-lg shadow mt-6">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Active Mentorships</h2>
        </div>
        
        <div className="p-6">
          {activeMentorships.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No active mentorships</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeMentorships.map(mentorship => (
                <div key={mentorship._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-900">
                      {mentorship.mentee.firstName} {mentorship.mentee.lastName}
                    </h3>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      Started {new Date(mentorship.startDate).toLocaleDateString()}
                    </div>
                    
                    {mentorship.lastMessageDate && (
                      <div className="flex items-center text-sm text-gray-500">
                        <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                        Last message {new Date(mentorship.lastMessageDate).toLocaleDateString()}
                      </div>
                    )}
                    
                    {mentorship.topics && mentorship.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {mentorship.topics.map(topic => (
                          <span key={topic} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link 
                      to={`/mentorship/${mentorship._id}`}
                      className="flex-1 text-center px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm"
                    >
                      View Details
                    </Link>
                    <Link 
                      to={`/messages?userId=${mentorship.mentee._id}`}
                      className="flex-1 text-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Message
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeMentorships.length > 0 && (
            <div className="mt-4 text-center">
              <Link to="/mentorship" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View all mentorships
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow mt-6">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Quick Links</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/profile" className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
              <UserGroupIcon className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-gray-700">My Profile</span>
            </Link>
            
            <Link to="/messages" className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-gray-700">Messages</span>
            </Link>
            
            <Link to="/resources" className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
              <BookOpenIcon className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-gray-700">Resources</span>
            </Link>
            
            <Link to="/events/create" className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
              <CalendarIcon className="h-8 w-8 text-red-600 mb-2" />
              <span className="text-gray-700">Create Event</span>
            </Link>
            
            <Link to="/analytics" className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
              <ChartBarIcon className="h-8 w-8 text-indigo-600 mb-2" />
              <span className="text-gray-700">View Analytics</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mentorship Availability */}
      <div className="bg-white rounded-lg shadow mt-6">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Mentorship Availability</h2>
          <div className="flex items-center">
            <span className="mr-3 text-sm text-gray-600">Open to Mentor</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
        
        <div className="p-6">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-2 mr-3">
                <CheckCircleIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-800">You're open to new mentorship requests</p>
                <p className="text-sm text-blue-600">Students can see your profile in mentor searches</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Current Availability</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Hours per week:</span>
                  <span className="text-sm font-medium">3-5 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active mentorships:</span>
                  <span className="text-sm font-medium">{stats.activeMentorships} of 3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending requests:</span>
                  <span className="text-sm font-medium">{stats.pendingRequests}</span>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <Link to="/profile" className="block px-4 py-2 text-sm text-center bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  Update Mentorship Preferences
                </Link>
                <Link to="/mentorship/requests" className="block px-4 py-2 text-sm text-center border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                  View All Requests
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard; 