import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface Resource {
  _id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'book' | 'course' | 'tool';
  url: string;
  imageUrl?: string;
  tags: string[];
  createdBy: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  likes: number;
  views: number;
}

const StudentResources: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [resources, setResources] = useState<Resource[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setResources([
          {
            _id: 'r1',
            title: 'Introduction to React',
            description: 'A comprehensive guide to React for beginners',
            type: 'article',
            url: 'https://example.com/react-intro',
            imageUrl: 'https://via.placeholder.com/300x200',
            tags: ['React', 'JavaScript', 'Frontend'],
            createdBy: {
              name: 'John Smith',
              avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
            },
            createdAt: '2023-09-15T10:30:00Z',
            likes: 42,
            views: 215
          },
          {
            _id: 'r2',
            title: 'Mastering Data Structures',
            description: 'Learn essential data structures for technical interviews',
            type: 'video',
            url: 'https://example.com/data-structures',
            imageUrl: 'https://via.placeholder.com/300x200',
            tags: ['Algorithms', 'Computer Science', 'Interview Prep'],
            createdBy: {
              name: 'Sarah Johnson',
              avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
            },
            createdAt: '2023-10-05T14:45:00Z',
            likes: 68,
            views: 427
          }
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setIsLoading(false);
      }
    };
    
    fetchResources();
  }, []);

  const filteredResources = resources.filter(resource => {
    if (filter === 'all') return true;
    return resource.type === filter;
  });

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading resources..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Learning Resources</h1>
        
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('article')}
            className={`px-4 py-2 rounded-md ${
              filter === 'article' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Articles
          </button>
          <button
            onClick={() => setFilter('video')}
            className={`px-4 py-2 rounded-md ${
              filter === 'video' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Videos
          </button>
          <button
            onClick={() => setFilter('book')}
            className={`px-4 py-2 rounded-md ${
              filter === 'book' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Books
          </button>
          <button
            onClick={() => setFilter('course')}
            className={`px-4 py-2 rounded-md ${
              filter === 'course' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => setFilter('tool')}
            className={`px-4 py-2 rounded-md ${
              filter === 'tool' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Tools
          </button>
        </div>
      </div>
      
      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.length === 0 ? (
          <div className="col-span-full p-8 bg-white rounded-lg shadow text-center">
            <p className="text-gray-500">No resources found for the selected filter.</p>
            <button
              onClick={() => setFilter('all')}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              View All Resources
            </button>
          </div>
        ) : (
          filteredResources.map(resource => (
            <div key={resource._id} className="bg-white rounded-lg shadow overflow-hidden">
              {resource.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={resource.imageUrl} 
                    alt={resource.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    resource.type === 'article' ? 'bg-blue-100 text-blue-800' :
                    resource.type === 'video' ? 'bg-red-100 text-red-800' :
                    resource.type === 'book' ? 'bg-green-100 text-green-800' :
                    resource.type === 'course' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <img 
                      src={resource.createdBy.avatar} 
                      alt={resource.createdBy.name} 
                      className="h-8 w-8 rounded-full mr-2"
                    />
                    <span className="text-sm text-gray-700">{resource.createdBy.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(resource.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <span>{resource.views} views</span>
                    <span>{resource.likes} likes</span>
                  </div>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    View Resource
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentResources; 