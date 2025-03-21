import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ChartBarIcon, EyeIcon, HeartIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface ResourceData {
  _id: string;
  title: string;
  type: 'article' | 'video' | 'book' | 'course' | 'tool';
  createdBy: {
    name: string;
    avatar: string;
    role: 'student' | 'alumni';
  };
  createdAt: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
}

interface ViewData {
  date: string;
  count: number;
}

interface UserSegment {
  segment: string;
  percentage: number;
}

const ResourceActivity: React.FC = () => {
  const navigate = useNavigate();
  const { resourceId } = useParams<{ resourceId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [resource, setResource] = useState<ResourceData | null>(null);
  const [viewsData, setViewsData] = useState<ViewData[]>([]);
  const [userSegments, setUserSegments] = useState<UserSegment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResourceData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        if (resourceId) {
          setResource({
            _id: resourceId,
            title: 'Introduction to React Hooks',
            type: 'article',
            createdBy: {
              name: 'John Smith',
              avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
              role: 'alumni'
            },
            createdAt: '2023-10-01T10:00:00Z',
            views: 247,
            likes: 56,
            shares: 23,
            comments: 12
          });
          
          setViewsData([
            { date: '2023-10-01', count: 15 },
            { date: '2023-10-02', count: 22 },
            { date: '2023-10-03', count: 18 },
            { date: '2023-10-04', count: 30 },
            { date: '2023-10-05', count: 25 },
            { date: '2023-10-06', count: 42 },
            { date: '2023-10-07', count: 38 },
            { date: '2023-10-08', count: 29 },
            { date: '2023-10-09', count: 28 }
          ]);
          
          setUserSegments([
            { segment: 'First-year Students', percentage: 35 },
            { segment: 'Second-year Students', percentage: 25 },
            { segment: 'Upper-level Students', percentage: 30 },
            { segment: 'Alumni', percentage: 10 }
          ]);
        } else {
          setError('Resource ID not provided');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching resource data:', error);
        setError('Failed to load resource data');
        setIsLoading(false);
      }
    };
    
    fetchResourceData();
  }, [resourceId]);

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading resource analytics..." />;
  }

  if (error || !resource) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-500">{error || 'Resource not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Calculate total views
  const totalViews = viewsData.reduce((sum, day) => sum + day.count, 0);
  
  // Calculate growth (percentage increase from first to last day)
  const firstDayViews = viewsData[0]?.count || 0;
  const lastDayViews = viewsData[viewsData.length - 1]?.count || 0;
  const growthRate = firstDayViews ? ((lastDayViews - firstDayViews) / firstDayViews) * 100 : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resource Analytics</h1>
          <h2 className="text-xl text-gray-600">{resource.title}</h2>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
      
      {/* Resource Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img 
              src={resource.createdBy.avatar} 
              alt={resource.createdBy.name} 
              className="h-12 w-12 rounded-full mr-4"
            />
            <div>
              <h3 className="font-medium">Created by {resource.createdBy.name}</h3>
              <p className="text-sm text-gray-500">
                {new Date(resource.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            resource.type === 'article' ? 'bg-blue-100 text-blue-800' :
            resource.type === 'video' ? 'bg-red-100 text-red-800' :
            resource.type === 'book' ? 'bg-green-100 text-green-800' :
            resource.type === 'course' ? 'bg-purple-100 text-purple-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
          </span>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <EyeIcon className="h-5 w-5 text-gray-600 mr-2" />
              <span className="font-medium">Views</span>
            </div>
            <div className="text-2xl font-bold">{resource.views}</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <HeartIcon className="h-5 w-5 text-gray-600 mr-2" />
              <span className="font-medium">Likes</span>
            </div>
            <div className="text-2xl font-bold">{resource.likes}</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <UserGroupIcon className="h-5 w-5 text-gray-600 mr-2" />
              <span className="font-medium">Shares</span>
            </div>
            <div className="text-2xl font-bold">{resource.shares}</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <ChartBarIcon className="h-5 w-5 text-gray-600 mr-2" />
              <span className="font-medium">Comments</span>
            </div>
            <div className="text-2xl font-bold">{resource.comments}</div>
          </div>
        </div>
      </div>
      
      {/* Views Over Time */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Views Over Time</h3>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-600">Last {viewsData.length} days</p>
            <p className="text-2xl font-bold">{totalViews} total views</p>
          </div>
          <div>
            <p className="text-gray-600">Growth</p>
            <p className={`text-xl font-bold ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growthRate.toFixed(1)}%
            </p>
          </div>
        </div>
        
        {/* Simple Chart Representation */}
        <div className="h-64 flex items-end space-x-2">
          {viewsData.map((day, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-indigo-400 hover:bg-indigo-500 transition-all duration-200 rounded-t"
                style={{ height: `${(day.count / Math.max(...viewsData.map(d => d.count))) * 100}%` }}
              ></div>
              <p className="text-xs text-gray-500 mt-1">{new Date(day.date).getDate()}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* User Segments */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">Audience Breakdown</h3>
        <div className="space-y-4">
          {userSegments.map((segment, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span>{segment.segment}</span>
                <span>{segment.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full"
                  style={{ width: `${segment.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceActivity; 