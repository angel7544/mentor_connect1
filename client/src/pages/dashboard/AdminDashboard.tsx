import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  UserGroupIcon, 
  CalendarIcon, 
  ChatBubbleLeftRightIcon, 
  BookOpenIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  UserIcon,
  ChartBarIcon,
  CogIcon,
  BellIcon
} from '@heroicons/react/24/outline';

interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  totalMentorships: number;
  activeMentorships: number;
  totalEvents: number;
  totalResources: number;
  totalForumTopics: number;
  totalForumReplies: number;
}

interface RecentUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'alumni' | 'admin';
  createdAt: string;
}

interface RecentEvent {
  _id: string;
  title: string;
  startDate: string;
  attendees: number;
  organizer: {
    firstName: string;
    lastName: string;
  };
}

interface RecentReport {
  _id: string;
  type: 'user' | 'content' | 'message' | 'forum';
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  reportedBy: {
    firstName: string;
    lastName: string;
  };
}

// Add API response type interfaces
interface AdminStatsResponse {
  data: PlatformStats;
}

interface AdminUsersResponse {
  data: {
    users: RecentUser[];
  };
}

interface AdminEventsResponse {
  data: {
    events: RecentEvent[];
  };
}

interface AdminReportsResponse {
  data: {
    reports: RecentReport[];
  };
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalMentorships: 0,
    activeMentorships: 0,
    totalEvents: 0,
    totalResources: 0,
    totalForumTopics: 0,
    totalForumReplies: 0
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, these would be actual API calls
        // For now, we'll simulate the data
        
        // Fetch platform stats
        const statsResponse = await axios.get<AdminStatsResponse>('/api/admin/stats');
        setStats(statsResponse.data.data);
        
        // Fetch recent users
        const usersResponse = await axios.get<AdminUsersResponse>('/api/admin/users/recent');
        setRecentUsers(usersResponse.data.data.users);
        
        // Fetch recent events
        const eventsResponse = await axios.get<AdminEventsResponse>('/api/admin/events/recent');
        setRecentEvents(eventsResponse.data.data.events);
        
        // Fetch recent reports
        const reportsResponse = await axios.get<AdminReportsResponse>('/api/admin/reports/recent');
        setRecentReports(reportsResponse.data.data.reports);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
        
        // For demo purposes, set mock data
        setStats({
          totalUsers: 256,
          activeUsers: 178,
          totalMentorships: 87,
          activeMentorships: 42,
          totalEvents: 24,
          totalResources: 115,
          totalForumTopics: 93,
          totalForumReplies: 427
        });
        
        setRecentUsers([
          {
            _id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'student',
            createdAt: new Date(Date.now() - 2 * 86400000).toISOString() // 2 days ago
          },
          {
            _id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            role: 'alumni',
            createdAt: new Date(Date.now() - 3 * 86400000).toISOString() // 3 days ago
          },
          {
            _id: '3',
            firstName: 'Robert',
            lastName: 'Johnson',
            email: 'robert.j@example.com',
            role: 'student',
            createdAt: new Date(Date.now() - 5 * 86400000).toISOString() // 5 days ago
          },
          {
            _id: '4',
            firstName: 'Emily',
            lastName: 'Williams',
            email: 'emily.w@example.com',
            role: 'alumni',
            createdAt: new Date(Date.now() - 7 * 86400000).toISOString() // 7 days ago
          }
        ]);
        
        setRecentEvents([
          {
            _id: '1',
            title: 'Tech Career Fair',
            startDate: new Date(Date.now() + 7 * 86400000).toISOString(), // 7 days from now
            attendees: 45,
            organizer: {
              firstName: 'Michael',
              lastName: 'Brown'
            }
          },
          {
            _id: '2',
            title: 'Resume Workshop',
            startDate: new Date(Date.now() + 3 * 86400000).toISOString(), // 3 days from now
            attendees: 28,
            organizer: {
              firstName: 'Sarah',
              lastName: 'Johnson'
            }
          },
          {
            _id: '3',
            title: 'Alumni Networking Mixer',
            startDate: new Date(Date.now() + 14 * 86400000).toISOString(), // 14 days from now
            attendees: 62,
            organizer: {
              firstName: 'David',
              lastName: 'Chen'
            }
          }
        ]);
        
