import React, { useState } from 'react';
import { Event } from '../../services/eventService';
import { useAuth } from '../../contexts/AuthContext';
import RegistrationDialog from './RegistrationDialog';
import { toast } from 'react-hot-toast';

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  onRegister?: (eventId: string) => Promise<void>;
  onCancelRegistration?: (eventId: string) => Promise<void>;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onDelete,
  onRegister,
  onCancelRegistration
}) => {
  const { user } = useAuth();
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (eventId: string) => {
    if (!onRegister) return;
    try {
      setIsLoading(true);
      await onRegister(eventId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRegistration = async (eventId: string) => {
    if (!onCancelRegistration) return;
    try {
      setIsLoading(true);
      await onCancelRegistration(eventId);
      toast.success('Registration cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel registration');
    } finally {
      setIsLoading(false);
    }
  };

  const isRegistered = user && event.attendees.includes(user._id);
  const isOrganizer = user && event.organizer._id === user._id;
  const isPastEvent = new Date(event.endDate) < new Date();
  const isFull = event.capacity && event.attendees.length >= event.capacity;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <img
          src={event.image || 'https://via.placeholder.com/400x200'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        {event.isOnline && (
          <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
            Online
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs ${
            event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
            event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
            event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
            'bg-red-100 text-red-800'
          }`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.isOnline ? 'Virtual Event' : event.location}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {event.capacity ? `${event.attendees.length}/${event.capacity} attendees` : 'Unlimited attendees'}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src={`https://i.pravatar.cc/32?img=${event.organizer._id}`}
              alt={`${event.organizer.firstName} ${event.organizer.lastName}`}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-sm text-gray-600">
              {event.organizer.firstName} {event.organizer.lastName}
            </span>
          </div>

          <div className="flex space-x-2">
            {isOrganizer && (
              <>
                <button
                  onClick={() => onEdit?.(event)}
                  className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete?.(event._id)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </>
            )}
            {!isOrganizer && !isPastEvent && (
              isRegistered ? (
                <button
                  onClick={() => handleCancelRegistration(event._id)}
                  disabled={isLoading}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  Cancel Registration
                </button>
              ) : (
                <button
                  onClick={() => setShowRegistrationDialog(true)}
                  disabled={isFull}
                  className={`px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50 ${
                    isFull ? 'cursor-not-allowed' : ''
                  }`}
                >
                  {isFull ? 'Full' : 'Register'}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <RegistrationDialog
        isOpen={showRegistrationDialog}
        onClose={() => setShowRegistrationDialog(false)}
        event={event}
        onRegister={handleRegister}
      />
    </div>
  );
};

export default EventCard; 