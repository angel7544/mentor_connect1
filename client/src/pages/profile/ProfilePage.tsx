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
      gpa?: string;
      academicStanding?: string;
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

// Add NameChangeDialog component
const NameChangeDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { reason: string; documentUrl: string }) => Promise<void>;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onSubmit({ reason, documentUrl });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit name change request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Request Name Change</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Name Change
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
              rows={3}
              required
              placeholder="Please explain why you need to change your name..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document URL
            </label>
            <input
              type="url"
              value={documentUrl}
              onChange={(e) => setDocumentUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
              required
              placeholder="URL to your official document (e.g., marriage certificate, legal name change document)"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
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
  const [isNameChangeDialogOpen, setIsNameChangeDialogOpen] = useState(false);
  
  // Add handleNameChangeRequest function
  const handleNameChangeRequest = async (data: { reason: string; documentUrl: string }) => {
    try {
      await axios.post('/api/profile/name-change-request', {
        reason: data.reason,
        documentUrl: data.documentUrl
      });
      // Show success message or handle success case
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to submit name change request');
    }
  };

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
        skills: profileData.profile.skills || [],
        interests: profileData.profile.interests || [],
        education: [{
          institution: profileData.profile.education?.[0]?.institution || "",
          degree: profileData.profile.education?.[0]?.degree || "",
          fieldOfStudy: profileData.profile.education?.[0]?.fieldOfStudy || "",
          startYear: profileData.profile.education?.[0]?.startYear || new Date().getFullYear(),
          endYear: profileData.profile.education?.[0]?.endYear || new Date().getFullYear() + 4,
          gpa: profileData.profile.education?.[0]?.gpa || "",
          academicStanding: profileData.profile.education?.[0]?.academicStanding || ""
        }],
        experience: profileData.profile.experience || [],
        socialLinks: profileData.profile.socialLinks || [],
        contactInfo: profileData.profile.contactInfo || {},
        availability: profileData.profile.availability || {
          mentorshipAvailable: false,
          availableHours: []
        },
        preferences: profileData.profile.preferences || {
          contactPreference: 'email',
          notificationSettings: {
            email: true,
            app: true
          },
          mentorshipTopics: []
        }
      };

      console.log('Sending profile update:', profileUpdateData);
      
      try {
        const response = await axios.put<{
          message: string;
          profile: ProfileData['profile'];
          user?: ProfileData['user'];
        }>('/api/profile/update', profileUpdateData);
        
        console.log('Profile update response:', response.data);
        
        if (response.data && response.data.profile) {
          const updatedData = {
            profile: response.data.profile,
            user: response.data.user || profileData.user
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Profile</h1>
            <p className="mt-1 text-sm text-gray-600">Manage your profile information and preferences</p>
          </div>
          <button
            onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}
            disabled={isSaving}
            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isSaving 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md'
            }`}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                {isEditing ? (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Save Changes
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit Profile
                  </>
                )}
              </>
            )}
          </button>
        </div>

        <RoleBasedRender
          alumniView={
            <AlumniProfileView 
              isEditing={isEditing} 
              profileData={profileData} 
              onImageUpload={handleImageUpload}
              onNameChangeRequest={() => setIsNameChangeDialogOpen(true)}
            />
          }
          studentView={
            <StudentProfileView 
              isEditing={isEditing} 
              profileData={profileData} 
              onImageUpload={handleImageUpload}
              onProfileUpdate={setProfileData}
              onNameChangeRequest={() => setIsNameChangeDialogOpen(true)}
            />
          }
          fallback={
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <p className="text-gray-600">Please log in to view your profile.</p>
            </div>
          }
        />
      </div>
      <NameChangeDialog
        isOpen={isNameChangeDialogOpen}
        onClose={() => setIsNameChangeDialogOpen(false)}
        onSubmit={handleNameChangeRequest}
      />
    </div>
  );
};

/**
 * Alumni profile view component
 */
const AlumniProfileView: React.FC<{ 
  isEditing: boolean; 
  profileData: ProfileData; 
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onNameChangeRequest: () => void;
}> = ({ isEditing, profileData, onImageUpload, onNameChangeRequest }) => {
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column - Basic Info & Professional Info */}
      <div className="lg:col-span-4 space-y-6">
        {/* Basic Information */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden ring-2 ring-white shadow-lg">
                    {profileData.profile.avatarUrl ? (
                      <img 
                        src={profileData.profile.avatarUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                        <span className="text-2xl font-semibold text-indigo-600">
                          {profileData.user?.firstName?.[0] || ''}{profileData.user?.lastName?.[0] || ''}
                        </span>
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                      <span className="text-white text-xs font-medium">Change Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        name="fullName"
                        className={`w-full px-3 py-2 rounded-lg border ${
                          formErrors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                        } focus:outline-none focus:ring-2 transition-colors duration-200`}
                        value={formData.fullName}
                        onChange={handleInputChange}
                        readOnly
                      />
                      <button
                        type="button"
                        onClick={onNameChangeRequest}
                        className="px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Request Change
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Name changes require administrative approval. Click "Request Change" to submit a request.
                    </p>
                    {formErrors.fullName && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.fullName}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-900">{formData.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-sm text-gray-900">{profileData.user?.email || ''}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Information */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Professional Info</h2>
              <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Position
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="currentPosition"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
                    value={formData.currentPosition}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-sm text-gray-900">{formData.currentPosition}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                {isEditing ? (
                  <select
                    name="industry"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
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
                  <p className="text-sm text-gray-900 capitalize">{formData.industry}</p>
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    min="0"
                    max="50"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{formData.yearsOfExperience} years</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Middle Column - Mentorship Preferences */}
      <div className="lg:col-span-4 space-y-6">
        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Mentorship Preferences</h2>
              <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Areas of Expertise
                </label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    {['Web Development', 'Mobile Development', 'Cloud Computing', 'Machine Learning', 'System Design', 'Career Guidance'].map((area) => (
                      <div key={area} className="flex items-center p-2 rounded-lg border border-gray-200 hover:border-indigo-500 transition-colors duration-200">
                        <input
                          type="checkbox"
                          id={`expertise-${area.toLowerCase().replace(/\s+/g, '-')}`}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={formData.areasOfExpertise.includes(area)}
                          onChange={(e) => handleCheckboxChange(e, area)}
                        />
                        <label htmlFor={`expertise-${area.toLowerCase().replace(/\s+/g, '-')}`} className="ml-2 block text-xs text-gray-700">
                          {area}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {formData.areasOfExpertise.map(area => (
                      <span key={area} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
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
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
                    value={formData.mentorshipBio}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-sm text-gray-900">
                    {formData.mentorshipBio}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                {isEditing ? (
                  <div className="space-y-2">
                    <select
                      name="availabilityHours"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
                      value={formData.availabilityHours}
                      onChange={handleInputChange}
                    >
                      <option value="1-2">1-2 hours per week</option>
                      <option value="3-5">3-5 hours per week</option>
                      <option value="5+">5+ hours per week</option>
                    </select>
                    <div className="flex items-center p-2 rounded-lg border border-gray-200 hover:border-indigo-500 transition-colors duration-200">
                      <input
                        type="checkbox"
                        id="available-for-mentoring"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        checked={formData.isAvailableForMentoring}
                        onChange={(e) => setFormData(prev => ({ ...prev, isAvailableForMentoring: e.target.checked }))}
                      />
                      <label htmlFor="available-for-mentoring" className="ml-2 block text-xs text-gray-700">
                        Available for mentoring
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-900">
                      {formData.availabilityHours === "1-2" ? "1-2 hours per week" : 
                       formData.availabilityHours === "3-5" ? "3-5 hours per week" : 
                       "5+ hours per week"}
                    </p>
                    {formData.isAvailableForMentoring && (
                      <div className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Available for mentoring
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Right Column - Impact Statistics */}
      <div className="lg:col-span-4 space-y-6">
        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Impact</h2>
              <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-indigo-900">Students Mentored</h3>
                  <div className="p-1.5 bg-indigo-100 rounded-lg">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-indigo-700">12</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-green-900">Resources Shared</h3>
                  <div className="p-1.5 bg-green-100 rounded-lg">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-green-700">24</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-purple-900">Forum Posts</h3>
                  <div className="p-1.5 bg-purple-100 rounded-lg">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-purple-700">36</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

/**
 * Student profile view component
 */
const StudentProfileView: React.FC<{ 
  isEditing: boolean; 
  profileData: ProfileData; 
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onProfileUpdate: (updatedData: ProfileData) => void;
  onNameChangeRequest: () => void;
}> = ({ isEditing, profileData, onImageUpload, onProfileUpdate, onNameChangeRequest }) => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    fullName: `${profileData.user?.firstName || ''} ${profileData.user?.lastName || ''}`,
    major: profileData.profile.education?.[0]?.fieldOfStudy || "",
    year: "3",
    expectedGraduation: "2024-05",
    interestedIndustries: profileData.profile.interests || [],
    careerInterests: profileData.profile.bio || "",
    skills: profileData.profile.skills || [],
    achievements: [
      { title: "Dean's List", year: "2023", description: "Maintained 3.8 GPA" },
      { title: "Hackathon Winner", year: "2023", description: "First place in University Hackathon" }
    ],
    currentInstitution: profileData.profile.education?.[0]?.institution || "",
    gpa: profileData.profile.education?.[0]?.gpa || "3.8",
    academicStanding: profileData.profile.education?.[0]?.academicStanding || "Good Standing",
    expectedDegree: profileData.profile.education?.[0]?.degree || "Bachelor of Science",
    minor: "Data Science",
    relevantCoursework: ["Data Structures", "Algorithms", "Machine Learning", "Web Development"],
    certifications: [
      { name: "AWS Certified Cloud Practitioner", date: "2023-06" },
      { name: "Google Data Analytics Professional Certificate", date: "2023-08" }
    ]
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      fullName: `${profileData.user?.firstName || ''} ${profileData.user?.lastName || ''}`,
      major: profileData.profile.education?.[0]?.fieldOfStudy || "",
      currentInstitution: profileData.profile.education?.[0]?.institution || "",
      interestedIndustries: profileData.profile.interests || [],
      careerInterests: profileData.profile.bio || "",
      skills: profileData.profile.skills || [],
      gpa: profileData.profile.education?.[0]?.gpa || "3.8",
      academicStanding: profileData.profile.education?.[0]?.academicStanding || "Good Standing",
      expectedDegree: profileData.profile.education?.[0]?.degree || "Bachelor of Science"
    }));
  }, [profileData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update the parent component's profileData
    if (profileData) {
      const updatedProfileData = { ...profileData };
      
      switch (name) {
        case 'currentInstitution':
          updatedProfileData.profile.education = [{
            ...updatedProfileData.profile.education?.[0],
            institution: value
          }];
          break;
        case 'major':
          updatedProfileData.profile.education = [{
            ...updatedProfileData.profile.education?.[0],
            fieldOfStudy: value
          }];
          break;
        case 'careerInterests':
          updatedProfileData.profile.bio = value;
          break;
        case 'gpa':
          updatedProfileData.profile.education = [{
            ...updatedProfileData.profile.education?.[0],
            gpa: value
          }];
          break;
        case 'academicStanding':
          updatedProfileData.profile.education = [{
            ...updatedProfileData.profile.education?.[0],
            academicStanding: value
          }];
          break;
        case 'expectedDegree':
          updatedProfileData.profile.education = [{
            ...updatedProfileData.profile.education?.[0],
            degree: value
          }];
          break;
      }
      
      onProfileUpdate(updatedProfileData);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, item: string, field: 'interestedIndustries' | 'skills') => {
    if (e.target.checked) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], item]
      }));
      
      // Update the parent component's profileData
      if (profileData) {
        const updatedProfileData = { ...profileData };
        if (field === 'interestedIndustries') {
          updatedProfileData.profile.interests = [...(updatedProfileData.profile.interests || []), item];
        } else if (field === 'skills') {
          updatedProfileData.profile.skills = [...(updatedProfileData.profile.skills || []), item];
        }
        onProfileUpdate(updatedProfileData);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter(i => i !== item)
      }));
      
      // Update the parent component's profileData
      if (profileData) {
        const updatedProfileData = { ...profileData };
        if (field === 'interestedIndustries') {
          updatedProfileData.profile.interests = updatedProfileData.profile.interests?.filter(i => i !== item) || [];
        } else if (field === 'skills') {
          updatedProfileData.profile.skills = updatedProfileData.profile.skills?.filter(i => i !== item) || [];
        }
        onProfileUpdate(updatedProfileData);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column - Basic Info & Academic Info */}
      <div className="lg:col-span-4 space-y-6">
        {/* Basic Information */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden ring-2 ring-white shadow-lg">
                    {profileData.profile.avatarUrl ? (
                      <img 
                        src={profileData.profile.avatarUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                        <span className="text-2xl font-semibold text-indigo-600">
                          {profileData.user?.firstName?.[0] || ''}{profileData.user?.lastName?.[0] || ''}
                        </span>
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                      <span className="text-white text-xs font-medium">Change Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        name="fullName"
                        className={`w-full px-3 py-2 rounded-lg border ${
                          formErrors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                        } focus:outline-none focus:ring-2 transition-colors duration-200`}
                        value={formData.fullName}
                        onChange={handleInputChange}
                        readOnly
                      />
                      <button
                        type="button"
                        onClick={onNameChangeRequest}
                        className="px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Request Change
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Name changes require administrative approval. Click "Request Change" to submit a request.
                    </p>
                    {formErrors.fullName && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.fullName}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-900">{formData.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-sm text-gray-900">{profileData.user?.email || ''}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Academic Information */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Academic Details</h2>
              <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Institution
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="currentInstitution"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
                    value={formData.currentInstitution}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-sm text-gray-900">{formData.currentInstitution}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Degree Program
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="expectedDegree"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
                    value={formData.expectedDegree}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-sm text-gray-900">{formData.expectedDegree}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Major
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="major"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
                    value={formData.major}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-sm text-gray-900">{formData.major}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minor
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="minor"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
                    value={formData.minor}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-sm text-gray-900">{formData.minor}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GPA
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="gpa"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
                    value={formData.gpa}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-sm text-gray-900">{formData.gpa}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Standing
                </label>
                {isEditing ? (
                  <select
                    name="academicStanding"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
                    value={formData.academicStanding}
                    onChange={handleInputChange}
                  >
                    <option value="Good Standing">Good Standing</option>
                    <option value="Dean's List">Dean's List</option>
                    <option value="Honor Roll">Honor Roll</option>
                    <option value="Academic Probation">Academic Probation</option>
                  </select>
                ) : (
                  <p className="text-sm text-gray-900">{formData.academicStanding}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Middle Column - Career Goals & Skills */}
      <div className="lg:col-span-4 space-y-6">
        {/* Enhanced Career Goals */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Career Goals</h2>
              <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Career Interests
                </label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    {['Software Engineering', 'Data Science', 'Product Management', 'UX Design', 'DevOps', 'Cybersecurity', 'AI/ML', 'Cloud Computing'].map((interest) => (
                      <div key={interest} className="flex items-center p-2 rounded-lg border border-gray-200 hover:border-indigo-500 transition-colors duration-200">
                        <input
                          type="checkbox"
                          id={`interest-${interest.toLowerCase().replace(/\s+/g, '-')}`}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={formData.interestedIndustries.includes(interest)}
                          onChange={(e) => handleCheckboxChange(e, interest, 'interestedIndustries')}
                        />
                        <label htmlFor={`interest-${interest.toLowerCase().replace(/\s+/g, '-')}`} className="ml-2 block text-xs text-gray-700">
                          {interest}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {formData.interestedIndustries.map(interest => (
                      <span key={interest} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Career Statement
                </label>
                {isEditing ? (
                  <textarea
                    name="careerInterests"
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
                    value={formData.careerInterests}
                    onChange={handleInputChange}
                    placeholder="Describe your career goals, aspirations, and what you hope to achieve..."
                  />
                ) : (
                  <p className="text-sm text-gray-900">
                    {formData.careerInterests}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Skills Section */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Skills & Expertise</h2>
              <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technical Skills
                </label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git',
                      'TypeScript', 'Docker', 'AWS', 'MongoDB', 'GraphQL',
                      'Machine Learning', 'Data Analysis', 'UI/UX Design'
                    ].map((skill) => (
                      <div key={skill} className="flex items-center p-2 rounded-lg border border-gray-200 hover:border-indigo-500 transition-colors duration-200">
                        <input
                          type="checkbox"
                          id={`skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={formData.skills.includes(skill)}
                          onChange={(e) => handleCheckboxChange(e, skill, 'skills')}
                        />
                        <label htmlFor={`skill-${skill.toLowerCase().replace(/\s+/g, '-')}`} className="ml-2 block text-xs text-gray-700">
                          {skill}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {formData.skills.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Right Column - Achievements & Certifications */}
      <div className="lg:col-span-4 space-y-6">
        {/* Achievements Section */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Achievements</h2>
              <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
            </div>
            <div className="space-y-4">
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-indigo-900">{achievement.title}</h3>
                    <span className="text-xs text-indigo-600">{achievement.year}</span>
                  </div>
                  <p className="text-sm text-indigo-700">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Certifications</h2>
              <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
            </div>
            <div className="space-y-4">
              {formData.certifications.map((cert, index) => (
                <div key={index} className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-green-900">{cert.name}</h3>
                    <span className="text-xs text-green-600">{cert.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Relevant Coursework */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Relevant Coursework</h2>
              <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.relevantCoursework.map((course, index) => (
                <span key={index} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                  {course}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage; 