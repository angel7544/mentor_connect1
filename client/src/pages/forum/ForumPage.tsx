import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import RoleBasedRender from '../../components/common/RoleBasedRender';
import LoadingSpinner from '../../components/common/LoadingSpinner';

/**
 * Main Forum page component with role-based views for students and alumni
 */
const ForumPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading forum discussions..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Forum</h1>
        <div className="flex w-full md:w-auto space-x-4">
          <div className="relative flex-grow md:w-64">
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            New Post
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <ForumDiscussions />
        </div>
        <div className="lg:col-span-1">
          <RoleBasedRender
            alumniView={<AlumniForumSidebar />}
            studentView={<StudentForumSidebar />}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Forum discussions component shared between student and alumni views
 */
const ForumDiscussions: React.FC = () => {
  const [activeTab, setActiveTab] = useState('trending');
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === 'trending'
              ? 'text-indigo-700 border-b-2 border-indigo-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('trending')}
        >
          Trending
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === 'recent'
              ? 'text-indigo-700 border-b-2 border-indigo-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('recent')}
        >
          Recent
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === 'following'
              ? 'text-indigo-700 border-b-2 border-indigo-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('following')}
        >
          Following
        </button>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          {/* Discussion Item */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between">
              <div className="flex space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Job opportunities for CS graduates in fintech
                  </h3>
                  <div className="flex items-center mt-1 space-x-2 text-sm">
                    <span className="text-indigo-600 font-medium">John Smith</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">Alumni</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">2 hours ago</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                  Career
                </span>
              </div>
            </div>
            <p className="mt-3 text-gray-600">
              I've been working in fintech for the past 5 years and wanted to share some insights on current job trends and opportunities for new graduates...
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex space-x-6">
                <button className="flex items-center text-gray-500 hover:text-indigo-600">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                  </svg>
                  <span>42</span>
                </button>
                <button className="flex items-center text-gray-500 hover:text-indigo-600">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                  </svg>
                  <span>18</span>
                </button>
              </div>
              <span className="text-sm text-gray-500">324 views</span>
            </div>
          </div>
          
          {/* Discussion Item */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between">
              <div className="flex space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Preparing for technical interviews at FAANG companies
                  </h3>
                  <div className="flex items-center mt-1 space-x-2 text-sm">
                    <span className="text-indigo-600 font-medium">Emma Wilson</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">Alumni</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">1 day ago</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Interviews
                </span>
              </div>
            </div>
            <p className="mt-3 text-gray-600">
              After going through multiple interview processes at top tech companies, I wanted to share my experience and tips on how to prepare...
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex space-x-6">
                <button className="flex items-center text-gray-500 hover:text-indigo-600">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                  </svg>
                  <span>78</span>
                </button>
                <button className="flex items-center text-gray-500 hover:text-indigo-600">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                  </svg>
                  <span>32</span>
                </button>
              </div>
              <span className="text-sm text-gray-500">527 views</span>
            </div>
          </div>
          
          {/* Discussion Item */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between">
              <div className="flex space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Best resources to learn React Native in 2023
                  </h3>
                  <div className="flex items-center mt-1 space-x-2 text-sm">
                    <span className="text-indigo-600 font-medium">Alex Johnson</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">Student</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">3 days ago</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  Learning
                </span>
              </div>
            </div>
            <p className="mt-3 text-gray-600">
              I'm looking to learn React Native for my final year project. Could anyone recommend good courses, tutorials, or books that are up-to-date?
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex space-x-6">
                <button className="flex items-center text-gray-500 hover:text-indigo-600">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                  </svg>
                  <span>35</span>
                </button>
                <button className="flex items-center text-gray-500 hover:text-indigo-600">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                  </svg>
                  <span>24</span>
                </button>
              </div>
              <span className="text-sm text-gray-500">412 views</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Alumni sidebar for the forum page
 */
const AlumniForumSidebar: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Alumni Contribution</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Posts</span>
            <span className="font-semibold">12</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Replies</span>
            <span className="font-semibold">48</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Likes received</span>
            <span className="font-semibold">124</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Students helped</span>
            <span className="font-semibold">37</span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
          <p className="text-sm text-indigo-700">
            Your contributions have helped 37 students this month. Thank you for your dedication!
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Suggested Topics</h2>
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Industry Insights</h3>
            <p className="text-sm text-gray-600 mt-1">
              Share your professional experience and industry knowledge with students.
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Career Advice</h3>
            <p className="text-sm text-gray-600 mt-1">
              Provide guidance on career paths and professional development.
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Interview Tips</h3>
            <p className="text-sm text-gray-600 mt-1">
              Help students prepare for job interviews with practical tips.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Student Questions</h2>
        <div className="space-y-3">
          <div className="border-l-4 border-yellow-400 pl-3">
            <h3 className="text-sm font-medium text-gray-900">How to prepare for system design interviews?</h3>
            <p className="text-xs text-gray-500 mt-1">
              Posted by Sarah • 3 hours ago • 0 replies
            </p>
          </div>
          <div className="border-l-4 border-yellow-400 pl-3">
            <h3 className="text-sm font-medium text-gray-900">What skills should I focus on for data science roles?</h3>
            <p className="text-xs text-gray-500 mt-1">
              Posted by Michael • 5 hours ago • 1 reply
            </p>
          </div>
          <div className="border-l-4 border-yellow-400 pl-3">
            <h3 className="text-sm font-medium text-gray-900">Best practices for building a professional network?</h3>
            <p className="text-xs text-gray-500 mt-1">
              Posted by James • 1 day ago • 0 replies
            </p>
          </div>
        </div>
        <button className="w-full mt-4 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors text-sm">
          Answer Student Questions
        </button>
      </div>
    </div>
  );
};

/**
 * Student sidebar for the forum page
 */
const StudentForumSidebar: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
        <ul className="space-y-2">
          <li>
            <a href="#" className="text-indigo-600 hover:text-indigo-800 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Ask a Question
            </a>
          </li>
          <li>
            <a href="#" className="text-indigo-600 hover:text-indigo-800 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
              </svg>
              Saved Posts
            </a>
          </li>
          <li>
            <a href="#" className="text-indigo-600 hover:text-indigo-800 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              Connect with Alumni
            </a>
          </li>
        </ul>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Popular Tags</h2>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 cursor-pointer">
            #career
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 cursor-pointer">
            #interviews
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 cursor-pointer">
            #resume
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 cursor-pointer">
            #internships
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 cursor-pointer">
            #programming
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 cursor-pointer">
            #datascience
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 cursor-pointer">
            #webdev
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 cursor-pointer">
            #networking
          </span>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Alumni Spotlights</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Sarah Martinez</h3>
              <p className="text-xs text-gray-500">Senior Software Engineer at Google</p>
              <p className="text-xs text-gray-600 mt-1">
                Graduated 2018, specializing in mobile development and cloud architecture.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">David Wong</h3>
              <p className="text-xs text-gray-500">Product Manager at Microsoft</p>
              <p className="text-xs text-gray-600 mt-1">
                Graduated 2016, expertise in product development and UX design.
              </p>
            </div>
          </div>
          <button className="w-full mt-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm">
            View All Alumni
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForumPage; 