import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import RoleBasedRender from '../../components/common/RoleBasedRender';
import LoadingSpinner from '../../components/common/LoadingSpinner';

/**
 * Main Profile page component with role-based views for students and alumni
 */
const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Simulate loading user profile data
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Simulate API call to get profile data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading profile:', error);
        setIsLoading(false);
      }
    };
    
    loadProfileData();
  }, []);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    // Simulate API call to save profile changes
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsEditing(false);
    setIsSaving(false);
  };

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading profile..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <button
          onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}
          disabled={isSaving}
          className={`px-4 py-2 ${
            isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white rounded-md transition-colors`}
        >
          {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <RoleBasedRender
        alumniView={<AlumniProfileView isEditing={isEditing} />}
        studentView={<StudentProfileView isEditing={isEditing} />}
        fallback={
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">Please log in to view your profile.</p>
          </div>
        }
      />
    </div>
  );
};

/**
 * Alumni profile view component
 */
const AlumniProfileView: React.FC<{ isEditing: boolean }> = ({ isEditing }) => {
  // Form state (would be populated from API in a real implementation)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    currentPosition: "Senior Software Engineer at Google",
    industry: "tech",
    yearsOfExperience: 8,
    areasOfExpertise: ["Web Development", "Cloud Computing", "System Design"],
    mentorshipBio: "Experienced software engineer passionate about helping students develop their technical skills and navigate their career paths.",
    availabilityHours: "3-5",
    isAvailableForMentoring: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, area: string) => {
    if (e.target.checked) {
      setFormData(prev => ({
        ...prev,
        areasOfExpertise: [...prev.areasOfExpertise, area]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        areasOfExpertise: prev.areasOfExpertise.filter(a => a !== area)
      }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex-shrink-0">
              {/* Profile image placeholder */}
            </div>
            {isEditing && (
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                Change Photo
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    name="fullName"
                    className={`w-full px-3 py-2 border ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                  {formErrors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-900">{formData.fullName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900">john.doe@example.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Information */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Professional Information</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Position
            </label>
            {isEditing ? (
              <input
                type="text"
                name="currentPosition"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.currentPosition}
                onChange={handleInputChange}
              />
            ) : (
              <p className="text-gray-900">{formData.currentPosition}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            {isEditing ? (
              <select
                name="industry"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.industry}
                onChange={handleInputChange}
              >
                <option value="tech">Technology</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <p className="text-gray-900">Technology</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            {isEditing ? (
              <input
                type="number"
                name="yearsOfExperience"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                min="0"
                max="50"
              />
            ) : (
              <p className="text-gray-900">{formData.yearsOfExperience} years</p>
            )}
          </div>
        </div>
      </section>

      {/* Mentorship Preferences */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Mentorship Preferences</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Areas of Expertise
            </label>
            {isEditing ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Web Development', 'Mobile Development', 'Cloud Computing', 'Machine Learning', 'System Design', 'Career Guidance'].map((area) => (
                  <div key={area} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`expertise-${area.toLowerCase().replace(/\s+/g, '-')}`}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={formData.areasOfExpertise.includes(area)}
                      onChange={(e) => handleCheckboxChange(e, area)}
                    />
                    <label htmlFor={`expertise-${area.toLowerCase().replace(/\s+/g, '-')}`} className="ml-2 block text-sm text-gray-700">
                      {area}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.areasOfExpertise.map(area => (
                  <span key={area} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                    {area}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mentorship Bio
            </label>
            {isEditing ? (
              <textarea
                name="mentorshipBio"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.mentorshipBio}
                onChange={handleInputChange}
              />
            ) : (
              <p className="text-gray-900">
                {formData.mentorshipBio}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            {isEditing ? (
              <div className="space-y-3">
                <select
                  name="availabilityHours"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.availabilityHours}
                  onChange={handleInputChange}
                >
                  <option value="1-2">1-2 hours per week</option>
                  <option value="3-5">3-5 hours per week</option>
                  <option value="5+">5+ hours per week</option>
                </select>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="available-for-mentoring"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={formData.isAvailableForMentoring}
                    onChange={(e) => setFormData(prev => ({ ...prev, isAvailableForMentoring: e.target.checked }))}
                  />
                  <label htmlFor="available-for-mentoring" className="ml-2 block text-sm text-gray-700">
                    I am currently available for new mentoring relationships
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-900">
                  {formData.availabilityHours === "1-2" ? "1-2 hours per week" : 
                   formData.availabilityHours === "3-5" ? "3-5 hours per week" : 
                   "5+ hours per week"}
                </p>
                {formData.isAvailableForMentoring ? (
                  <div className="flex items-center mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <svg className="mr-1.5 h-2 w-2 text-green-600" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      Open to Mentorship
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      <svg className="mr-1.5 h-2 w-2 text-red-600" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      Not Available for Mentorship
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mentorship Availability */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Mentorship Availability</h2>
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`h-4 w-4 rounded-full ${formData.isAvailableForMentoring ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                <h3 className="text-lg font-medium text-gray-800">
                  {formData.isAvailableForMentoring ? 'Open to New Mentorships' : 'Not Currently Available'}
                </h3>
              </div>
              {isEditing && (
                <div className="flex items-center">
                  <label className="mr-2 text-sm text-gray-700" htmlFor="toggle-availability">
                    {formData.isAvailableForMentoring ? 'Available' : 'Unavailable'}
                  </label>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      name="toggle-availability" 
                      id="toggle-availability" 
                      className="sr-only peer"
                      checked={formData.isAvailableForMentoring}
                      onChange={(e) => setFormData(prev => ({ ...prev, isAvailableForMentoring: e.target.checked }))}
                    />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                  </div>
                </div>
              )}
            </div>
            {!isEditing && (
              <p className="mt-2 text-sm text-gray-600">
                {formData.isAvailableForMentoring 
                  ? `You're currently visible to students looking for mentors and can receive new mentorship requests.` 
                  : `You won't receive new mentorship requests until you change your availability status.`}
              </p>
            )}
          </div>

          {isEditing && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Mentorship Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['One-on-one Mentoring', 'Group Mentoring', 'Career Coaching', 'Project-based Mentoring', 'Interview Preparation', 'Resume Review'].map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`mentorship-type-${type.toLowerCase().replace(/\s+/g, '-')}`}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`mentorship-type-${type.toLowerCase().replace(/\s+/g, '-')}`} className="ml-2 block text-sm text-gray-700">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Student Year
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['First Year', 'Second Year', 'Third Year', 'Fourth Year', 'Graduate'].map((year) => (
                    <div key={year} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`student-year-${year.toLowerCase().replace(/\s+/g, '-')}`}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`student-year-${year.toLowerCase().replace(/\s+/g, '-')}`} className="ml-2 block text-sm text-gray-700">
                        {year}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Number of Mentees
                </label>
                <select
                  name="maxMentees"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="1">1 mentee at a time</option>
                  <option value="2">2 mentees at a time</option>
                  <option value="3">3 mentees at a time</option>
                  <option value="4">4 mentees at a time</option>
                  <option value="5">5+ mentees at a time</option>
                </select>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Your Impact</h2>
          <a 
            href="/analytics" 
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
          >
            <span>View Detailed Analytics</span>
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-indigo-900">Students Mentored</h3>
            <p className="text-3xl font-bold text-indigo-700">12</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-900">Resources Shared</h3>
            <p className="text-3xl font-bold text-green-700">24</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-purple-900">Forum Posts</h3>
            <p className="text-3xl font-bold text-purple-700">36</p>
          </div>
        </div>
      </section>
    </div>
  );
};

/**
 * Student profile view component
 */
const StudentProfileView: React.FC<{ isEditing: boolean }> = ({ isEditing }) => {
  // Form state (would be populated from API in a real implementation)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    fullName: "Jane Smith",
    major: "Computer Science",
    year: "3",
    expectedGraduation: "2024-05",
    interestedIndustries: ["Tech", "Finance"],
    careerInterests: "Interested in software development with a focus on cloud computing and distributed systems. Looking for opportunities to work on scalable applications.",
    skills: ["JavaScript", "Python", "React"]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, item: string, field: 'interestedIndustries' | 'skills') => {
    if (e.target.checked) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], item]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter(i => i !== item)
      }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex-shrink-0">
              {/* Profile image placeholder */}
            </div>
            {isEditing && (
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                Change Photo
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    name="fullName"
                    className={`w-full px-3 py-2 border ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                  {formErrors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-900">{formData.fullName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900">jane.smith@example.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Information */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Academic Information</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Major
            </label>
            {isEditing ? (
              <input
                type="text"
                name="major"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.major}
                onChange={handleInputChange}
              />
            ) : (
              <p className="text-gray-900">{formData.major}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            {isEditing ? (
              <select
                name="year"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.year}
                onChange={handleInputChange}
              >
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <p className="text-gray-900">
                {formData.year === "1" ? "First Year" :
                 formData.year === "2" ? "Second Year" :
                 formData.year === "3" ? "Third Year" :
                 formData.year === "4" ? "Fourth Year" : "Other"}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Graduation
            </label>
            {isEditing ? (
              <input
                type="month"
                name="expectedGraduation"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.expectedGraduation}
                onChange={handleInputChange}
              />
            ) : (
              <p className="text-gray-900">
                {new Date(formData.expectedGraduation).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Career Goals */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Career Goals</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interested Industries
            </label>
            {isEditing ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Tech', 'Finance', 'Healthcare', 'Education', 'Consulting', 'Research'].map((industry) => (
                  <div key={industry} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`industry-${industry.toLowerCase()}`}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={formData.interestedIndustries.includes(industry)}
                      onChange={(e) => handleCheckboxChange(e, industry, 'interestedIndustries')}
                    />
                    <label htmlFor={`industry-${industry.toLowerCase()}`} className="ml-2 block text-sm text-gray-700">
                      {industry}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.interestedIndustries.map(industry => (
                  <span key={industry} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                    {industry}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Career Interests
            </label>
            {isEditing ? (
              <textarea
                name="careerInterests"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.careerInterests}
                onChange={handleInputChange}
              />
            ) : (
              <p className="text-gray-900">
                {formData.careerInterests}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Skills & Expertise</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Technical Skills
            </label>
            {isEditing ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git'].map((skill) => (
                  <div key={skill} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={formData.skills.includes(skill)}
                      onChange={(e) => handleCheckboxChange(e, skill, 'skills')}
                    />
                    <label htmlFor={`skill-${skill.toLowerCase().replace(/\s+/g, '-')}`} className="ml-2 block text-sm text-gray-700">
                      {skill}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Progress Tracking */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Your Progress</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Profile Completion</span>
              <span className="text-sm text-gray-500">85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Mentorship Sessions</span>
              <span className="text-sm text-gray-500">4/5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Resources Completed</span>
              <span className="text-sm text-gray-500">12/15</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage; 