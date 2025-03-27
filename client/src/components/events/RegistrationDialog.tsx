import React from 'react';
import { Event } from '../../services/eventService';
import { toast } from 'react-hot-toast';

interface RegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onRegister: () => Promise<void>;
  isSubmitting: boolean;
}

const RegistrationDialog: React.FC<RegistrationDialogProps> = ({
  isOpen,
  onClose,
  event,
  onRegister,
  isSubmitting
}) => {
  const handleRegister = async () => {
    try {
      await onRegister();
      toast.success(
        <div className="text-center">
          <p className="font-semibold">Thank you for showing interest in the event!</p>
          <p className="text-sm mt-1">Event details will be shared on your registered email soon.</p>
        </div>,
        {
          duration: 5000,
          position: 'top-center',
          style: {
            background: '#10B981',
            color: 'white',
            padding: '16px',
            borderRadius: '8px',
          },
        }
      );
      onClose();
    } catch (error) {
      toast.error('Failed to register for the event. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Register for Event</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">Date:</span>{' '}
                {new Date(event.startDate).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Time:</span>{' '}
                {new Date(event.startDate).toLocaleTimeString()} - {new Date(event.endDate).toLocaleTimeString()}
              </p>
              <p>
                <span className="font-medium">Location:</span>{' '}
                {event.isOnline ? 'Virtual Event' : event.location}
              </p>
              {event.capacity && (
                <p>
                  <span className="font-medium">Available Spots:</span>{' '}
                  {event.capacity - event.attendees.length} of {event.capacity}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleRegister}
            >
              {isSubmitting ? 'Registering...' : 'Confirm Registration'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationDialog; 