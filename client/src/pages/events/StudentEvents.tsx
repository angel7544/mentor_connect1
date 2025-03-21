import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CalendarIcon, ClockIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'workshop' | 'seminar' | 'networking' | 'hackathon';
  imageUrl?: string;
  organizer: {
    name: string;
    avatar: string;
  };
  attendees: number;
  maxAttendees: number;
  tags: string[];
  isRegistered: boolean;
}

const StudentEvents: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setEvents([
          {
            _id: 'e1',
            title: 'Web Development Workshop',
            description: 'Learn modern web development techniques and best practices',
            date: '2023-11-15',
            time: '14:00 - 17:00',
            location: 'Virtual Event',
            type: 'workshop',
            imageUrl: 'https://via.placeholder.com/300x200',
            organizer: {
              name: 'Tech Academy',
              avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
            },
            attendees: 45,
            maxAttendees: 50,
            tags: ['Web Development', 'JavaScript', 'React'],
            isRegistered: false
          },
          {
            _id: 'e2',
            title: 'Career Networking Event',
            description: 'Connect with industry professionals and explore career opportunities',
            date: '2023-11-20',
            time: '18:00 - 21:00',
            location: 'Conference Center A',
            type: 'networking',
            imageUrl: 'https://via.placeholder.com/300x200',
            organizer: {
              name: 'Career Services',
              avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
            },
            attendees: 120,
            maxAttendees: 150,
            tags: ['Networking', 'Career Development'],
            isRegistered: true
          }
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.type === filter;
  });

  const handleRegister = (eventId: string) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event._id === eventId
          ? { ...event, isRegistered: true, attendees: event.attendees + 1 }
          : event
      )
    );
  };

  const handleUnregister = (eventId: string) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event._id === eventId
          ? { ...event, isRegistered: false, attendees: event.attendees - 1 }
          : event
      )
    );
  };

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading events..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
        
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setFilter('workshop')}
            className={`px-4 py-2 rounded-md ${
              filter === 'workshop' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Workshops
          </button>
          <button
            onClick={() => setFilter('seminar')}
            className={`px-4 py-2 rounded-md ${
              filter === 'seminar' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Seminars
          </button>
          <button
            onClick={() => setFilter('networking')}
            className={`px-4 py-2 rounded-md ${
              filter === 'networking' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Networking
          </button>
          <button
            onClick={() => setFilter('hackathon')}
            className={`px-4 py-2 rounded-md ${
              filter === 'hackathon' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Hackathons
          </button>
        </div>
      </div>
      
      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full p-8 bg-white rounded-lg shadow text-center">
            <p className="text-gray-500">No events found for the selected filter.</p>
            <button
              onClick={() => setFilter('all')}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              View All Events
            </button>
          </div>
        ) : (
          filteredEvents.map(event => (
            <div key={event._id} className="bg-white rounded-lg shadow overflow-hidden">
              {event.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    event.type === 'workshop' ? 'bg-blue-100 text-blue-800' :
                    event.type === 'seminar' ? 'bg-green-100 text-green-800' :
                    event.type === 'networking' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    <span>{event.attendees}/{event.maxAttendees} attendees</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src={event.organizer.avatar} 
                      alt={event.organizer.name} 
                      className="h-8 w-8 rounded-full mr-2"
                    />
                    <span className="text-sm text-gray-700">{event.organizer.name}</span>
                  </div>
                  {event.isRegistered ? (
                    <button
                      onClick={() => handleUnregister(event._id)}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                    >
                      Unregister
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRegister(event._id)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Register
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentEvents; 