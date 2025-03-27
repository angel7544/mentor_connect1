import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Event } from '../../services/eventService';
import { dummyEvents } from '../../data/dummyEvents';
import EventCard from '../../components/events/EventCard';
import EventModal from '../../components/events/EventModal';
import { toast } from 'react-hot-toast';

/**
 * Main Events page component with role-based views for students and alumni
 */
const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    // Simulate API call with dummy data
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEvents(dummyEvents);
      } catch (error) {
        toast.error('Failed to fetch events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleCreateEvent = async (eventData: Partial<Event>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newEvent: Event = {
        ...eventData,
        _id: Math.random().toString(36).substr(2, 9),
        organizer: {
          _id: user?._id || '',
          firstName: user?.firstName || '',
          lastName: user?.lastName || ''
        },
        attendees: [],
        status: 'upcoming'
      } as Event;
      
      setEvents(prev => [...prev, newEvent]);
      toast.success('Event created successfully');
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to create event');
    }
  };

  const handleUpdateEvent = async (eventData: Partial<Event>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEvents(prev =>
        prev.map(event =>
          event._id === selectedEvent?._id
            ? { ...event, ...eventData }
            : event
        )
      );
      toast.success('Event updated successfully');
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to update event');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEvents(prev => prev.filter(event => event._id !== eventId));
      toast.success('Event deleted successfully');
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const handleRegisterForEvent = async (eventId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEvents(prev =>
        prev.map(event =>
          event._id === eventId
            ? {
                ...event,
                attendees: [...event.attendees, user?._id || '']
              }
            : event
        )
      );
    } catch (error) {
      toast.error('Failed to register for event');
    }
  };

  const handleCancelRegistration = async (eventId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEvents(prev =>
        prev.map(event =>
          event._id === eventId
            ? {
                ...event,
                attendees: event.attendees.filter(id => id !== user?._id)
              }
            : event
        )
      );
    } catch (error) {
      toast.error('Failed to cancel registration');
    }
  };

  const openCreateModal = () => {
    setSelectedEvent(undefined);
    setModalMode('create');
    setShowModal(true);
  };

  const openEditModal = (event: Event) => {
    setSelectedEvent(event);
    setModalMode('edit');
    setShowModal(true);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const now = new Date();
    const eventDate = new Date(event.startDate);
    const isUpcoming = eventDate > now;
    const isPast = eventDate < now;

    if (activeTab === 'upcoming') return matchesSearch && isUpcoming;
    if (activeTab === 'past') return matchesSearch && isPast;
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Events</h1>
        {user && (
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Event
          </button>
        )}
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Events
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upcoming'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Events
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'past'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('past')}
          >
            Past Events
          </button>
        </nav>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? 'Try adjusting your search query'
              : activeTab === 'upcoming'
              ? 'No upcoming events at the moment'
              : activeTab === 'past'
              ? 'No past events found'
              : 'No events available'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onEdit={openEditModal}
              onDelete={handleDeleteEvent}
              onRegister={handleRegisterForEvent}
              onCancelRegistration={handleCancelRegistration}
            />
          ))}
        </div>
      )}

      <EventModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={modalMode === 'create' ? handleCreateEvent : handleUpdateEvent}
        event={selectedEvent}
        mode={modalMode}
      />
    </div>
  );
};

export default EventsPage; 