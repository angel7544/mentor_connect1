import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CheckCircleIcon, XCircleIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';

interface MentorshipRequest {
  _id: string;
  studentName: string;
  studentId: string;
  studentImage: string;
  topic: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  requestDate: string;
}

interface MentorshipSession {
  _id: string;
  studentName: string;
  studentId: string;
  studentImage: string;
  topic: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  scheduledDate: string;
  duration: number;
  notes?: string;
}

interface AvailabilitySlot {
  _id: string;
  day: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
}

/**
 * AlumniMentorship component - specialized mentorship view for alumni
 */
const AlumniMentorship: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [mentorshipSessions, setMentorshipSessions] = useState<MentorshipSession[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [mentorshipAvailable, setMentorshipAvailable] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data loading
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setMentorshipRequests([
          {
            _id: '1',
            studentName: 'John Smith',
            studentId: 'student1',
            studentImage: 'https://randomuser.me/api/portraits/men/1.jpg',
            topic: 'Career Guidance in Software Engineering',
            message: 'I would love to get your insights on transitioning from backend to full-stack development.',
            status: 'pending',
            requestDate: '2023-10-15T14:30:00Z'
          },
          {
            _id: '2',
            studentName: 'Sarah Johnson',
            studentId: 'student2',
            studentImage: 'https://randomuser.me/api/portraits/women/2.jpg',
            topic: 'Interview Preparation',
            message: 'I have an upcoming interview with a tech company and would appreciate some guidance.',
            status: 'accepted',
            requestDate: '2023-10-10T09:15:00Z'
          },
          {
            _id: '3',
            studentName: 'Michael Chen',
            studentId: 'student3',
            studentImage: 'https://randomuser.me/api/portraits/men/3.jpg',
            topic: 'Project Review',
            message: 'I would like you to review my portfolio project and provide feedback.',
            status: 'rejected',
            requestDate: '2023-10-05T16:45:00Z'
          }
        ]);
        
        setMentorshipSessions([
          {
            _id: '101',
            studentName: 'Sarah Johnson',
            studentId: 'student2',
            studentImage: 'https://randomuser.me/api/portraits/women/2.jpg',
            topic: 'Interview Preparation',
            status: 'scheduled',
            scheduledDate: '2023-10-20T15:00:00Z',
            duration: 60
          },
          {
            _id: '102',
            studentName: 'Emily Wong',
            studentId: 'student4',
            studentImage: 'https://randomuser.me/api/portraits/women/4.jpg',
            topic: 'Resume Review',
            status: 'completed',
            scheduledDate: '2023-10-12T11:00:00Z',
            duration: 45,
            notes: 'Provided feedback on resume structure and content. Suggested highlighting project experiences more prominently.'
          }
        ]);
        
        setAvailabilitySlots([
          {
            _id: 'avail1',
            day: 'Monday',
            startTime: '14:00',
            endTime: '16:00',
            isRecurring: true
          },
          {
            _id: 'avail2',
            day: 'Wednesday',
            startTime: '10:00',
            endTime: '12:00',
            isRecurring: true
          },
          {
            _id: 'avail3',
            day: 'Friday',
            startTime: '15:00',
            endTime: '17:00',
            isRecurring: false
          }
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRequestAction = (requestId: string, action: 'accept' | 'reject') => {
    setMentorshipRequests(prev => 
      prev.map(request => 
        request._id === requestId 
          ? { ...request, status: action === 'accept' ? 'accepted' : 'rejected' } 
          : request
      )
    );
    
    // If accepted, add to sessions
    if (action === 'accept') {
      const request = mentorshipRequests.find(r => r._id === requestId);
      if (request) {
        const newSession: MentorshipSession = {
          _id: `new-${requestId}`,
          studentName: request.studentName,
          studentId: request.studentId,
          studentImage: request.studentImage,
          topic: request.topic,
          status: 'scheduled',
          scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
          duration: 60
        };
        setMentorshipSessions(prev => [...prev, newSession]);
      }
    }
  };

  const toggleAvailability = () => {
    setMentorshipAvailable(!mentorshipAvailable);
  };

  const addAvailabilitySlot = () => {
    const newSlot: AvailabilitySlot = {
      _id: `avail${availabilitySlots.length + 1}`,
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:00',
      isRecurring: true
    };
    setAvailabilitySlots(prev => [...prev, newSlot]);
  };

  const removeAvailabilitySlot = (slotId: string) => {
    setAvailabilitySlots(prev => prev.filter(slot => slot._id !== slotId));
  };

  const handleTabChange = (tab: 'requests' | 'sessions' | 'availability') => {
    setActiveTab(tab);
  };

  const filteredRequests = mentorshipRequests.filter(req => {
    // Filter by search query
    if (searchQuery && !req.studentName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // We only show pending requests in the requests tab
    return req.status === 'pending';
  });

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading mentorship data..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Mentorship Management</h1>
        
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search requests..."
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
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          <button 
            onClick={() => navigate('/alumni/dashboard')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Mentorship Availability</h2>
            <p className="text-gray-500">
              {mentorshipAvailable 
                ? "You're currently available to receive mentorship requests. Toggle off if you need a break." 
                : "You're not receiving new mentorship requests. Toggle on when you're ready."}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={toggleAvailability}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                mentorshipAvailable ? 'bg-indigo-600' : 'bg-gray-300'
              } transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              role="switch"
              aria-checked={mentorshipAvailable}
            >
              <span className="sr-only">Toggle availability</span>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  mentorshipAvailable ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="ml-2 text-sm font-medium text-gray-900">
              {mentorshipAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px space-x-8">
          <button
            onClick={() => handleTabChange('requests')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Mentorship Requests
          </button>
          <button
            onClick={() => handleTabChange('sessions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sessions'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Mentorship Sessions
          </button>
          <button
            onClick={() => handleTabChange('availability')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'availability'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Availability Settings
          </button>
        </nav>
      </div>
      
      {/* Content based on active tab */}
      {activeTab === 'requests' && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Mentorship Requests</h2>
          {filteredRequests.length === 0 ? (
            <p className="text-gray-500 italic">No mentorship requests at this time.</p>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div key={request._id} className="border rounded-lg p-4">
                  <div className="flex items-start">
                    <img
                      src={request.studentImage}
                      alt={request.studentName}
                      className="h-10 w-10 rounded-full mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{request.studentName}</h3>
                      <p className="text-sm text-gray-500">
                        Requested on {new Date(request.requestDate).toLocaleDateString()}
                      </p>
                      <p className="mt-2 text-gray-700 font-medium">{request.topic}</p>
                      <p className="mt-1 text-gray-600">{request.message}</p>
                    </div>
                    <div className="ml-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                  </div>
                  {request.status === 'pending' && (
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => handleRequestAction(request._id, 'accept')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleRequestAction(request._id, 'reject')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                      >
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'sessions' && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Mentorship Sessions</h2>
          {mentorshipSessions.length === 0 ? (
            <p className="text-gray-500 italic">No mentorship sessions scheduled.</p>
          ) : (
            <div className="space-y-4">
              {mentorshipSessions.map((session) => (
                <div
                  key={session._id}
                  className={`border rounded-lg p-4 ${
                    session.status === 'completed' ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-start">
                    <img
                      src={session.studentImage}
                      alt={session.studentName}
                      className="h-10 w-10 rounded-full mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-900">{session.studentName}</h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            session.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : session.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {session.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        <ClockIcon className="inline h-4 w-4 mr-1" />
                        {new Date(session.scheduledDate).toLocaleString()} ({session.duration} min)
                      </p>
                      <p className="mt-2 text-gray-700 font-medium">{session.topic}</p>
                      {session.notes && (
                        <div className="mt-2 p-2 bg-gray-100 rounded">
                          <p className="text-sm text-gray-700 font-medium">Session Notes:</p>
                          <p className="text-sm text-gray-600">{session.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {session.status === 'scheduled' && (
                    <div className="mt-4 flex justify-end space-x-2">
                      <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700">
                        Reschedule
                      </button>
                      <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                        Add Notes
                      </button>
                      <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700">
                        Mark Complete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'availability' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Availability Settings</h2>
            <button
              onClick={addAvailabilitySlot}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Availability Slot
            </button>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  When you add availability slots, students will be able to request mentorship sessions during these times.
                </p>
              </div>
            </div>
          </div>
          
          {availabilitySlots.length === 0 ? (
            <p className="text-gray-500 italic">No availability slots set. Add your first slot to start receiving mentorship requests.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Day
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recurring
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {availabilitySlots.map((slot) => (
                    <tr key={slot._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {slot.day}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {slot.startTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {slot.endTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {slot.isRecurring ? 'Yes' : 'No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <button
                          onClick={() => removeAvailabilitySlot(slot._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlumniMentorship; 