import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  MagnifyingGlassIcon, 
  UserCircleIcon, 
  CalendarIcon,
  ChatBubbleLeftIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface Mentor {
  _id: string;
  name: string;
  avatar: string;
  title: string;
  company: string;
  expertise: string[];
  availability: string;
  rating: number;
  bio: string;
  isAvailable: boolean;
}

interface MentorshipRequest {
  _id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  status: 'pending' | 'accepted' | 'rejected';
  requestDate: string;
  message: string;
}

interface MentorshipSession {
  _id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  scheduledDate: string;
  duration: number;
  topic: string;
  notes?: string;
}

/**
 * StudentMentorship component - specialized mentorship view for students
 */
const StudentMentorship: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'find' | 'requests' | 'sessions'>('find');
  const [searchQuery, setSearchQuery] = useState('');
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [mentorshipSessions, setMentorshipSessions] = useState<MentorshipSession[]>([]);
  
  // Mock data loading
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setMentors([
          {
            _id: 'm1',
            name: 'John Smith',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            title: 'Senior Software Engineer',
            company: 'TechCorp Inc.',
            expertise: ['Web Development', 'System Design', 'Career Guidance'],
            availability: '3-5 hours/week',
            rating: 4.9,
            bio: 'Experienced software engineer passionate about mentoring the next generation of developers.',
            isAvailable: true
          },
          {
            _id: 'm2',
            name: 'Sarah Johnson',
            avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
            title: 'Product Manager',
            company: 'InnovateTech',
            expertise: ['Product Management', 'UX Design', 'Career Transitions'],
            availability: '2-4 hours/week',
            rating: 4.8,
            bio: 'Product leader with experience in consumer and enterprise products.',
            isAvailable: true
          }
        ]);

        setMentorshipRequests([
          {
            _id: 'r1',
            mentorId: 'm1',
            mentorName: 'John Smith',
            mentorAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            status: 'pending',
            requestDate: '2023-10-15T14:30:00Z',
            message: 'I would love to get your insights on transitioning from backend to full-stack development.'
          }
        ]);

        setMentorshipSessions([
          {
            _id: 's1',
            mentorId: 'm2',
            mentorName: 'Sarah Johnson',
            mentorAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
            status: 'scheduled',
            scheduledDate: '2023-10-20T15:00:00Z',
            duration: 60,
            topic: 'Product Management Career Path',
            notes: 'Discussion about transitioning into product management roles.'
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

  const handleRequestMentorship = (mentorId: string) => {
    // In a real application, this would send an API request
    const mentor = mentors.find(m => m._id === mentorId);
    if (mentor) {
      const newRequest: MentorshipRequest = {
        _id: `new-${Date.now()}`,
        mentorId: mentor._id,
        mentorName: mentor.name,
        mentorAvatar: mentor.avatar,
        status: 'pending',
        requestDate: new Date().toISOString(),
        message: 'I would like to request mentorship in your area of expertise.'
      };
      setMentorshipRequests(prev => [...prev, newRequest]);
    }
  };

  const handleCancelRequest = (requestId: string) => {
    setMentorshipRequests(prev => 
      prev.map(request => 
        request._id === requestId 
          ? { ...request, status: 'rejected' }
          : request
      )
    );
  };

  const handleTabChange = (tab: 'find' | 'requests' | 'sessions') => {
    setActiveTab(tab);
  };

  const filteredMentors = mentors.filter(mentor => {
    if (!searchQuery) return true;
    return (
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading mentorship data..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Find a Mentor</h1>
        
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search mentors..."
              className="px-4 py-2 pr-10 w-full md:w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <button 
            onClick={() => navigate('/student/dashboard')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px space-x-8">
          <button
            onClick={() => handleTabChange('find')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'find'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Find Mentors
          </button>
          <button
            onClick={() => handleTabChange('requests')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Requests
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
        </nav>
      </div>
      
      {/* Content based on active tab */}
      {activeTab === 'find' && (
        <div>
          <div className="bg-indigo-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-indigo-800 mb-2">Looking for guidance?</h2>
            <p className="text-indigo-600 mb-4">
              Our mentors are experienced professionals ready to help you achieve your goals.
              Browse available mentors below or use the search to find experts in specific areas.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSearchQuery('Web Development')}
                className="px-3 py-1 bg-white text-indigo-700 rounded-full text-sm hover:bg-indigo-100 border border-indigo-200"
              >
                Web Development
              </button>
              <button
                onClick={() => setSearchQuery('Career Guidance')}
                className="px-3 py-1 bg-white text-indigo-700 rounded-full text-sm hover:bg-indigo-100 border border-indigo-200"
              >
                Career Guidance
              </button>
              <button
                onClick={() => setSearchQuery('Product Management')}
                className="px-3 py-1 bg-white text-indigo-700 rounded-full text-sm hover:bg-indigo-100 border border-indigo-200"
              >
                Product Management
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.length === 0 ? (
              <div className="col-span-3 bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">No mentors match your search criteria.</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              filteredMentors.map(mentor => (
                <div key={mentor._id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="h-12 w-12 rounded-full mr-4"
                      />
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{mentor.name}</h3>
                        <p className="text-sm text-gray-600">{mentor.title} at {mentor.company}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>{mentor.availability}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <StarIcon className="h-4 w-4 mr-2" />
                        <span>{mentor.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Areas of Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {mentor.expertise.map(area => (
                          <span
                            key={area}
                            className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{mentor.bio}</p>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleRequestMentorship(mentor._id)}
                        className="flex-1 px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      >
                        Request Mentorship
                      </button>
                      <button
                        onClick={() => navigate(`/student/messages?userId=${mentor._id}`)}
                        className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                      >
                        <ChatBubbleLeftIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'requests' && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">My Mentorship Requests</h2>
          {mentorshipRequests.length === 0 ? (
            <p className="text-gray-500 italic">No mentorship requests at this time.</p>
          ) : (
            <div className="space-y-4">
              {mentorshipRequests.map((request) => (
                <div key={request._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start">
                    <img
                      src={request.mentorAvatar}
                      alt={request.mentorName}
                      className="h-12 w-12 rounded-full mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{request.mentorName}</h3>
                      <p className="text-sm text-gray-500">
                        Requested on {new Date(request.requestDate).toLocaleDateString()}
                      </p>
                      <p className="mt-2 text-gray-700">{request.message}</p>
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
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleCancelRequest(request._id)}
                        className="px-3 py-1.5 border border-red-300 text-red-600 rounded hover:bg-red-50"
                      >
                        Cancel Request
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
          <h2 className="text-lg font-semibold text-gray-800 mb-4">My Mentorship Sessions</h2>
          {mentorshipSessions.length === 0 ? (
            <p className="text-gray-500 italic">No mentorship sessions scheduled.</p>
          ) : (
            <div className="space-y-4">
              {mentorshipSessions.map((session) => (
                <div key={session._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start">
                    <img
                      src={session.mentorAvatar}
                      alt={session.mentorName}
                      className="h-12 w-12 rounded-full mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-900">{session.mentorName}</h3>
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
                      <p className="text-sm text-gray-500 mt-1">
                        <CalendarIcon className="inline h-4 w-4 mr-1" />
                        {new Date(session.scheduledDate).toLocaleString()} ({session.duration} min)
                      </p>
                      <p className="mt-2 text-gray-700 font-medium">{session.topic}</p>
                      {session.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-600">{session.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {session.status === 'scheduled' && (
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => navigate(`/student/messages?userId=${session.mentorId}`)}
                        className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                      >
                        Message
                      </button>
                      <button className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                        Reschedule
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentMentorship; 