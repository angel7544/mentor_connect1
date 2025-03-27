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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    setIsSubmitting(true);
    try {
      await onRegister(event._id);
      setShowRegistrationDialog(false);
    } catch (error) {
      toast.error('Failed to register for event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRegistration = async () => {
    try {
      await onCancelRegistration(event._id);
      toast.success('Registration cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel registration');
    }
  };

  const isRegistered = user && event.attendees.includes(user._id);
  const isOrganizer = user && event.organizer._id === user._id;
  const isPast = new Date(event.endDate) < new Date();
  const isFull = event.attendees.length >= event.capacity;

  const getLocationLink = () => {
    if (event.isOnline) return event.meetingLink;
    if (event.locationCoordinates) {
      return `https://www.google.com/maps?q=${event.locationCoordinates.lat},${event.locationCoordinates.lng}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48">
        <img
          src={event.image || 'https://via.placeholder.com/400x200?text=No+Image'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        {event.isOnline && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Online Event
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">
              {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <a
              href={getLocationLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              {event.location}
            </a>
          </div>

          <div className="flex items-center text-gray-600">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm">
              {event.attendees.length} / {event.capacity} attendees
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Organized by {event.organizer.firstName} {event.organizer.lastName}
          </div>

          <div className="flex space-x-2">
            {isOrganizer ? (
              <>
                <button
                  onClick={() => onEdit(event)}
                  className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(event._id)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </>
            ) : isPast ? (
              <span className="px-3 py-1 text-sm text-gray-500">Past Event</span>
            ) : isFull ? (
              <span className="px-3 py-1 text-sm text-red-500">Full</span>
            ) : isRegistered ? (
              <button
                onClick={handleCancelRegistration}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
              >
                Cancel Registration
              </button>
            ) : (
              <button
                onClick={() => setShowRegistrationDialog(true)}
                className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800"
              >
                Register
              </button>
            )}
          </div>
        </div>
      </div>

      <RegistrationDialog
        isOpen={showRegistrationDialog}
        onClose={() => setShowRegistrationDialog(false)}
        event={event}
        onRegister={handleRegister}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default EventCard; 