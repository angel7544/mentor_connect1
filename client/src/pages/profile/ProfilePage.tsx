import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import RoleBasedRender from '../../components/common/RoleBasedRender';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import axios from 'axios';

interface ProfileData {
  profile: {
    avatarUrl?: string;
    bio?: string;
    headline?: string;
    skills?: string[];
    interests?: string[];
    education?: Array<{
      institution: string;
      degree: string;
      fieldOfStudy: string;
      startYear: number;
      endYear?: number;
    }>;
    experience?: Array<{
      title: string;
      company: string;
      startDate: Date;
      endDate?: Date;
      description?: string;
    }>;
    socialLinks?: Array<{
      platform: string;
      url: string;
    }>;
    contactInfo?: {
      email?: string;
      phone?: string;
      linkedIn?: string;
    };
    availability?: {
      mentorshipAvailable: boolean;
      availableHours?: Array<{
        day: string;
        startTime: string;
        endTime: string;
      }>;
    };
    preferences?: {
      contactPreference?: 'email' | 'in-app' | 'both';
      notificationSettings?: {
        email: boolean;
        app: boolean;
      };
      mentorshipTopics?: string[];
    };
  };
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: 'student' | 'alumni' | 'admin';
  };
}

interface ApiResponse {
  profile: ProfileData['profile'];
  user: ProfileData['user'];
}

interface ImageUploadResponse {
  message: string;
  imageUrl: string;
}

const defaultProfileData: ProfileData = {
  profile: {
    avatarUrl: '',
    bio: 'Welcome to your profile! Add your bio here.',
    headline: 'Add a headline to describe yourself',
    skills: ['JavaScript', 'React', 'Node.js'],
    interests: ['Web Development', 'Mobile Development', 'Cloud Computing'],
    education: [
      {
        institution: 'Your University',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        startYear: 2020,
        endYear: 2024
      }
    ],
    experience: [
      {
        title: 'Software Developer',
        company: 'Tech Company',
        startDate: new Date('2023-01-01'),
        description: 'Add your experience description here'
      }
    ],
    socialLinks: [
      {
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/your-profile'
      }
    ],
    contactInfo: {
      email: '',
      phone: '',
      linkedIn: 'https://linkedin.com/in/your-profile'
    },
    availability: {
      mentorshipAvailable: true,
      availableHours: [
        {
          day: 'Monday',
          startTime: '09:00',
          endTime: '17:00'
        }
      ]
    },
    preferences: {
      contactPreference: 'email',
      notificationSettings: {
        email: true,
        app: true
      },
      mentorshipTopics: ['Career Development', 'Technical Skills']
    }
  },
  user: {
    firstName: '',
    lastName: '',
    email: '',
    role: 'student'
  }
};

/**
 * Main Profile page component with role-based views for students and alumni
 */
