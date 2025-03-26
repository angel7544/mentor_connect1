import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import RoleBasedRender from '../../components/common/RoleBasedRender';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AuthDebug from '../../components/common/AuthDebug';

/**
 * Main Dashboard page component with role-based views for students and alumni
 */
const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate API call to fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    
    fetchDashboardData();
  }, []);

 

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading dashboard..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
    
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.firstName || 'User'}</h1>
          <p className="text-gray-600 mt-1">Here's what's happening in your network</p>
        </div>
        
        <RoleBasedRender
          alumniView={
            <Link to="/schedule">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors mt-4 md:mt-0">
                Schedule Mentorship Session
              </button>
            </Link>
          }
          studentView={
            <Link to="/mentorship">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors mt-4 md:mt-0">
                Connect with Alumni
              </button>
            </Link>
          }
          fallback={null}
        />
      </div>

      {/* Role-based dashboard - conditionally render based on authentication */}
      {isAuthenticated ? (
        user?.role === 'alumni' ? (
          <AlumniDashboard />
        ) : user?.role === 'student' ? (
          <StudentDashboard />
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in to access your dashboard</h3>
          <p className="text-gray-600">
            Join our community to connect with alumni and students.
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Alumni Dashboard Component
 */
const AlumniDashboard: React.FC = () => {
  // Sample data for alumni dashboard
  const stats = {
    menteeCount: 3,
    messageCount: 12,
    eventCount: 2,
    completedMentorships: 5
  };

  const upcomingEvents = [
    {
      id: '1',
      title: 'Tech Industry Career Panel',
      date: new Date(2024, 3, 25, 16, 0),
      role: 'Speaker',
      attendees: 32
    },
    {
      id: '2',
      title: 'Resume Review Workshop',
      date: new Date(2024, 3, 28, 14, 30),
      role: 'Host',
      attendees: 18
    }
  ];

  const mentorshipRequests = [
    {
      id: '1',
      studentName: 'Priya Patel',
      studentAvatar: '',
      requestDate: new Date(2024, 3, 20),
      interests: ['Backend Development', 'Career Advice']
    },
    {
      id: '2',
      studentName: 'Jordan Lee',
      studentAvatar: '',
      requestDate: new Date(2024, 3, 19),
      interests: ['Interview Preparation', 'Resume Review']
    }
  ];

  const recentMessages = [
    {
      id: '1',
      from: 'Taylor Wilson',
      avatar: '',
      preview: "Thanks for the career advice yesterday! I've updated my resume as you suggested...",
      date: new Date(2024, 3, 21, 9, 45)
    },
    {
      id: '2',
      from: 'Emma Davis',
      avatar: '',
      preview: "I wanted to follow up on our last meeting. Could we schedule another session to...",
      date: new Date(2024, 3, 20, 15, 30)
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Stats Section */}
      <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Mentees"
          value={stats.menteeCount}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          }
          bgColor="bg-blue-500"
        />
        <StatCard
          title="Unread Messages"
          value={stats.messageCount}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
          }
          bgColor="bg-purple-500"
        />
        <StatCard
          title="Upcoming Events"
          value={stats.eventCount}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          }
          bgColor="bg-green-500"
        />
        <StatCard
          title="Completed Mentorships"
          value={stats.completedMentorships}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          }
          bgColor="bg-yellow-500"
        />
      </div>

      {/* Mentorship Requests */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
          </svg>
          Mentorship Requests
        </h2>
        {mentorshipRequests.length > 0 ? (
          <div className="space-y-4">
            {mentorshipRequests.map(request => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{request.studentName}</h3>
                    <p className="text-xs text-gray-500">
                      Requested on {request.requestDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {request.interests.map((interest, index) => (
                    <span key={index} className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                      {interest}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex space-x-2">
                  <button className="flex-1 px-3 py-1 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                    Accept
                  </button>
                  <button className="flex-1 px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No pending mentorship requests</p>
        )}
        <Link to="/mentorship" className="block mt-4 text-sm text-indigo-600 hover:text-indigo-800">
          View all requests →
        </Link>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          Upcoming Events
        </h2>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                <div className="mt-2 flex justify-between text-xs">
                  <span className="text-gray-500">
                    {event.date.toLocaleString([], { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit'
                    })}
                  </span>
                  <span className="text-indigo-600 font-medium">
                    {event.role}
                  </span>
                </div>
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                  {event.attendees} registered attendees
                </div>
                <div className="mt-3 flex space-x-2">
                  <button className="flex-1 px-3 py-1 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                    Manage Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No upcoming events</p>
        )}
        <Link to="/events" className="block mt-4 text-sm text-indigo-600 hover:text-indigo-800">
          View all events →
        </Link>
      </div>

      {/* Recent Messages */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
          Recent Messages
        </h2>
        {recentMessages.length > 0 ? (
          <div className="space-y-4">
            {recentMessages.map(message => (
              <div key={message.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{message.from}</h3>
                    <p className="text-xs text-gray-500">
                      {message.date.toLocaleString([], { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{message.preview}</p>
                <div className="mt-3">
                  <button className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No recent messages</p>
        )}
        <Link to="/messages" className="block mt-4 text-sm text-indigo-600 hover:text-indigo-800">
          View all messages →
        </Link>
      </div>
    </div>
  );
};

/**
 * Student Dashboard Component
 */
const StudentDashboard: React.FC = () => {
  // Sample data for student dashboard
  const stats = {
    upcomingEvents: 3,
    unreadMessages: 5,
    resourcesSaved: 12,
    activeMentors: 2
  };

  const recommendedMentors = [
    {
      id: '1',
      name: 'Michael Chen',
      avatar: '',
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      matchPercentage: 95,
      expertise: ['React', 'Node.js', 'System Design']
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      avatar: '',
      title: 'Product Manager',
      company: 'InnovateTech',
      matchPercentage: 87,
      expertise: ['Product Strategy', 'UX/UI', 'Career Advice']
    }
  ];

  const upcomingEvents = [
    {
      id: '1',
      title: 'Tech Industry Career Panel',
      date: new Date(2024, 3, 25, 16, 0),
      type: 'Workshop',
      hostName: 'Alumni Association'
    },
    {
      id: '2',
      title: 'Resume Review Workshop',
      date: new Date(2024, 3, 28, 14, 30),
      type: 'Workshop',
      hostName: 'Career Services'
    },
    {
      id: '3',
      title: 'Mock Technical Interviews',
      date: new Date(2024, 4, 5, 10, 0),
      type: 'One-on-One',
      hostName: 'CS Department'
    }
  ];

  const recommendedResources = [
    {
      id: '1',
      title: 'Frontend Development Roadmap 2024',
      type: 'Guide',
      author: 'Michael Chen',
      rating: 4.9,
      tags: ['Web Development', 'Career']
    },
    {
      id: '2',
      title: 'Mastering the Technical Interview',
      type: 'Course',
      author: 'Emma Davis',
      rating: 4.8,
      tags: ['Interviews', 'Algorithms']
    },
    {
      id: '3',
      title: 'Building Your Professional Network',
      type: 'Article',
      author: 'Sarah Johnson',
      rating: 4.7,
      tags: ['Networking', 'Career']
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Stats Section */}
      <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          }
          bgColor="bg-green-500"
        />
        <StatCard
          title="Unread Messages"
          value={stats.unreadMessages}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
          }
          bgColor="bg-purple-500"
        />
        <StatCard
          title="Saved Resources"
          value={stats.resourcesSaved}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
            </svg>
          }
          bgColor="bg-yellow-500"
        />
        <StatCard
          title="Active Mentors"
          value={stats.activeMentors}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          }
          bgColor="bg-blue-500"
        />
      </div>

      {/* Recommended Mentors */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          Recommended Mentors
        </h2>
        {recommendedMentors.length > 0 ? (
          <div className="space-y-4">
            {recommendedMentors.map(mentor => (
              <div key={mentor.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium text-gray-900">{mentor.name}</h3>
                    <p className="text-xs text-gray-500">
                      {mentor.title} at {mentor.company}
                    </p>
                  </div>
                  <div className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {mentor.matchPercentage}% Match
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {mentor.expertise.map((skill, index) => (
                    <span key={index} className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-3">
                  <button className="w-full px-3 py-1 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No mentor recommendations available</p>
        )}
        <Link to="/mentorship" className="block mt-4 text-sm text-indigo-600 hover:text-indigo-800">
          View all mentors →
        </Link>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          Upcoming Events
        </h2>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                <div className="mt-2 flex justify-between text-xs">
                  <span className="text-gray-500">
                    {event.date.toLocaleString([], { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit'
                    })}
                  </span>
                  <span className="text-indigo-600 font-medium">
                    {event.type}
                  </span>
                </div>
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Hosted by {event.hostName}
                </div>
                <div className="mt-3 flex space-x-2">
                  <button className="flex-1 px-3 py-1 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                    Register
                  </button>
                  <button className="flex-1 px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                    More Info
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No upcoming events</p>
        )}
        <Link to="/events" className="block mt-4 text-sm text-indigo-600 hover:text-indigo-800">
          View all events →
        </Link>
      </div>

      {/* Recommended Resources */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          Recommended Resources
        </h2>
        {recommendedResources.length > 0 ? (
          <div className="space-y-4">
            {recommendedResources.map(resource => (
              <div key={resource.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium text-gray-900">{resource.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    resource.type === 'Guide' ? 'bg-blue-100 text-blue-800' :
                    resource.type === 'Course' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {resource.type}
                  </span>
                </div>
                <div className="mt-2 flex justify-between text-xs">
                  <span className="text-gray-500">
                    By {resource.author}
                  </span>
                  <span className="flex items-center text-yellow-500">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    {resource.rating}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {resource.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex space-x-2">
                  <button className="flex-1 px-3 py-1 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                    View Resource
                  </button>
                  <button className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No recommended resources</p>
        )}
        <Link to="/resources" className="block mt-4 text-sm text-indigo-600 hover:text-indigo-800">
          View all resources →
        </Link>
      </div>
    </div>
  );
};

/**
 * Stat Card Component
 */
const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
}> = ({ title, value, icon, bgColor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full ${bgColor} opacity-10 -mr-6 -mt-6`}></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className={`p-2.5 rounded-lg ${bgColor} text-white`}>
            {icon}
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default DashboardPage; 