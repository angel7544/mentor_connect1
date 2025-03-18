import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import RoleBasedRender from '../../components/common/RoleBasedRender';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AuthDebug from '../../components/common/AuthDebug';

// Interface for the resource view components
interface ResourceViewProps {
  activeCategory: 'all' | 'technical' | 'career' | 'academic';
  searchQuery: string;
}

/**
 * Main Resources page component with role-based views for students and alumni
 */
const ResourcesPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'all' | 'technical' | 'career' | 'academic'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Simulate API call to fetch resources data
  useEffect(() => {
    const fetchResourcesData = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    
    fetchResourcesData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading resources..." />;
  }


  return (
    <div className="container mx-auto px-4 py-8">
      
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Resource Library</h1>
        
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search resources..."
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>

          {/* Convert RoleBasedRender to explicit conditionals */}
          {isAuthenticated ? (
            user?.role === 'alumni' ? (
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Submit Resource
              </button>
            ) : (
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Bookmark Resources
              </button>
            )
          ) : (
            <button className="px-4 py-2 bg-gray-200 text-gray-500 rounded-md cursor-not-allowed">
              Sign in to Access
            </button>
          )}
        </div>
      </div>

      {/* Category navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          <button
            className={`py-4 px-1 whitespace-nowrap ${
              activeCategory === 'all'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } font-medium text-sm sm:text-base`}
            onClick={() => setActiveCategory('all')}
          >
            All Resources
          </button>
          <button
            className={`py-4 px-1 whitespace-nowrap ${
              activeCategory === 'technical'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } font-medium text-sm sm:text-base`}
            onClick={() => setActiveCategory('technical')}
          >
            Technical Resources
          </button>
          <button
            className={`py-4 px-1 whitespace-nowrap ${
              activeCategory === 'career'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } font-medium text-sm sm:text-base`}
            onClick={() => setActiveCategory('career')}
          >
            Career Resources
          </button>
          <button
            className={`py-4 px-1 whitespace-nowrap ${
              activeCategory === 'academic'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } font-medium text-sm sm:text-base`}
            onClick={() => setActiveCategory('academic')}
          >
            Academic Resources
          </button>
        </nav>
      </div>

      {/* Replace RoleBasedRender with direct conditionals */}
      {isAuthenticated ? (
        user?.role === 'alumni' ? (
          <AlumniResourcesView 
            activeCategory={activeCategory} 
            searchQuery={searchQuery} 
          />
        ) : user?.role === 'student' ? (
          <StudentResourcesView 
            activeCategory={activeCategory} 
            searchQuery={searchQuery} 
          />
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in to access resources</h3>
          <p className="text-gray-600">
            Join our community to discover and share valuable resources.
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Alumni view for the Resources page
 */
const AlumniResourcesView: React.FC<ResourceViewProps> = ({ activeCategory, searchQuery }) => {
  const [activeTab, setActiveTab] = useState('shared');
  
  const handleShareResource = () => {
    // Implement share resource functionality
    console.log("Share resource");
  };
  
  return (
    <div className="space-y-8">
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Share a Resource</h2>
        <p className="text-gray-600 mb-4">
          Share valuable resources with students to help them in their academic and professional journey.
        </p>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resource Title
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Guide to Software Engineering Interviews"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resource Type
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="">Select resource type</option>
              <option value="article">Article</option>
              <option value="video">Video</option>
              <option value="ebook">E-Book</option>
              <option value="course">Course</option>
              <option value="template">Template</option>
              <option value="tool">Tool</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resource URL
            </label>
            <input
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://example.com/resource"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Audience
            </label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="audience-all"
                  name="audience"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="audience-all" className="ml-2 block text-sm text-gray-700">
                  All Students
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="audience-firstyear"
                  name="audience"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="audience-firstyear" className="ml-2 block text-sm text-gray-700">
                  First Year
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="audience-graduating"
                  name="audience"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="audience-graduating" className="ml-2 block text-sm text-gray-700">
                  Graduating
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topics
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['Technical Skills', 'Career Development', 'Interview Prep', 'Internships', 'Research', 'Soft Skills'].map((topic) => (
                <div key={topic} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`topic-${topic.toLowerCase().replace(/\s+/g, '-')}`}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`topic-${topic.toLowerCase().replace(/\s+/g, '-')}`} className="ml-2 block text-sm text-gray-700">
                    {topic}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Provide a brief description of the resource and how it can help students..."
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              handleShareResource();
            }}
          >
            Share Resource
          </button>
        </form>
      </section>
      
      <section className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'shared'
                ? 'text-indigo-700 border-b-2 border-indigo-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('shared')}
          >
            Resources You've Shared
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'saved'
                ? 'text-indigo-700 border-b-2 border-indigo-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('saved')}
          >
            Saved Resources
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'shared' && (
            <div className="space-y-6">
              {/* Shared Resource Item */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Ultimate Guide to Technical Interviews</h3>
                    <p className="text-sm text-gray-500">Shared on May 15, 2023</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors">
                      Edit
                    </button>
                    <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    Article
                  </span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Interview Prep
                  </span>
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                    Career Development
                  </span>
                </div>
                <p className="mt-3 text-gray-600">
                  A comprehensive guide covering all aspects of technical interviews including coding challenges, system design, and behavioral questions.
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <span>42 views</span>
                    <span>18 saves</span>
                  </div>
                  <a 
                    href="https://example.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    View Resource
                  </a>
                </div>
              </div>
              
              {/* Shared Resource Item */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Resume Templates for New Graduates</h3>
                    <p className="text-sm text-gray-500">Shared on April 3, 2023</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors">
                      Edit
                    </button>
                    <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                    Template
                  </span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Career Development
                  </span>
                </div>
                <p className="mt-3 text-gray-600">
                  A collection of ATS-friendly resume templates specifically designed for recent graduates with limited work experience.
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <span>67 views</span>
                    <span>34 saves</span>
                  </div>
                  <a 
                    href="https://example.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    View Resource
                  </a>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'saved' && (
            <div className="text-center py-8 text-gray-500">
              You haven't saved any resources yet.
            </div>
          )}
        </div>
      </section>
      
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Resource Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-indigo-900">Resources Shared</h3>
            <p className="text-3xl font-bold text-indigo-700">8</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-900">Total Views</h3>
            <p className="text-3xl font-bold text-green-700">234</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-purple-900">Student Saves</h3>
            <p className="text-3xl font-bold text-purple-700">87</p>
          </div>
        </div>
      </section>
    </div>
  );
};

/**
 * Student view for the Resources page
 */
const StudentResourcesView: React.FC<ResourceViewProps> = ({ activeCategory, searchQuery }) => {
  const [localCategory, setLocalCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Resources' },
    { id: 'technical', name: 'Technical Skills' },
    { id: 'career', name: 'Career Development' },
    { id: 'interview', name: 'Interview Prep' },
    { id: 'internship', name: 'Internships' },
    { id: 'research', name: 'Research' },
    { id: 'soft', name: 'Soft Skills' }
  ];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-3">Categories</h2>
          <ul className="space-y-1">
            {categories.map(category => (
              <li key={category.id}>
                <button
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    localCategory === category.id
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setLocalCategory(category.id)}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
          
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Recommended for You</h2>
            <div className="space-y-3">
              <div className="border-l-4 border-indigo-400 pl-3">
                <h3 className="text-sm font-medium text-gray-900">Building an Effective LinkedIn Profile</h3>
                <p className="text-xs text-gray-500">Career Development</p>
              </div>
              <div className="border-l-4 border-indigo-400 pl-3">
                <h3 className="text-sm font-medium text-gray-900">Introduction to Data Structures and Algorithms</h3>
                <p className="text-xs text-gray-500">Technical Skills</p>
              </div>
              <div className="border-l-4 border-indigo-400 pl-3">
                <h3 className="text-sm font-medium text-gray-900">Preparing for Behavioral Interviews</h3>
                <p className="text-xs text-gray-500">Interview Prep</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Your Bookmarks</h2>
            <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm">
              View Bookmarks
            </button>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resource Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  E-Book
                </span>
                <button className="text-gray-400 hover:text-indigo-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                  </svg>
                </button>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Cracking the Coding Interview
              </h3>
              <p className="text-sm text-gray-500 mt-1">Shared by Emily Johnson • Alumni</p>
              <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                The complete guide to preparing for coding interviews, covering data structures, algorithms, and problem-solving techniques.
              </p>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex space-x-2">
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                    Technical
                  </span>
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                    Interview
                  </span>
                </div>
                <a 
                  href="https://example.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  View Resource
                </a>
              </div>
            </div>
          </div>
          
          {/* Resource Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center text-white text-4xl">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Video
                </span>
                <button className="text-gray-400 hover:text-indigo-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                  </svg>
                </button>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Web Development Crash Course
              </h3>
              <p className="text-sm text-gray-500 mt-1">Shared by Michael Chen • Alumni</p>
              <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                A beginner-friendly introduction to modern web development covering HTML, CSS, JavaScript, and React.
              </p>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex space-x-2">
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                    Technical
                  </span>
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                    Web
                  </span>
                </div>
                <a 
                  href="https://example.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  View Resource
                </a>
              </div>
            </div>
          </div>
          
          {/* Resource Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center text-white text-4xl">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                  Template
                </span>
                <button className="text-gray-400 hover:text-indigo-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                  </svg>
                </button>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                ATS-Friendly Resume Templates
              </h3>
              <p className="text-sm text-gray-500 mt-1">Shared by Sarah Martinez • Alumni</p>
              <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                Professional resume templates that are optimized for applicant tracking systems and designed for students with limited work experience.
              </p>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex space-x-2">
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                    Career
                  </span>
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                    Job Search
                  </span>
                </div>
                <a 
                  href="https://example.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  View Resource
                </a>
              </div>
            </div>
          </div>
          
          {/* Resource Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center text-white text-4xl">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                  Article
                </span>
                <button className="text-gray-400 hover:text-indigo-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                  </svg>
                </button>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Networking Guide for Introverts
              </h3>
              <p className="text-sm text-gray-500 mt-1">Shared by David Wong • Alumni</p>
              <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                Practical tips and strategies for building meaningful professional connections, especially for those who identify as introverts.
              </p>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex space-x-2">
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                    Soft Skills
                  </span>
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                    Networking
                  </span>
                </div>
                <a 
                  href="https://example.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  View Resource
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage; 