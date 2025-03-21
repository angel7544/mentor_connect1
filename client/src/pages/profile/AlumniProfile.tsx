import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface AlumniProfileData {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  graduationYear: number;
  degree: string;
  fieldOfStudy: string;
  currentPosition: string;
  company: string;
  location: string;
  bio: string;
  skills: string[];
  expertise: string[];
  experiences: {
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    description: string;
    isCurrent: boolean;
  }[];
  education: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    graduationYear: number;
  }[];
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
  mentorshipPreferences: {
    isAvailable: boolean;
    areasOfInterest: string[];
    mentorshipStyle: string[];
    availability: string;
    maxMentees: number;
  };
  achievements: string[];
}

const AlumniProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<AlumniProfileData | null>(null);
  const [isMentorshipAvailable, setIsMentorshipAvailable] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'experience' | 'mentorship'>('about');

  // Mock data for demonstration
  const mockProfileData: AlumniProfileData = {
    _id: 'a1',
    user: {
      firstName: 'Jennifer',
      lastName: 'Taylor',
      email: 'jennifer.taylor@example.com',
      avatar: '/path/to/avatar.jpg',
    },
    graduationYear: 2015,
    degree: 'Bachelor of Science',
    fieldOfStudy: 'Computer Science',
    currentPosition: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    bio: 'Passionate software engineer with 8+ years of experience in building scalable web applications. I enjoy mentoring junior developers and sharing my knowledge in software architecture and best practices.',
    skills: [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS', 
      'System Design', 'Agile Methodologies', 'Team Leadership'
    ],
    expertise: [
      'Frontend Development', 'Backend Development', 'Cloud Architecture',
      'Technical Leadership', 'Career Guidance'
    ],
    experiences: [
      {
        title: 'Senior Software Engineer',
        company: 'TechCorp Inc.',
        startDate: '2020-03-01',
        description: 'Leading the development of a scalable SaaS platform. Mentoring junior team members and implementing architecture improvements.',
        isCurrent: true
      },
      {
        title: 'Software Engineer',
        company: 'InnovateTech',
        startDate: '2017-06-01',
        endDate: '2020-02-28',
        description: 'Built and maintained multiple client-facing applications using React and Node.js. Improved system performance by 40%.',
        isCurrent: false
      },
      {
        title: 'Junior Developer',
        company: 'StartupNow',
        startDate: '2015-07-01',
        endDate: '2017-05-30',
        description: 'Developed features for an e-commerce platform. Participated in code reviews and agile development processes.',
        isCurrent: false
      }
    ],
    education: [
      {
        institution: 'Stanford University',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        graduationYear: 2015
      }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/jennifertaylor',
      github: 'https://github.com/jtaylor-dev',
      twitter: 'https://twitter.com/jtaylor_dev',
      portfolio: 'https://jennifertaylor.dev'
    },
    mentorshipPreferences: {
      isAvailable: true,
      areasOfInterest: [
        'Career Transitions', 
        'Software Engineering', 
        'Technical Interviews', 
        'Leadership Skills'
      ],
      mentorshipStyle: [
        'One-on-one meetings', 
        'Code reviews', 
        'Project-based learning'
      ],
      availability: '3-5 hours/week',
      maxMentees: 3
    },
    achievements: [
      'Led engineering team that won Innovation Award 2022',
      'Published technical articles in industry journals',
      'Speaker at React Conf 2021',
      'Open source contributor to popular JavaScript libraries'
    ]
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProfileData(mockProfileData);
        setIsMentorshipAvailable(mockProfileData.mentorshipPreferences.isAvailable);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleToggleMentorship = () => {
    setIsMentorshipAvailable(!isMentorshipAvailable);
    // In a real application, this would update the preference in the database
    if (profileData) {
      setProfileData({
        ...profileData,
        mentorshipPreferences: {
          ...profileData.mentorshipPreferences,
          isAvailable: !isMentorshipAvailable
        }
      });
    }
  };

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
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>
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
                <div className="h-full w-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-2xl font-bold">
                  {profileData.user.firstName[0]}{profileData.user.lastName[0]}
                </div>
              )}
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {profileData.user.firstName} {profileData.user.lastName}
              </h1>
              <p className="text-gray-600">{profileData.currentPosition} at {profileData.company}</p>
              <p className="text-gray-500 text-sm">Class of {profileData.graduationYear}</p>
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
                className="px-4 py-2 bg-indigo-600 rounded-md text-white hover:bg-indigo-700"
              >
                Save Changes
              </button>
            )}
            <button
              onClick={() => navigate('/alumni/dashboard')}
              className="px-4 py-2 bg-indigo-600 rounded-md text-white hover:bg-indigo-700"
            >
              Dashboard
            </button>
          </div>
        </div>
        
        {/* Mentorship Availability Toggle */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Mentorship Availability</h2>
              <p className="text-sm text-gray-500">
                {isMentorshipAvailable
                  ? "You're currently open to mentorship requests."
                  : "You're not accepting mentorship requests at the moment."}
              </p>
            </div>
            <div>
              <button
                onClick={handleToggleMentorship}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  isMentorshipAvailable ? 'bg-indigo-600' : 'bg-gray-300'
                } transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                role="switch"
                aria-checked={isMentorshipAvailable}
              >
                <span className="sr-only">Toggle availability</span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    isMentorshipAvailable ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="ml-2 text-sm font-medium text-gray-900">
                {isMentorshipAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>
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
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === 'experience'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Experience & Education
            </button>
            <button
              onClick={() => setActiveTab('mentorship')}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === 'mentorship'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Areas of Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.expertise.map((area, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Achievements</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {profileData.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
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
                      className="text-indigo-600 hover:underline"
                    >
                      Portfolio
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'experience' && (
            <div>
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Experience</h3>
                <div className="space-y-6">
                  {profileData.experiences.map((experience, index) => (
                    <div key={index} className="border-l-2 border-indigo-200 pl-4 pb-2">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900">{experience.title}</h4>
                        <div>
                          {experience.isCurrent && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2">
                              Current
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600">{experience.company}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(experience.startDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })} - {
                          experience.endDate 
                            ? new Date(experience.endDate).toLocaleDateString('en-US', { 
                                month: 'short', 
                                year: 'numeric' 
                              })
                            : 'Present'
                        }
                      </p>
                      <p className="mt-2 text-gray-600">{experience.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Education</h3>
                <div className="space-y-6">
                  {profileData.education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-indigo-200 pl-4 pb-2">
                      <h4 className="font-medium text-gray-900">{edu.institution}</h4>
                      <p className="text-gray-600">{edu.degree} in {edu.fieldOfStudy}</p>
                      <p className="text-sm text-gray-500">Graduated {edu.graduationYear}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'mentorship' && (
            <div>
              <div className="bg-indigo-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-indigo-900 mb-2">Mentorship Status</h3>
                <p className="text-indigo-700 mb-2">
                  {isMentorshipAvailable 
                    ? "You're currently open to mentoring new students."
                    : "You're not accepting new mentorship requests at this time."}
                </p>
                <button
                  onClick={handleToggleMentorship}
                  className={`px-4 py-2 rounded-md ${
                    isMentorshipAvailable 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-600'
                  }`}
                >
                  {isMentorshipAvailable ? 'Set as Unavailable' : 'Set as Available'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Areas of Interest</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.mentorshipPreferences.areasOfInterest.map((area, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Mentorship Style</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.mentorshipPreferences.mentorshipStyle.map((style, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                      >
                        {style}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Availability</h3>
                  <p className="text-gray-600">{profileData.mentorshipPreferences.availability}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Maximum Mentees</h3>
                  <p className="text-gray-600">{profileData.mentorshipPreferences.maxMentees} active mentees</p>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Manage Your Mentorships</h3>
                <button
                  onClick={() => navigate('/alumni/mentorship')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  View Mentorship Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlumniProfile; 