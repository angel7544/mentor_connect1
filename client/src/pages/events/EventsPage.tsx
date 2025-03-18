import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import RoleBasedRender from '../../components/common/RoleBasedRender';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AuthDebug from '../../components/common/AuthDebug';

/**
 * Main Events page component with role-based views for students and alumni
 */
const EventsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'my-events'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Simulate API call to fetch events data
  useEffect(() => {
    const fetchEventsData = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    
    fetchEventsData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading events..." />;
  }

  // For development/debugging only
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Debugging component - only in development */}
      {isDev && <AuthDebug />}
    
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Events</h1>
        
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              className="px-4 py-2 pr-10 w-full md:w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg 
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>

          {isAuthenticated ? (
            user?.role === 'alumni' ? (
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Create Event
              </button>
            ) : (
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                My Calendar
              </button>
            )
          ) : (
            <button className="px-4 py-2 bg-gray-200 text-gray-500 rounded-md cursor-not-allowed">
              Sign in to Access
            </button>
          )}
        </div>
      </div>

      {/* Tab navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            className={`py-4 px-1 ${
              activeTab === 'upcoming'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } font-medium text-sm sm:text-base`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Events
          </button>
          <button
            className={`py-4 px-1 ${
              activeTab === 'my-events'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } font-medium text-sm sm:text-base`}
            onClick={() => setActiveTab('my-events')}
          >
            {user?.role === 'alumni' ? 'My Hosted Events' : 'My Registered Events'}
          </button>
          <button
            className={`py-4 px-1 ${
              activeTab === 'past'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } font-medium text-sm sm:text-base`}
            onClick={() => setActiveTab('past')}
          >
            Past Events
          </button>
        </nav>
      </div>

      {/* Role-based content - conditionally render based on authentication */}
      {isAuthenticated ? (
        user?.role === 'alumni' ? (
          <AlumniEventsView activeTab={activeTab} searchQuery={searchQuery} />
        ) : user?.role === 'student' ? (
          <StudentEventsView activeTab={activeTab} searchQuery={searchQuery} />
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unknown user role</h3>
            <p className="text-gray-600">
              Your role ({user?.role}) is not recognized by the system.
            </p>
          </div>
        )
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in to access events</h3>
          <p className="text-gray-600">
            Join our community to discover and participate in events.
          </p>
        </div>
      )}
    </div>
  );
};

// Types
interface Event {
  id: string;
  title: string;
  description: string;
  type: 'Workshop' | 'Panel' | 'Networking' | 'Webinar' | 'Career Fair' | 'Other';
  date: Date;
  location: string;
  isVirtual: boolean;
  virtualLink?: string;
  organizer: {
    id: string;
    name: string;
    avatar: string;
    role: 'alumni' | 'admin' | 'organization';
  };
  attendeeCount: number;
  maxAttendees?: number;
  isRegistered?: boolean;
  tags: string[];
  image?: string;
}

// Interface for Events page components
interface EventViewProps {
  activeTab: 'upcoming' | 'past' | 'my-events';
  searchQuery: string;
}

/**
 * Alumni Events View
 */
