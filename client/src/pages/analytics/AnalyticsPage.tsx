import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ChartBarIcon, 
  ClockIcon, 
  UserGroupIcon,
  CalendarIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

// Define interfaces for analytics data
interface MentorshipAnalytics {
  totalMentees: number;
  activeMentorships: number;
  completedMentorships: number;
  averageSessionLength: number; // in minutes
  mentorshipHours: number;
  mostPopularTopics: { topic: string; count: number }[];
  satisfactionRating: number; // out of 5
  menteeProgressRates: { high: number; medium: number; low: number };
}

interface ResourceAnalytics {
  totalResourcesShared: number;
  resourceViews: number;
  resourceDownloads: number;
  mostPopularResources: { title: string; views: number; downloads: number }[];
  resourceImpactRating: number; // out of 5
  resourcesByCategory: { category: string; count: number }[];
}

interface EventAnalytics {
  totalEventsHosted: number;
  upcomingEvents: number;
  pastEvents: number;
  totalAttendees: number;
  averageAttendance: number;
  eventSatisfactionRating: number; // out of 5
}

const AnalyticsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'mentorship' | 'resources' | 'events'>('mentorship');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Analytics data states
  const [mentorshipData, setMentorshipData] = useState<MentorshipAnalytics>({
    totalMentees: 0,
    activeMentorships: 0,
    completedMentorships: 0,
    averageSessionLength: 0,
    mentorshipHours: 0,
    mostPopularTopics: [],
    satisfactionRating: 0,
    menteeProgressRates: { high: 0, medium: 0, low: 0 }
  });
  
  const [resourceData, setResourceData] = useState<ResourceAnalytics>({
    totalResourcesShared: 0,
    resourceViews: 0,
    resourceDownloads: 0,
    mostPopularResources: [],
    resourceImpactRating: 0,
    resourcesByCategory: []
  });
  
  const [eventData, setEventData] = useState<EventAnalytics>({
    totalEventsHosted: 0,
    upcomingEvents: 0,
    pastEvents: 0,
    totalAttendees: 0,
    averageAttendance: 0,
    eventSatisfactionRating: 0
  });

  // Check if user is alumni, otherwise redirect
  useEffect(() => {
    if (isAuthenticated && user?.role !== 'alumni') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        
        // In a real implementation, these would be actual API calls
        // For now, we'll use mock data
        
        // Mock mentorship analytics data
        setMentorshipData({
          totalMentees: 15,
          activeMentorships: 4,
          completedMentorships: 11,
          averageSessionLength: 45,
          mentorshipHours: 72,
          mostPopularTopics: [
            { topic: 'Career Guidance', count: 8 },
            { topic: 'Technical Skills', count: 6 },
            { topic: 'Interview Preparation', count: 5 }
          ],
          satisfactionRating: 4.7,
          menteeProgressRates: { high: 60, medium: 30, low: 10 }
        });
        
        // Mock resource analytics data
        setResourceData({
          totalResourcesShared: 24,
          resourceViews: 567,
          resourceDownloads: 203,
          mostPopularResources: [
            { title: 'Interview Preparation Guide', views: 89, downloads: 42 },
            { title: 'Resume Templates', views: 76, downloads: 38 },
            { title: 'Full Stack Development Roadmap', views: 64, downloads: 29 }
          ],
          resourceImpactRating: 4.5,
          resourcesByCategory: [
            { category: 'Technical', count: 10 },
            { category: 'Career', count: 8 },
            { category: 'Academic', count: 6 }
          ]
        });
        
        // Mock event analytics data
        setEventData({
          totalEventsHosted: 12,
          upcomingEvents: 2,
          pastEvents: 10,
          totalAttendees: 342,
          averageAttendance: 28,
          eventSatisfactionRating: 4.6
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, []);

  if (isLoading) {
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Analytics & Impact</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => window.print()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Export Report
          </button>
        </div>
      </div>
      
      {/* Overall Impact Summary */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Impact Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <UserGroupIcon className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-blue-800">Mentorship</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">{mentorshipData.totalMentees}</p>
            <p className="text-sm text-blue-700">Students mentored</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <BookOpenIcon className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="text-lg font-medium text-green-800">Resources</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{resourceData.resourceViews}</p>
            <p className="text-sm text-green-700">Resource views</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <CalendarIcon className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-medium text-purple-800">Events</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600">{eventData.totalAttendees}</p>
            <p className="text-sm text-purple-700">Event attendees</p>
          </div>
        </div>
      </div>
      
      {/* Analytics Tabs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'mentorship'
                ? 'text-blue-700 border-b-2 border-blue-500 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('mentorship')}
          >
            Mentorship Analytics
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'resources'
                ? 'text-green-700 border-b-2 border-green-500 bg-green-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('resources')}
          >
            Resource Analytics
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'events'
                ? 'text-purple-700 border-b-2 border-purple-500 bg-purple-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('events')}
          >
            Event Analytics
          </button>
        </div>
        
        <div className="p-6">
          {/* Mentorship Analytics */}
          {activeTab === 'mentorship' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Active Mentorships</p>
                  <p className="text-xl font-semibold">{mentorshipData.activeMentorships}</p>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Completed Mentorships</p>
                  <p className="text-xl font-semibold">{mentorshipData.completedMentorships}</p>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Average Session Length</p>
                  <p className="text-xl font-semibold">{mentorshipData.averageSessionLength} mins</p>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Total Mentorship Hours</p>
                  <p className="text-xl font-semibold">{mentorshipData.mentorshipHours}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-800 mb-3">Most Popular Topics</h3>
                  <div className="space-y-3">
                    {mentorshipData.mostPopularTopics.map((topic, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{topic.topic}</span>
                        <div className="flex items-center">
                          <div className="w-40 h-4 bg-gray-200 rounded-full overflow-hidden mr-2">
                            <div 
                              className="h-full bg-blue-600" 
                              style={{ width: `${(topic.count / mentorshipData.totalMentees) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{topic.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-800 mb-3">Mentee Progress Rates</h3>
                  <div className="flex items-center mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                      <div className="flex h-4 rounded-full overflow-hidden">
                        <div 
                          className="bg-green-500 h-full" 
                          style={{ width: `${mentorshipData.menteeProgressRates.high}%` }}
                        ></div>
                        <div 
                          className="bg-yellow-500 h-full" 
                          style={{ width: `${mentorshipData.menteeProgressRates.medium}%` }}
                        ></div>
                        <div 
                          className="bg-red-500 h-full" 
                          style={{ width: `${mentorshipData.menteeProgressRates.low}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                      <span>High Progress ({mentorshipData.menteeProgressRates.high}%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                      <span>Medium Progress ({mentorshipData.menteeProgressRates.medium}%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                      <span>Low Progress ({mentorshipData.menteeProgressRates.low}%)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-medium text-gray-800">Mentorship Satisfaction Rating</h3>
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-blue-600 mr-2">{mentorshipData.satisfactionRating}</span>
                    <span className="text-sm text-gray-500">/ 5</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${(mentorshipData.satisfactionRating / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Resource Analytics */}
          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Resources Shared</p>
                  <p className="text-xl font-semibold">{resourceData.totalResourcesShared}</p>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Total Views</p>
                  <p className="text-xl font-semibold">{resourceData.resourceViews}</p>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Total Downloads</p>
                  <p className="text-xl font-semibold">{resourceData.resourceDownloads}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-800 mb-3">Most Popular Resources</h3>
                  <div className="space-y-4">
                    {resourceData.mostPopularResources.map((resource, index) => (
                      <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">{resource.title}</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            {resource.views} views
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-600" 
                              style={{ width: `${(resource.downloads / resource.views) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 ml-2">{resource.downloads} downloads</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-800 mb-3">Resources by Category</h3>
                  <div className="space-y-3">
                    {resourceData.resourcesByCategory.map((category, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{category.category}</span>
                        <div className="flex items-center">
                          <div className="w-40 h-4 bg-gray-200 rounded-full overflow-hidden mr-2">
                            <div 
                              className="h-full bg-green-600" 
                              style={{ width: `${(category.count / resourceData.totalResourcesShared) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{category.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-white border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-medium text-gray-800">Resource Impact Rating</h3>
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-green-600 mr-2">{resourceData.resourceImpactRating}</span>
                    <span className="text-sm text-gray-500">/ 5</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${(resourceData.resourceImpactRating / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Event Analytics */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Total Events Hosted</p>
                  <p className="text-xl font-semibold">{eventData.totalEventsHosted}</p>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Upcoming Events</p>
                  <p className="text-xl font-semibold">{eventData.upcomingEvents}</p>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Past Events</p>
                  <p className="text-xl font-semibold">{eventData.pastEvents}</p>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Average Attendance</p>
                  <p className="text-xl font-semibold">{eventData.averageAttendance}</p>
                </div>
              </div>
              
              <div className="bg-white border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-medium text-gray-800">Event Satisfaction Rating</h3>
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-purple-600 mr-2">{eventData.eventSatisfactionRating}</span>
                    <span className="text-sm text-gray-500">/ 5</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full" 
                    style={{ width: `${(eventData.eventSatisfactionRating / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-white border rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-800 mb-3">Attendance Impact</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Total Students Reached</span>
                  <span className="text-xl font-bold text-purple-600">{eventData.totalAttendees}</span>
                </div>
                <div className="relative pt-6">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                        Student Engagement
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-purple-600">
                        {Math.round((eventData.totalAttendees / (eventData.totalEventsHosted * 50)) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                    <div style={{ width: `${(eventData.totalAttendees / (eventData.totalEventsHosted * 50)) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 