        setRecentReports([
          {
            _id: '1',
            type: 'forum',
            reason: 'Inappropriate content in forum post',
            status: 'pending',
            createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), // 1 day ago
            reportedBy: {
              firstName: 'Alex',
              lastName: 'Taylor'
            }
          },
          {
            _id: '2',
            type: 'user',
            reason: 'Spam messages from user',
            status: 'pending',
            createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
            reportedBy: {
              firstName: 'Jessica',
              lastName: 'Lee'
            }
          }
        ]);
      }
    };
    
    fetchDashboardData();
  }, []);

  const handleResolveReport = async (reportId: string) => {
    try {
      await axios.put(`/api/admin/reports/${reportId}`, { status: 'resolved' });
      
      // Update the UI
      setRecentReports(prevReports => 
        prevReports.map(report => 
          report._id === reportId ? { ...report, status: 'resolved' } : report
        )
      );
      
    } catch (err) {
      console.error('Error resolving report:', err);
      // Show error message to user
    }
  };

  const handleDismissReport = async (reportId: string) => {
    try {
      await axios.put(`/api/admin/reports/${reportId}`, { status: 'dismissed' });
      
      // Update the UI
      setRecentReports(prevReports => 
        prevReports.map(report => 
          report._id === reportId ? { ...report, status: 'dismissed' } : report
        )
      );
      
    } catch (err) {
      console.error('Error dismissing report:', err);
      // Show error message to user
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <Link 
            to="/admin/settings" 
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
          >
            <CogIcon className="h-5 w-5 mr-1" />
            Settings
          </Link>
          <Link 
            to="/admin/notifications" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <BellIcon className="h-5 w-5 mr-1" />
            Notifications
          </Link>
        </div>
      </div>
      
      {/* Platform Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-2">
            <UserGroupIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-gray-700 font-medium">Users</h3>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-2">
            <AcademicCapIcon className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-gray-700 font-medium">Mentorships</h3>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMentorships}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.activeMentorships}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-2">
            <CalendarIcon className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-gray-700 font-medium">Events</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
          <p className="text-sm text-gray-500">Total Events</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-2">
            <BookOpenIcon className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="text-gray-700 font-medium">Resources</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalResources}</p>
          <p className="text-sm text-gray-500">Total Resources</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow col-span-1 lg:col-span-2">
          <div className="border-b px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Recent Users</h2>
            <Link to="/admin/users" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </Link>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentUsers.map(user => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : user.role === 'alumni'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link to={`/admin/users/${user._id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                          View
                        </Link>
                        <Link to={`/admin/users/${user._id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Recent Reports</h2>
            <Link to="/admin/reports" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </Link>
          </div>
          
          <div className="p-6">
            {recentReports.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending reports</p>
            ) : (
              <div className="space-y-4">
                {recentReports.map(report => (
                  <div key={report._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          report.type === 'user' 
                            ? 'bg-red-100 text-red-800' 
                            : report.type === 'forum'
                              ? 'bg-yellow-100 text-yellow-800'
                              : report.type === 'message'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                          {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                        </span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          report.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : report.status === 'resolved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">{report.reason}</p>
                    
                    <p className="text-xs text-gray-500 mb-3">
                      Reported by: {report.reportedBy.firstName} {report.reportedBy.lastName}
                    </p>
                    
                    {report.status === 'pending' && (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleDismissReport(report._id)}
                          className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleResolveReport(report._id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          Resolve
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recent Events */}
      <div className="bg-white rounded-lg shadow mt-6">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
          <Link to="/admin/events" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All
          </Link>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organizer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendees
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentEvents.map(event => (
                  <tr key={event._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(event.startDate).toLocaleDateString()} at {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {event.organizer.firstName} {event.organizer.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.attendees}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/admin/events/${event._id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                        View
                      </Link>
                      <Link to={`/admin/events/${event._id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow mt-6">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/users/create" className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
              <UserIcon className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-gray-700">Add User</span>
            </Link>
            
            <Link to="/admin/events/create" className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
              <CalendarIcon className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-gray-700">Create Event</span>
            </Link>
            
            <Link to="/admin/resources/create" className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
              <BookOpenIcon className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-gray-700">Add Resource</span>
            </Link>
            
            <Link to="/admin/reports" className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
              <ShieldCheckIcon className="h-8 w-8 text-red-600 mb-2" />
              <span className="text-gray-700">Manage Reports</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 