const AlumniEventsView: React.FC<EventViewProps> = ({ activeTab, searchQuery }) => {
  // Sample events data for alumni view
  const events: Event[] = [
    {
      id: '1',
      title: 'Tech Industry Career Panel',
      description: 'Join industry professionals for insights on career paths and opportunities in the tech sector. This panel will feature speakers from leading tech companies discussing current trends and providing advice for students and recent graduates.',
      type: 'Panel',
      date: new Date(2024, 3, 25, 16, 0),
      location: 'Main Auditorium',
      isVirtual: true,
      virtualLink: 'https://zoom.us/j/example',
      organizer: {
        id: '1',
        name: 'Michael Chen',
        avatar: '',
        role: 'alumni'
      },
      attendeeCount: 32,
      maxAttendees: 50,
      isRegistered: true,
      tags: ['Career', 'Technology', 'Industry Insights']
    },
    {
      id: '2',
      title: 'Resume Review Workshop',
      description: 'Get your resume reviewed by industry professionals. Bring your current resume and receive personalized feedback to help you stand out to employers.',
      type: 'Workshop',
      date: new Date(2024, 3, 28, 14, 30),
      location: 'Room 102, Engineering Building',
      isVirtual: false,
      organizer: {
        id: '1',
        name: 'Michael Chen',
        avatar: '',
        role: 'alumni'
      },
      attendeeCount: 18,
      maxAttendees: 20,
      isRegistered: true,
      tags: ['Career', 'Resume', 'Job Search']
    },
    {
      id: '3',
      title: 'Networking Mixer for Tech Professionals',
      description: 'Connect with fellow professionals in the tech industry. This casual networking event provides an opportunity to meet peers, discuss industry trends, and expand your professional network.',
      type: 'Networking',
      date: new Date(2024, 4, 5, 18, 0),
      location: 'Alumni Hall',
      isVirtual: false,
      organizer: {
        id: '2',
        name: 'Sarah Johnson',
        avatar: '',
        role: 'alumni'
      },
      attendeeCount: 45,
      maxAttendees: 100,
      isRegistered: false,
      tags: ['Networking', 'Professional Development', 'Industry Connections']
    },
    {
      id: '4',
      title: 'Introduction to Machine Learning',
      description: 'A hands-on workshop introducing the basics of machine learning. Participants will learn fundamental concepts and implement simple models using Python.',
      type: 'Workshop',
      date: new Date(2024, 2, 15, 10, 0), // Past event
      location: 'Computer Science Lab',
      isVirtual: false,
      organizer: {
        id: '3',
        name: 'David Park',
        avatar: '',
        role: 'alumni'
      },
      attendeeCount: 30,
      isRegistered: true,
      tags: ['Machine Learning', 'Python', 'Data Science']
    }
  ];

  // Filter events based on tab and search query
  const filteredEvents = events.filter(event => {
    // Filter by tab
    const now = new Date();
    if (activeTab === 'upcoming' && event.date < now) return false;
    if (activeTab === 'past' && event.date >= now) return false;
    if (activeTab === 'my-events' && !event.isRegistered) return false;
    
    // Filter by search if applicable
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  // Event hosting metrics for alumni
  const eventHostingStats = {
    totalHosted: 15,
    upcomingEvents: 2,
    totalAttendees: 350,
    avgSatisfactionRating: 4.8
  };

  return (
    <div>
      {/* Event metrics for alumni */}
      {activeTab === 'my-events' && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Your Event Hosting Impact</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-xs text-gray-500">Total Events Hosted</p>
              <p className="text-lg font-semibold">{eventHostingStats.totalHosted}</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-xs text-gray-500">Upcoming Events</p>
              <p className="text-lg font-semibold">{eventHostingStats.upcomingEvents}</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-xs text-gray-500">Total Attendees</p>
              <p className="text-lg font-semibold">{eventHostingStats.totalAttendees}</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-xs text-gray-500">Avg. Satisfaction</p>
              <p className="text-lg font-semibold">{eventHostingStats.avgSatisfactionRating}/5</p>
            </div>
          </div>
        </div>
      )}

      {/* Events list */}
      <div className="space-y-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              isAlumniView={true} 
            />
          ))
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">
              {activeTab === 'upcoming' 
                ? 'No upcoming events found.' 
                : activeTab === 'past'
                ? 'No past events found.'
                : 'You have not hosted any events yet.'}
            </p>
            {activeTab === 'my-events' && (
              <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Create Your First Event
              </button>
            )}
          </div>
        )}
      </div>

      {/* Event creation guide for alumni */}
      {activeTab === 'upcoming' && (
        <div className="mt-8 bg-indigo-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-indigo-900 mb-2">Want to host your own event?</h3>
          <p className="text-sm text-indigo-700 mb-4">
            Share your expertise and connect with students by hosting workshops, panels, or networking events.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow-sm">
              <div className="flex items-center mb-2">
                <div className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center mr-2">1</div>
                <h4 className="font-medium text-gray-900">Plan Your Event</h4>
              </div>
              <p className="text-sm text-gray-600">Define your event's purpose, format, and target audience.</p>
            </div>
            <div className="bg-white p-4 rounded shadow-sm">
              <div className="flex items-center mb-2">
                <div className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center mr-2">2</div>
                <h4 className="font-medium text-gray-900">Create Listing</h4>
              </div>
              <p className="text-sm text-gray-600">Fill out the event details, set date, time, and capacity.</p>
            </div>
            <div className="bg-white p-4 rounded shadow-sm">
              <div className="flex items-center mb-2">
                <div className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center mr-2">3</div>
                <h4 className="font-medium text-gray-900">Host & Connect</h4>
              </div>
              <p className="text-sm text-gray-600">Engage with attendees and share your insights and experience.</p>
            </div>
          </div>
          <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Create Event
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Student Events View
 */
const StudentEventsView: React.FC<EventViewProps> = ({ activeTab, searchQuery }) => {
  // Sample events data for student view (same events, different perspective)
  const events: Event[] = [
    {
      id: '1',
      title: 'Tech Industry Career Panel',
      description: 'Join industry professionals for insights on career paths and opportunities in the tech sector. This panel will feature speakers from leading tech companies discussing current trends and providing advice for students and recent graduates.',
      type: 'Panel',
      date: new Date(2024, 3, 25, 16, 0),
      location: 'Main Auditorium',
      isVirtual: true,
      virtualLink: 'https://zoom.us/j/example',
      organizer: {
        id: '1',
        name: 'Michael Chen',
        avatar: '',
        role: 'alumni'
      },
      attendeeCount: 32,
      maxAttendees: 50,
      isRegistered: true,
      tags: ['Career', 'Technology', 'Industry Insights']
    },
    {
      id: '2',
      title: 'Resume Review Workshop',
      description: 'Get your resume reviewed by industry professionals. Bring your current resume and receive personalized feedback to help you stand out to employers.',
      type: 'Workshop',
      date: new Date(2024, 3, 28, 14, 30),
      location: 'Room 102, Engineering Building',
      isVirtual: false,
      organizer: {
        id: '1',
        name: 'Michael Chen',
        avatar: '',
        role: 'alumni'
      },
      attendeeCount: 18,
      maxAttendees: 20,
      isRegistered: false,
      tags: ['Career', 'Resume', 'Job Search']
    },
    {
      id: '3',
      title: 'Mock Technical Interviews',
      description: 'Practice your technical interview skills with experienced professionals. Receive feedback and tips to improve your performance in real interviews.',
      type: 'Workshop',
      date: new Date(2024, 4, 5, 10, 0),
      location: 'Computer Science Department',
      isVirtual: false,
      organizer: {
        id: '3',
        name: 'David Park',
        avatar: '',
        role: 'alumni'
      },
      attendeeCount: 15,
      maxAttendees: 25,
      isRegistered: true,
      tags: ['Interview Prep', 'Technical Skills', 'Career']
    },
    {
      id: '4',
      title: 'Introduction to Machine Learning',
      description: 'A hands-on workshop introducing the basics of machine learning. Participants will learn fundamental concepts and implement simple models using Python.',
      type: 'Workshop',
      date: new Date(2024, 2, 15, 10, 0), // Past event
      location: 'Computer Science Lab',
      isVirtual: false,
      organizer: {
        id: '3',
        name: 'David Park',
        avatar: '',
        role: 'alumni'
      },
      attendeeCount: 30,
      isRegistered: true,
      tags: ['Machine Learning', 'Python', 'Data Science']
    }
  ];

  // Recommended events based on student interests
  const recommendedEvents = events.filter(event => (
    event.date > new Date() && 
    (event.tags.includes('Career') || event.tags.includes('Technical Skills'))
  ));

  // Filter events based on tab and search query
  const filteredEvents = events.filter(event => {
    // Filter by tab
    const now = new Date();
    if (activeTab === 'upcoming' && event.date < now) return false;
    if (activeTab === 'past' && event.date >= now) return false;
    if (activeTab === 'my-events' && !event.isRegistered) return false;
    
    // Filter by search if applicable
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  // Event participation stats for students
  const eventParticipationStats = {
    registered: 5,
    attended: 8,
    upcoming: 2,
    certificates: 3
  };

  return (
    <div>
      {/* Event participation metrics for students */}
      {activeTab === 'my-events' && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Your Event Participation</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-xs text-gray-500">Registered Events</p>
              <p className="text-lg font-semibold">{eventParticipationStats.registered}</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-xs text-gray-500">Attended Events</p>
              <p className="text-lg font-semibold">{eventParticipationStats.attended}</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-xs text-gray-500">Upcoming Events</p>
              <p className="text-lg font-semibold">{eventParticipationStats.upcoming}</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-xs text-gray-500">Certificates</p>
              <p className="text-lg font-semibold">{eventParticipationStats.certificates}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recommended events section (for upcoming tab only) */}
      {activeTab === 'upcoming' && recommendedEvents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recommendedEvents.slice(0, 2).map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                isAlumniView={false} 
                isRecommended={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Events list */}
      <div className="space-y-6">
        {activeTab === 'upcoming' && <h2 className="text-xl font-semibold text-gray-800 mb-4">All Upcoming Events</h2>}
        
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              isAlumniView={false}
            />
          ))
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">
              {activeTab === 'upcoming' 
                ? 'No upcoming events found.' 
                : activeTab === 'past'
                ? 'No past events found.'
                : 'You have not registered for any events yet.'}
            </p>
            {activeTab === 'my-events' && (
              <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Browse Upcoming Events
              </button>
            )}
          </div>
        )}
      </div>

      {/* Event categories */}
      {activeTab === 'upcoming' && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Browse by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {['Career', 'Technical', 'Networking', 'Workshops', 'Panels', 'Webinars'].map((category) => (
              <button 
                key={category}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors text-sm"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Event Card Component
 */
const EventCard: React.FC<{ 
  event: Event; 
  isAlumniView: boolean;
  isRecommended?: boolean;
}> = ({ event, isAlumniView, isRecommended = false }) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString([], { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const isUpcoming = event.date > new Date();
  const isFullyBooked = event.maxAttendees && event.attendeeCount >= event.maxAttendees;

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden ${
      isRecommended ? 'border-2 border-indigo-400' : ''
    }`}>
      <div className="md:flex">
        {/* Event image or placeholder */}
        <div className="md:flex-shrink-0 bg-indigo-100 md:w-48 h-48 md:h-auto flex items-center justify-center">
          {event.image ? (
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <svg className="w-16 h-16 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          )}
        </div>
        <div className="p-6 flex-1">
          <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
            <span className={`inline-block px-2 py-1 text-xs rounded-md ${
              event.type === 'Workshop' ? 'bg-green-100 text-green-800' :
              event.type === 'Panel' ? 'bg-blue-100 text-blue-800' :
              event.type === 'Networking' ? 'bg-purple-100 text-purple-800' :
              event.type === 'Webinar' ? 'bg-yellow-100 text-yellow-800' :
              event.type === 'Career Fair' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {event.type}
            </span>
            
            {isRecommended && (
              <span className="inline-block px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-md">
                Recommended for You
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
          
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <div className="flex items-center mr-4">
              <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              {formatDate(event.date)}
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {formatTime(event.date)}
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <div className="flex items-center mr-4">
              <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {event.isVirtual ? 'Virtual Event' : event.location}
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              {event.attendeeCount} {event.maxAttendees && `/ ${event.maxAttendees}`} attending
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {event.description}
          </p>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {event.tags.map((tag, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
              <span className="text-sm text-gray-700">
                Hosted by {event.organizer.name}
              </span>
            </div>
            
            <div className="flex space-x-2">
              {isAlumniView ? (
                <>
                  {isUpcoming && event.isRegistered && (
                    <button className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                      Manage Event
                    </button>
                  )}
                  {!isUpcoming && event.isRegistered && (
                    <button className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                      View Analytics
                    </button>
                  )}
                </>
              ) : (
                <>
                  {isUpcoming && (
                    event.isRegistered ? (
                      <button className="px-3 py-1 text-xs bg-green-600 text-white rounded-md cursor-default">
                        Registered
                      </button>
                    ) : (
                      <button 
                        className={`px-3 py-1 text-xs rounded-md ${
                          isFullyBooked 
                            ? 'bg-gray-300 text-gray-700 cursor-not-allowed' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        } transition-colors`}
                        disabled={isFullyBooked}
                      >
                        {isFullyBooked ? 'Fully Booked' : 'Register'}
                      </button>
                    )
                  )}
                  {event.isVirtual && event.isRegistered && isUpcoming && (
                    <a 
                      href={event.virtualLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Join Event
                    </a>
                  )}
                  {!isUpcoming && event.isRegistered && (
                    <button className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                      View Materials
                    </button>
                  )}
                </>
              )}
              <button className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage; 