const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        console.log('Loading profile data...');
        const response = await axios.get<ApiResponse>('/api/profile/me');
        console.log('Profile data received:', response.data);
        
        // Check if we have valid data
        if (!response.data) {
          console.error('No data received from API');
          throw new Error('No data received from API');
        }

        // If no profile exists, use default data with user info
        if (!response.data.profile) {
          console.log('No profile found, using default data');
          const defaultData = {
            ...defaultProfileData,
            user: {
              firstName: user?.firstName || '',
              lastName: user?.lastName || '',
              email: user?.email || '',
              role: user?.role || 'student'
            }
          };
          setProfileData(defaultData);
        } else {
          console.log('Setting profile data from API response');
          // Ensure user data is present
          const userData = response.data.user || {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            role: user?.role || 'student'
          };
          setProfileData({
            ...response.data,
            user: userData
          });
        }
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error loading profile:', error);
        console.error('Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          stack: error.stack
        });
        
        // If profile not found, use default data
        if (error.response?.status === 404) {
          console.log('Profile not found, using default data');
          const defaultData = {
            ...defaultProfileData,
            user: {
              firstName: user?.firstName || '',
              lastName: user?.lastName || '',
              email: user?.email || '',
              role: user?.role || 'student'
            }
          };
          setProfileData(defaultData);
        } else {
          // For other errors, show the error message
          const errorMessage = error.response?.data?.message || error.message || 'Failed to load profile data';
          console.error('Setting error message:', errorMessage);
          setError(errorMessage);
        }
        setIsLoading(false);
      }
    };
    
    if (user) {
      console.log('User found, loading profile data...');
      loadProfileData();
    } else {
      console.log('No user found, not loading profile data');
    }
  }, [user]);

  const handleSaveChanges = async () => {
    if (!profileData) return;
    
    setIsSaving(true);
    setError(null); // Clear any previous errors
    
    try {
      // Format the profile data to match the server's expected structure
      const profileUpdateData = {
        bio: profileData.profile.bio,
        headline: profileData.profile.headline,
        skills: profileData.profile.skills,
        interests: profileData.profile.interests,
        education: profileData.profile.education,
        experience: profileData.profile.experience,
        socialLinks: profileData.profile.socialLinks,
        contactInfo: profileData.profile.contactInfo,
        availability: profileData.profile.availability,
        preferences: profileData.profile.preferences
      };

      console.log('Sending profile update:', profileUpdateData);
      
      try {
        const response = await axios.put<{
          message: string;
          profile: ProfileData['profile'];
          user?: ProfileData['user'];
        }>('/api/profile/update', profileUpdateData);
        
        console.log('Profile update response:', response.data);
        
        // If we get a successful response with profile data, use it directly
        if (response.data && response.data.profile) {
          const updatedData = {
            profile: response.data.profile,
            user: response.data.user || profileData.user // Use existing user data if none provided
          };
          
          console.log('Setting profile data from update response:', updatedData);
          setProfileData(updatedData);
          setIsEditing(false);
          return;
        }
      } catch (updateError: any) {
        console.error('Error in initial profile update:', updateError);
        console.error('Update error details:', {
          status: updateError.response?.status,
          data: updateError.response?.data,
          message: updateError.message
        });
        
        // If the update failed with a server error, throw to the outer catch
        if (updateError.response?.status >= 500) {
          throw updateError;
        }
      }
      
      // If we get here, either the update didn't return profile data or there was a client error
      // Try to reload the profile data as a fallback
      console.log('Reloading profile data after update...');
      try {
        const updatedProfileResponse = await axios.get<ApiResponse>('/api/profile/me');
        console.log('Reloaded profile data:', updatedProfileResponse.data);
        
        if (updatedProfileResponse.data) {
          // Ensure user data is present
          const userData = updatedProfileResponse.data.user || profileData.user;
          
          setProfileData({
            profile: updatedProfileResponse.data.profile || profileData.profile,
            user: userData
          });
          
          setIsEditing(false);
        } else {
          throw new Error('Failed to reload profile after update');
        }
      } catch (reloadError: any) {
        console.error('Error reloading profile:', reloadError);
        throw new Error('Failed to save changes and reload profile');
      }
    } catch (error: any) {
      console.error('Error in handleSaveChanges:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Show the error to the user
      setError(error.response?.data?.message || error.message || 'Failed to save profile changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post<ImageUploadResponse>('/api/profile/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update profile data with new image URL
      if (profileData) {
        setProfileData({
          ...profileData,
          profile: {
            ...profileData.profile,
            avatarUrl: response.data.imageUrl,
          },
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload profile image');
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading profile..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
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
        alumniView={<AlumniProfileView isEditing={isEditing} profileData={profileData} onImageUpload={handleImageUpload} />}
        studentView={<StudentProfileView isEditing={isEditing} profileData={profileData} onImageUpload={handleImageUpload} />}
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
const AlumniProfileView: React.FC<{ isEditing: boolean; profileData: ProfileData; onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void> }> = ({ isEditing, profileData, onImageUpload }) => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    fullName: `${profileData.user?.firstName || ''} ${profileData.user?.lastName || ''}`,
    currentPosition: profileData.profile.experience?.[0]?.title || "",
    industry: "tech", // This would come from a separate field in the profile
    yearsOfExperience: 8, // This would be calculated from experience
    areasOfExpertise: profileData.profile.skills || [],
    mentorshipBio: profileData.profile.bio || "",
    availabilityHours: "3-5",
    isAvailableForMentoring: profileData.profile.availability?.mentorshipAvailable || false
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
            <div className="w-24 h-24 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
              {profileData.profile.avatarUrl ? (
                <img 
                  src={profileData.profile.avatarUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400 text-2xl">
                    {profileData.user?.firstName?.[0] || ''}{profileData.user?.lastName?.[0] || ''}
                  </span>
                </div>
              )}
            </div>
            {isEditing && (
              <label className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageUpload}
                  className="hidden"
                />
              </label>
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
              <p className="text-gray-900">{profileData.user?.email || ''}</p>
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
                {formData.isAvailableForMentoring && (
                  <p className="text-green-600 text-sm">Available for mentoring</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Your Impact</h2>
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
const StudentProfileView: React.FC<{ isEditing: boolean; profileData: ProfileData; onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void> }> = ({ isEditing, profileData, onImageUpload }) => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    fullName: `${profileData.user?.firstName || ''} ${profileData.user?.lastName || ''}`,
    major: profileData.profile.education?.[0]?.fieldOfStudy || "",
    year: "3", // This would come from a separate field in the profile
    expectedGraduation: "2024-05", // This would come from education
    interestedIndustries: profileData.profile.interests || [],
    careerInterests: profileData.profile.bio || "",
    skills: profileData.profile.skills || []
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
            <div className="w-24 h-24 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
              {profileData.profile.avatarUrl ? (
                <img 
                  src={profileData.profile.avatarUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400 text-2xl">
                    {profileData.user?.firstName?.[0] || ''}{profileData.user?.lastName?.[0] || ''}
                  </span>
                </div>
              )}
            </div>
            {isEditing && (
              <label className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageUpload}
                  className="hidden"
                />
              </label>
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
              <p className="text-gray-900">{profileData.user?.email || ''}</p>
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