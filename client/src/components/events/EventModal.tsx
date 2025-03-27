import React, { useState, useEffect } from 'react';
import { Event } from '../../services/eventService';
import { EVENT_TYPES, EventType } from '../../config';
import { toast } from 'react-hot-toast';

// Add Google Maps type declarations
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          AutocompleteService: new () => any;
          AutocompletePrediction: any;
        };
        GeocodingService: new () => any;
      };
    };
  }
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: Partial<Event>) => Promise<void>;
  event?: Event;
  mode: 'create' | 'edit';
}

interface LocationSearchResult {
  place_id: string;
  description: string;
}

const getMinDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  event,
  mode
}) => {
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    description: '',
    type: 'workshop' as EventType,
    startDate: '',
    endDate: '',
    location: '',
    locationCoordinates: undefined,
    isOnline: false,
    meetingLink: '',
    capacity: 0,
    isPublic: true,
    registrationDeadline: '',
    tags: [],
    image: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [mapUrl, setMapUrl] = useState('');

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        startDate: new Date(event.startDate).toISOString().slice(0, 16),
        endDate: new Date(event.endDate).toISOString().slice(0, 16),
        registrationDeadline: event.registrationDeadline 
          ? new Date(event.registrationDeadline).toISOString().slice(0, 16)
          : ''
      });
      setImagePreview(event.image || '');
      if (event.location) {
        setLocationInput(event.location);
        updateMapUrl(event.location);
      }
    } else {
      // Reset form for new event
      setFormData({
        title: '',
        description: '',
        type: 'workshop' as EventType,
        startDate: '',
        endDate: '',
        location: '',
        locationCoordinates: undefined,
        isOnline: false,
        meetingLink: '',
        capacity: 0,
        isPublic: true,
        registrationDeadline: '',
        tags: [],
        image: ''
      });
      setImagePreview('');
      setImageFile(null);
      setLocationInput('');
      setMapUrl('');
    }
  }, [event]);

  const updateMapUrl = (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    setMapUrl(`https://www.openstreetmap.org/search?query=${encodedLocation}`);
  };

  const handleLocationSelect = () => {
    if (locationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        location: locationInput.trim()
      }));
      updateMapUrl(locationInput.trim());
      setIsLocationModalOpen(false);
      toast.success('Location selected successfully');
    } else {
      toast.error('Please enter a location');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate dates
      const startDate = new Date(formData.startDate!);
      const endDate = new Date(formData.endDate!);
      const registrationDeadline = formData.registrationDeadline 
        ? new Date(formData.registrationDeadline)
        : null;
      const now = new Date();

      if (startDate < now) {
        toast.error('Start date cannot be in the past');
        return;
      }

      if (endDate <= startDate) {
        toast.error('End date must be after start date');
        return;
      }

      if (registrationDeadline && registrationDeadline > startDate) {
        toast.error('Registration deadline must be before start date');
        return;
      }

      // Handle image upload
      if (imageFile) {
        // In a real app, you would upload the image to a server
        // For demo purposes, we'll use a data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          onSubmit({
            ...formData,
            image: reader.result as string
          });
        };
        reader.readAsDataURL(imageFile);
      } else {
        await onSubmit(formData);
      }
    } catch (error) {
      toast.error('Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (formData.tags?.length >= 5) {
        toast.error('Maximum 5 tags allowed');
        return;
      }
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim().toLowerCase()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const getMaxDateTime = (startDate: string) => {
    if (!startDate) return '';
    const date = new Date(startDate);
    date.setFullYear(date.getFullYear() + 1); // Allow events up to 1 year in the future
    return date.toISOString().slice(0, 16);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {mode === 'create' ? 'Create New Event' : 'Edit Event'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {mode === 'create' 
                  ? 'Fill in the details to create a new event' 
                  : 'Update the event information'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white"
                    placeholder="Enter event title"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white"
                  >
                    {EVENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white"
                    placeholder="Enter event description"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Event Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {imagePreview ? (
                        <div className="relative group">
                          <img
                            src={imagePreview}
                            alt="Event preview"
                            className="h-32 w-32 object-cover rounded-lg shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview('');
                              setImageFile(null);
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="h-32 w-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                          <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="w-full flex flex-col items-center px-4 py-4 bg-white rounded-lg shadow-sm tracking-wide border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors">
                        <svg className="w-6 h-6 text-gray-500" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1z" />
                        </svg>
                        <span className="mt-2 text-sm text-gray-600">Upload event image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Date and Time Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Date and Time</h3>
              <div className="space-y-6">
                {/* Start Date & Time */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Start Date & Time
                      </label>
                      <p className="text-xs text-gray-500">When does the event begin?</p>
                    </div>
                  </div>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    min={getMinDateTime()}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* End Date & Time */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        End Date & Time
                      </label>
                      <p className="text-xs text-gray-500">When does the event end?</p>
                    </div>
                  </div>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    min={formData.startDate || getMinDateTime()}
                    max={getMaxDateTime(formData.startDate)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* Registration Deadline */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Registration Deadline
                      </label>
                      <p className="text-xs text-gray-500">When should registration close?</p>
                    </div>
                  </div>
                  <input
                    type="datetime-local"
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                    min={getMinDateTime()}
                    max={formData.startDate || getMaxDateTime(formData.startDate)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* Date Validation Messages */}
                {formData.startDate && formData.endDate && (
                  <div className="mt-4 space-y-2">
                    {new Date(formData.startDate) > new Date() && (
                      <div className="flex items-center text-sm text-green-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Event starts in the future
                      </div>
                    )}
                    {new Date(formData.endDate) > new Date(formData.startDate) && (
                      <div className="flex items-center text-sm text-green-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        End time is after start time
                      </div>
                    )}
                    {formData.registrationDeadline && new Date(formData.registrationDeadline) < new Date(formData.startDate) && (
                      <div className="flex items-center text-sm text-green-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Registration deadline is before event start
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Location and Capacity Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location and Capacity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      required
                      value={locationInput}
                      readOnly
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-white"
                      placeholder="Select location"
                    />
                    <button
                      type="button"
                      onClick={() => setIsLocationModalOpen(true)}
                      className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      Select Location
                    </button>
                  </div>
                  {formData.locationCoordinates && (
                    <a
                      href={`https://www.google.com/maps?q=${formData.locationCoordinates.lat},${formData.locationCoordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View on Google Maps
                    </a>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Capacity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isOnline"
                    checked={formData.isOnline}
                    onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })}
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors"
                  />
                  <label htmlFor="isOnline" className="text-sm font-medium text-gray-700">
                    Online Event
                  </label>
                </div>

                {formData.isOnline && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Meeting Link
                    </label>
                    <input
                      type="url"
                      value={formData.meetingLink}
                      onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white"
                      placeholder="Enter meeting link"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Tags Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={addTag}
                  placeholder="Press Enter to add tags (max 5)"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white"
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  mode === 'create' ? 'Create Event' : 'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Location Selection Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Select Location</h3>
                <button
                  onClick={() => setIsLocationModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => {
                      setLocationInput(e.target.value);
                      updateMapUrl(e.target.value);
                    }}
                    placeholder="Enter location (e.g., Bangalore Tech Hub, Koramangala)"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  />
                </div>

                {mapUrl && (
                  <div className="mt-4">
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View on OpenStreetMap
                    </a>
                  </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsLocationModalOpen(false)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleLocationSelect}
                    className="px-4 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Confirm Location
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventModal; 