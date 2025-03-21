import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface StudentProfileData {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  academicInfo: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    graduationYear: number;
    currentYear: number;
  };
  careerGoals: string[];
  skills: string[];
  interests: string[];
  bio: string;
  lookingFor: string[];
  projectPortfolio: {
    title: string;
    description: string;
    technologies: string[];
    link?: string;
    imageUrl?: string;
  }[];
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
  learningPreferences: {
    mentorshipStyle: string[];
    communicationPreference: string[];
    learningObjectives: string[];
  };
}

const StudentProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<StudentProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<'about' | 'projects' | 'mentorship'>('about');

  // Mock data for demonstration
  const mockProfileData: StudentProfileData = {
    _id: 's1',
    user: {
      firstName: 'Alex',
      lastName: 'Johnson',
      email: 'alex.johnson@example.com',
      avatar: '/path/to/avatar.jpg',
    },
    academicInfo: {
      institution: 'University of Technology',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      graduationYear: 2025,
      currentYear: 2
    },
    careerGoals: [
      'Become a full-stack developer',
      'Work at a tech startup',
      'Develop accessible applications'
    ],
    skills: [
      'JavaScript', 'React', 'Node.js', 'HTML/CSS', 
      'Python', 'Git', 'UI/UX Basics'
    ],
    interests: [
      'Web Development', 'Mobile Apps', 'Artificial Intelligence',
      'Open Source', 'Education Technology'
    ],
    bio: 'Computer Science student passionate about building user-friendly web applications. I enjoy solving complex problems through clean, efficient code. Looking for mentorship to accelerate my learning and prepare for a career in tech.',
    lookingFor: [
      'Career guidance',
      'Technical skill development',
      'Industry insights',
      'Project feedback',
      'Internship advice'
    ],
    projectPortfolio: [
      {
        title: 'Weather Dashboard',
        description: 'A responsive web application that displays weather forecasts using a third-party API. Features include location search, 5-day forecast, and weather maps.',
        technologies: ['React', 'APIs', 'CSS Grid', 'Responsive Design'],
        link: 'https://github.com/alexj/weather-dashboard',
        imageUrl: '/path/to/project-image.jpg'
      },
      {
        title: 'Task Management App',
        description: 'A full-stack application for managing tasks and projects. Includes features like user authentication, task categorization, and progress tracking.',
        technologies: ['MongoDB', 'Express', 'React', 'Node.js'],
        link: 'https://github.com/alexj/task-manager',
        imageUrl: '/path/to/project-image.jpg'
      }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/alexjohnson',
      github: 'https://github.com/alexj',
      twitter: 'https://twitter.com/alex_j_dev',
      portfolio: 'https://alexjohnson.dev'
    },
    learningPreferences: {
      mentorshipStyle: [
        'Regular one-on-one meetings', 
        'Code reviews', 
        'Project-based learning'
      ],
      communicationPreference: [
        'Video calls',
        'Direct messaging',
        'Email'
      ],
      learningObjectives: [
        'Master advanced JavaScript concepts',
        'Learn system design principles',
        'Improve problem-solving skills',
        'Prepare for technical interviews'
      ]
    }
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProfileData(mockProfileData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleSaveProfile = () => {
    // In a real application, this would save the profile data to the database
    setIsEditing(false);
    // Show a success message
  };

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading profile data..." />;
  }

  if (!profileData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Failed to load profile data. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32"></div>
        <div className="px-6 py-4 md:flex md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-24 w-24 rounded-full bg-white border-4 border-white shadow-md overflow-hidden -mt-16">
              {profileData.user.avatar ? (
                <img 
                  src={profileData.user.avatar}
                  alt={`${profileData.user.firstName} ${profileData.user.lastName}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-blue-100 flex items-center justify-center text-blue-500 text-2xl font-bold">
                  {profileData.user.firstName[0]}{profileData.user.lastName[0]}
                </div>
              )}
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {profileData.user.firstName} {profileData.user.lastName}
              </h1>
              <p className="text-gray-600">
                {profileData.academicInfo.degree} in {profileData.academicInfo.fieldOfStudy}
              </p>
              <p className="text-gray-500 text-sm">
                {profileData.academicInfo.institution} | Class of {profileData.academicInfo.graduationYear}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            {isEditing && (
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            )}
            <button
              onClick={() => navigate('/student/dashboard')}
              className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('about')}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === 'about'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === 'projects'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab('mentorship')}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === 'mentorship'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mentorship
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'about' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Bio</h3>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => 
                      setProfileData({...profileData, bio: e.target.value})
                    }
                    className="w-full h-32 p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="text-gray-600">{profileData.bio}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.interests.map((interest, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Career Goals</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {profileData.careerGoals.map((goal, index) => (
                    <li key={index}>{goal}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Connect with {profileData.user.firstName}</h3>
                <div className="flex space-x-4">
                  {profileData.socialLinks.linkedin && (
                    <a 
                      href={profileData.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      LinkedIn
                    </a>
                  )}
                  {profileData.socialLinks.github && (
                    <a 
                      href={profileData.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 hover:underline"
                    >
                      GitHub
                    </a>
                  )}
                  {profileData.socialLinks.twitter && (
                    <a 
                      href={profileData.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      Twitter
                    </a>
                  )}
                  {profileData.socialLinks.portfolio && (
                    <a 
                      href={profileData.socialLinks.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Portfolio
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'projects' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Project Portfolio</h3>
              
              {isEditing && (
                <button
                  className="mb-6 px-4 py-2 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50"
                >
                  + Add New Project
                </button>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profileData.projectPortfolio.map((project, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    {project.imageUrl && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={project.imageUrl} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-medium text-gray-900">{project.title}</h4>
                        {isEditing && (
                          <button className="text-gray-400 hover:text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <p className="mt-2 text-gray-600">{project.description}</p>
                      <div className="mt-3">
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Technologies Used</h5>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech, i) => (
                            <span 
                              key={i} 
                              className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          View Project
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {profileData.projectPortfolio.length === 0 && (
                <div className="bg-gray-50 p-6 text-center rounded-lg">
                  <p className="text-gray-500">No projects added yet.</p>
                  {isEditing && (
                    <button
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add Your First Project
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'mentorship' && (
            <div>
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-blue-900 mb-2">Looking For</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profileData.lookingFor.map((item, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/student/mentorship')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Find a Mentor
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Preferred Mentorship Style</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.learningPreferences.mentorshipStyle.map((style, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {style}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Communication Preferences</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.learningPreferences.communicationPreference.map((pref, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                      >
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Learning Objectives</h3>
                <ul className="space-y-1 list-disc list-inside text-gray-600">
                  {profileData.learningPreferences.learningObjectives.map((objective, index) => (
                    <li key={index}>
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Mentorships</h3>
                <button
                  onClick={() => navigate('/student/mentorship')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  View My Mentors
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile; 