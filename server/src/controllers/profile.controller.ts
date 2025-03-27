import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { ProfileModel, IProfile } from '../models/profile.model';
import { UserModel } from '../models/user.model';
import path from 'path';

// Get current user's profile
export const getCurrentProfile = async (req: Request, res: Response) => {
  try {
    console.log('Getting current profile for user:', req.user);
    const userId = req.user._id;
    
    // Find profile
    console.log('Looking up profile for user ID:', userId);
    const profile = await ProfileModel.findByUserId(userId);
    
    if (!profile) {
      console.log('No profile found for user:', userId);
      // Create a default profile if none exists
      const defaultProfile = {
        userId: userId,
        bio: 'Welcome to your profile! Add your bio here.',
        headline: 'Add a headline to describe yourself',
        skills: [],
        interests: [],
        education: [],
        experience: [],
        socialLinks: [],
        contactInfo: {},
        availability: {
          mentorshipAvailable: false
        },
        preferences: {
          contactPreference: 'email',
          notificationSettings: {
            email: true,
            app: true
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log('Creating default profile for user:', userId);
      const createdProfile = await ProfileModel.create(defaultProfile);
      console.log('Default profile created:', createdProfile);
      
      return res.status(200).json({ profile: createdProfile });
    }
    
    console.log('Profile found:', profile);
    res.status(200).json({ profile });
  } catch (error) {
    console.error('Error in getCurrentProfile:', error);
    res.status(500).json({
      message: 'Error fetching profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get profile by user ID
export const getProfileByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Find profile
    const profile = await ProfileModel.findByUserId(userId);
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    // Get user's basic info
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove sensitive information
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json({ 
      profile,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ 
      message: 'Error fetching profile', 
      error: error.message 
    });
  }
};

// Create or update profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    console.log('Updating profile for user:', req.user._id);
    console.log('Update data:', req.body);
    
    const userId = req.user._id;
    const profileData = req.body;
    
    // Validate required fields
    if (!profileData) {
      console.error('No profile data provided');
      return res.status(400).json({ message: 'No profile data provided' });
    }
    
    // Find existing profile
    const existingProfile = await ProfileModel.findByUserId(userId);
    console.log('Existing profile:', existingProfile);
    
    if (existingProfile) {
      // Update existing profile
      const updateData = {
        ...profileData,
        updatedAt: new Date()
      };
      console.log('Updating profile with data:', updateData);
      
      const updatedProfile = await ProfileModel.updateByUserId(userId, updateData);
      
      if (!updatedProfile) {
        console.error('Failed to update profile');
        return res.status(400).json({ message: 'Failed to update profile' });
      }
      
      console.log('Profile updated successfully:', updatedProfile);
      
      try {
        // Get user data
        const user = await UserModel.findById(userId);
        if (!user) {
          console.error('User not found after profile update');
          // Still return the updated profile, but without user data
          return res.status(200).json({ 
            message: 'Profile updated successfully, but user data could not be retrieved',
            profile: updatedProfile
          });
        }
        
        // Remove sensitive information
        const { password, ...userWithoutPassword } = user;
        
        return res.status(200).json({ 
          message: 'Profile updated successfully',
          profile: updatedProfile,
          user: userWithoutPassword
        });
      } catch (userError) {
        console.error('Error fetching user data after profile update:', userError);
        // Still return the updated profile, but without user data
        return res.status(200).json({ 
          message: 'Profile updated successfully, but user data could not be retrieved',
          profile: updatedProfile
        });
      }
    } else {
      // Create new profile
      const newProfile: IProfile = {
        userId: new ObjectId(userId),
        ...profileData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log('Creating new profile:', newProfile);
      const createdProfile = await ProfileModel.create(newProfile);
      
      if (!createdProfile) {
        console.error('Failed to create profile');
        return res.status(400).json({ message: 'Failed to create profile' });
      }
      
      try {
        // Get user data
        const user = await UserModel.findById(userId);
        if (!user) {
          console.error('User not found after profile creation');
          // Still return the created profile, but without user data
          return res.status(201).json({ 
            message: 'Profile created successfully, but user data could not be retrieved',
            profile: createdProfile
          });
        }
        
        // Remove sensitive information
        const { password, ...userWithoutPassword } = user;
        
        return res.status(201).json({ 
          message: 'Profile created successfully',
          profile: createdProfile,
          user: userWithoutPassword
        });
      } catch (userError) {
        console.error('Error fetching user data after profile creation:', userError);
        // Still return the created profile, but without user data
        return res.status(201).json({ 
          message: 'Profile created successfully, but user data could not be retrieved',
          profile: createdProfile
        });
      }
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ 
      message: 'Error updating profile', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Find mentors
export const findMentors = async (req: Request, res: Response) => {
  try {
    const { skills, interests, limit, skip } = req.query;
    
    const filters: any = {};
    
    if (skills) {
      filters.skills = Array.isArray(skills) ? skills : [skills as string];
    }
    
    if (interests) {
      filters.interests = Array.isArray(interests) ? interests : [interests as string];
    }
    
    if (limit) {
      filters.limit = parseInt(limit as string);
    }
    
    if (skip) {
      filters.skip = parseInt(skip as string);
    }
    
    const mentors = await ProfileModel.findMentors(filters);
    
    // Get user details for each mentor
    const mentorsWithUserInfo = await Promise.all(
      mentors.map(async (mentor) => {
        const user = await UserModel.findById(mentor.userId);
        
        if (!user) return null;
        
        // Remove sensitive information
        const { password, ...userWithoutPassword } = user;
        
        return {
          profile: mentor,
          user: userWithoutPassword
        };
      })
    );
    
    // Filter out any null values (in case a user was not found)
    const validMentors = mentorsWithUserInfo.filter(m => m !== null);
    
    res.status(200).json({ mentors: validMentors });
  } catch (error) {
    console.error('Error finding mentors:', error);
    res.status(500).json({ 
      message: 'Error finding mentors', 
      error: error.message 
    });
  }
};

// Upload profile image
export const uploadProfileImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const userId = req.user._id;
    const imageUrl = `/uploads/profiles/${req.file.filename}`;

    // Update profile with new image URL
    const result = await ProfileModel.updateByUserId(userId, {
      avatarUrl: imageUrl,
      updatedAt: new Date()
    });

    if (!result) {
      return res.status(400).json({ message: 'Failed to update profile image' });
    }

    res.status(200).json({
      message: 'Profile image uploaded successfully',
      imageUrl
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({
      message: 'Error uploading profile image',
      error: error.message
    });
  }
}; 