import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserIcon, 
  CalendarIcon, 
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../../store/authStore';
import axios from 'axios';

interface DashboardStats {
  upcomingSessions: number;
  unreadMessages: number;
  mentorshipMatches: number;
  newEvents: number;
}

interface RecentActivity {
  id: string;
  type: 'message' | 'session' | 'match' | 'event';
  title: string;
  description: string;
  date: string;
  read: boolean;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    upcomingSessions: 0,
    unreadMessages: 0,
    mentorshipMatches: 0,
    newEvents: 0
  });
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // In a real app, these would be actual API calls
        // For now, we'll simulate with mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock stats data
        setStats({
          upcomingSessions: 3,
          unreadMessages: 5,
          mentorshipMatches: user?.role === 'STUDENT' ? 2 : 4,
          newEvents: 2
        });
        
        // Mock activities data
        setActivities([
          {
            id: '1',
            type: 'message',
            title: 'New message from John Doe',
            description: 'Hello, I would like to discuss...',
            date: '2023-12-01T10:30:00',
            read: false
          },
          {
            id: '2',
            type: 'session',
            title: 'Upcoming session with Sarah Smith',
            description: 'Career guidance session',
            date: '2023-12-05T14:00:00',
            read: true
          },
          {
            id: '3',
            type: 'match',
            title: 'New mentorship match',
            description: 'You have been matched with Michael Johnson',
            date: '2023-11-28T09:15:00',
            read: false
          },
          {
            id: '4',
            type: 'event',
            title: 'Tech Industry Webinar',
            description: 'Learn about the latest trends in tech',
            date: '2023-12-10T16:00:00',
            read: true
          }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary-500" />;
      case 'session':
        return <CalendarIcon className="h-5 w-5 text-green-500" />;
      case 'match':
        return <UserIcon className="h-5 w-5 text-purple-500" />;
      case 'event':
        return <AcademicCapIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.firstName} {user?.lastName}!
        </p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Sessions</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.upcomingSessions}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/mentorship" className="font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Unread Messages</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.unreadMessages}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/messages" className="font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {user?.role === 'STUDENT' ? 'Mentor Matches' : 'Mentee Matches'}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.mentorshipMatches}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/mentorship" className="font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AcademicCapIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">New Events</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.newEvents}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/events" className="font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent activity */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          <p className="mt-1 text-sm text-gray-500">Your latest notifications and updates</p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <li key={activity.id} className={`px-4 py-4 sm:px-6 ${!activity.read ? 'bg-primary-50' : ''}`}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-500">{formatDate(activity.date)}</p>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
                No recent activity
              </li>
            )}
          </ul>
        </div>
      </div>
      
      {/* Quick links */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Quick Links</h2>
          <p className="mt-1 text-sm text-gray-500">Frequently used features</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Link
              to="/mentorship"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
            >
              <div className="flex-shrink-0">
                <UserIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">Find Mentors</p>
                <p className="text-sm text-gray-500">Browse and connect with mentors</p>
              </div>
            </Link>
            
            <Link
              to="/messages"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
            >
              <div className="flex-shrink-0">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">Messages</p>
                <p className="text-sm text-gray-500">Chat with your connections</p>
              </div>
            </Link>
            
            <Link
              to="/resources"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
            >
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">Resources</p>
                <p className="text-sm text-gray-500">Access career resources</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 