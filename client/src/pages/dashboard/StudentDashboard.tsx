import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  UserGroupIcon, 
  CalendarIcon, 
  ChatBubbleLeftRightIcon, 
  BookOpenIcon,
  AcademicCapIcon,
  ClockIcon,
  BriefcaseIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface Mentor {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  profile: {
    title?: string;
    company?: string;
    bio?: string;
    skills?: string[];
    expertise?: string[];
    yearsOfExperience?: number;
  };
}

interface MentorshipStatus {
  _id: string;
  mentor: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  status: 'pending' | 'active' | 'completed' | 'declined' | 'canceled';
  startDate?: string;
  lastMessageDate?: string;
}

interface Resource {
  _id: string;
  title: string;
  type: 'article' | 'video' | 'course' | 'book' | 'tool';
  description: string;
  url: string;
  tags: string[];
  createdAt: string;
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
  mentorshipRequests: number;
  activeMentorships: number;
  upcomingEvents: number;
  unreadMessages: number;
  savedResources: number;
}

// Add API response type interfaces
interface MentorsResponse {
  data: {
    mentors: Mentor[];
  };
}

interface MentorshipsResponse {
  data: {
    mentorships: MentorshipStatus[];
  };
}

interface ResourcesResponse {
  data: {
    resources: Resource[];
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

const StudentDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    mentorshipRequests: 0,
    activeMentorships: 0,
    upcomingEvents: 0,
    unreadMessages: 0,
    savedResources: 0
  });
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [mentorships, setMentorships] = useState<MentorshipStatus[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, these would be actual API calls
        // For now, we'll simulate the data
        
        // Fetch recommended mentors
        const mentorsResponse = await axios.get<MentorsResponse>('/api/profile/mentors');
        setMentors(mentorsResponse.data.data.mentors);
        
        // Fetch mentorship status
        const mentorshipsResponse = await axios.get<MentorshipsResponse>('/api/mentorship/my-mentorships');
        setMentorships(mentorshipsResponse.data.data.mentorships);
        
        // Fetch recommended resources
        const resourcesResponse = await axios.get<ResourcesResponse>('/api/resources?limit=3');
        setResources(resourcesResponse.data.data.resources);
        
        // Fetch upcoming events
        const eventsResponse = await axios.get<UpcomingEventsResponse>('/api/events/upcoming');
        setUpcomingEvents(eventsResponse.data.data.events);
        
        // Fetch unread message count
        const messagesResponse = await axios.get<UnreadMessagesResponse>('/api/messages/unread/count');
        
        // Update stats
        setStats({
          mentorshipRequests: mentorshipsResponse.data.data.mentorships.filter(
            (m: MentorshipStatus) => m.status === 'pending'
          ).length,
          activeMentorships: mentorshipsResponse.data.data.mentorships.filter(
            (m: MentorshipStatus) => m.status === 'active'
          ).length,
          upcomingEvents: eventsResponse.data.data.events.length,
          unreadMessages: messagesResponse.data.data.count,
          savedResources: 5 // Mock data
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
        
        // For demo purposes, set mock data
        setMentors([
          {
            _id: '1',
            user: {
              _id: '101',
              firstName: 'Sarah',
              lastName: 'Johnson'
            },
            profile: {
              title: 'Senior Software Engineer',
              company: 'Google',
              bio: 'Experienced software engineer with 10+ years in the industry',
              skills: ['JavaScript', 'React', 'Node.js'],
              expertise: ['Web Development', 'System Design', 'Career Guidance'],
              yearsOfExperience: 10
            }
          },
          {
            _id: '2',
            user: {
              _id: '102',
              firstName: 'David',
              lastName: 'Chen'
            },
            profile: {
              title: 'Product Manager',
              company: 'Microsoft',
              bio: 'Product manager with experience in both startups and large tech companies',
              skills: ['Product Strategy', 'User Research', 'Agile'],
              expertise: ['Product Management', 'Career Transition', 'Leadership'],
              yearsOfExperience: 8
            }
          },
          {
            _id: '3',
            user: {
              _id: '103',
              firstName: 'Maria',
              lastName: 'Garcia'
            },
            profile: {
              title: 'Data Scientist',
              company: 'Amazon',
              bio: 'Data scientist specializing in machine learning and AI applications',
              skills: ['Python', 'Machine Learning', 'Data Analysis'],
              expertise: ['AI/ML', 'Data Science', 'Technical Interviews'],
              yearsOfExperience: 6
            }
          }
        ]);
        
        setMentorships([
          {
            _id: '1',
            mentor: {
              _id: '104',
              firstName: 'Robert',
              lastName: 'Taylor'
            },
            status: 'active',
            startDate: new Date(Date.now() - 30 * 86400000).toISOString(), // 30 days ago
            lastMessageDate: new Date(Date.now() - 2 * 86400000).toISOString() // 2 days ago
          },
          {
            _id: '2',
            mentor: {
              _id: '105',
              firstName: 'Jennifer',
              lastName: 'Lee'
            },
            status: 'pending',
            startDate: undefined,
            lastMessageDate: undefined
          }
        ]);
        
        setResources([
          {
            _id: '1',
            title: 'How to Prepare for Technical Interviews',
            type: 'article',
            description: 'A comprehensive guide to acing technical interviews at top tech companies',
            url: 'https://example.com/tech-interviews',
            tags: ['Career', 'Interviews', 'Technical'],
            createdAt: new Date(Date.now() - 7 * 86400000).toISOString() // 7 days ago
          },
          {
            _id: '2',
            title: 'Introduction to React Hooks',
            type: 'video',
            description: 'Learn how to use React Hooks to build more efficient React components',
            url: 'https://example.com/react-hooks',
            tags: ['React', 'JavaScript', 'Frontend'],
            createdAt: new Date(Date.now() - 14 * 86400000).toISOString() // 14 days ago
          },
          {
            _id: '3',
            title: 'Building a Professional Portfolio',
            type: 'course',
            description: 'Step-by-step guide to creating a portfolio that stands out to employers',
            url: 'https://example.com/portfolio-course',
            tags: ['Career', 'Portfolio', 'Personal Branding'],
            createdAt: new Date(Date.now() - 21 * 86400000).toISOString() // 21 days ago
          }
        ]);
        
        setUpcomingEvents([
          {
            _id: '1',
            title: 'Resume Workshop',
            startDate: new Date(Date.now() + 3 * 86400000).toISOString(), // 3 days from now
            location: {
              type: 'virtual',
              virtualLink: 'https://zoom.us/j/example'
            }
          },
          {
            _id: '2',
            title: 'Tech Industry Networking Event',
            startDate: new Date(Date.now() + 10 * 86400000).toISOString(), // 10 days from now
            location: {
              type: 'in-person'
            }
          }
        ]);
        
        setStats({
          mentorshipRequests: 1,
          activeMentorships: 1,
          upcomingEvents: 2,
          unreadMessages: 3,
          savedResources: 5
        });
      }
    };
    
    fetchDashboardData();
  }, []);

  const handleRequestMentorship = async (mentorId: string) => {
    // Redirect to mentorship page
    window.location.href = '/mentorship';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <AcademicCapIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Mentorships</p>
            <p className="text-xl font-semibold">{stats.activeMentorships}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <ClockIcon className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Requests</p>
            <p className="text-xl font-semibold">{stats.mentorshipRequests}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <BookOpenIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Saved Resources</p>
            <p className="text-xl font-semibold">{stats.savedResources}</p>
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
        {/* Recommended Mentors */}
        <div className="bg-white rounded-lg shadow col-span-1 lg:col-span-2">
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Recommended Mentors</h2>
          </div>
          
          <div className="p-6">
            {mentors.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No mentors available at the moment</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mentors.map(mentor => (
                  <div key={mentor._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {mentor.user.firstName} {mentor.user.lastName}
                        </h3>
                        {mentor.profile.title && mentor.profile.company && (
                          <p className="text-sm text-gray-500">
                            {mentor.profile.title} at {mentor.profile.company}
                          </p>
                        )}
                      </div>
                      {mentor.profile.yearsOfExperience && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {mentor.profile.yearsOfExperience}+ years
                        </span>
                      )}
                    </div>
                    
                    {mentor.profile.bio && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{mentor.profile.bio}</p>
                    )}
                    
                    {mentor.profile.expertise && mentor.profile.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {mentor.profile.expertise.map(item => (
                          <span key={item} className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Link 
                        to={`/profile/user/${mentor.user._id}`}
                        className="flex-1 text-center px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm"
                      >
                        View Profile
                      </Link>
                      <button 
                        onClick={() => handleRequestMentorship(mentor.user._id)}
                        className="flex-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 text-center">
              <Link to="/mentors" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Browse all mentors
              </Link>
            </div>
          </div>
        </div>
        
        {/* Mentorship Status */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">My Mentorships</h2>
          </div>
          
          <div className="p-6">
            {mentorships.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No mentorships yet</p>
            ) : (
              <div className="space-y-4">
                {mentorships.map(mentorship => (
                  <div key={mentorship._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">
                        {mentorship.mentor.firstName} {mentorship.mentor.lastName}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        mentorship.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : mentorship.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {mentorship.status.charAt(0).toUpperCase() + mentorship.status.slice(1)}
                      </span>
                    </div>
                    
                    {mentorship.startDate && (
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        Started {new Date(mentorship.startDate).toLocaleDateString()}
                      </div>
                    )}
                    
                    {mentorship.lastMessageDate && (
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                        Last message {new Date(mentorship.lastMessageDate).toLocaleDateString()}
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Link 
                        to={`/mentorship/${mentorship._id}`}
                        className="flex-1 text-center px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm"
                      >
                        View Details
                      </Link>
                      {mentorship.status === 'active' && (
                        <Link 
                          to={`/messages?userId=${mentorship.mentor._id}`}
                          className="flex-1 text-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          Message
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 text-center">
              <Link to="/mentorship" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View all mentorships
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Resources and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Resources */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Recommended Resources</h2>
          </div>
          
          <div className="p-6">
            {resources.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No resources available</p>
            ) : (
              <div className="space-y-4">
                {resources.map(resource => (
                  <div key={resource._id} className="border rounded-lg p-4">
                    <div className="flex items-start mb-2">
                      <div className={`rounded-full p-2 mr-3 ${
                        resource.type === 'article' ? 'bg-blue-100' :
                        resource.type === 'video' ? 'bg-red-100' :
                        resource.type === 'course' ? 'bg-green-100' :
                        resource.type === 'book' ? 'bg-yellow-100' : 'bg-gray-100'
                      }`}>
                        <DocumentTextIcon className={`h-5 w-5 ${
                          resource.type === 'article' ? 'text-blue-600' :
                          resource.type === 'video' ? 'text-red-600' :
                          resource.type === 'course' ? 'text-green-600' :
                          resource.type === 'book' ? 'text-yellow-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{resource.title}</h3>
                        <p className="text-xs text-gray-500 capitalize">{resource.type}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{resource.description}</p>
                    
                    {resource.tags && resource.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {resource.tags.map(tag => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        View Resource
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 text-center">
              <Link to="/resources" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Browse all resources
              </Link>
            </div>
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
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="capitalize">{event.location.type}</span>
                        {event.location.virtualLink && (
                          <a href={event.location.virtualLink} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:text-blue-800">
                            Join link
                          </a>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <Link 
                        to={`/events/${event._id}`}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        View Details
                      </Link>
                    </div>
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
            
            <Link to="/forum" className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
              <BriefcaseIcon className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-gray-700">Forum</span>
            </Link>
            
            <Link to="/mentors" className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
              <AcademicCapIcon className="h-8 w-8 text-red-600 mb-2" />
              <span className="text-gray-700">Find Mentors</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 