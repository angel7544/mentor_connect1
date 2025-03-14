import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { ProfileModel, IProfile } from '../models/profile.model';
import { UserModel } from '../models/user.model';

// Get current user's profile
export const getCurrentProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    
    // Find profile
    const profile = await ProfileModel.findByUserId(userId);
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.status(200).json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ 
      message: 'Error fetching profile', 
      error: error.message 
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
    const userId = req.user._id;
    const profileData = req.body;
    
    // Find existing profile
    const existingProfile = await ProfileModel.findByUserId(userId);
    
    let result;
    
    if (existingProfile) {
      // Update existing profile
      result = await ProfileModel.updateByUserId(userId, {
        ...profileData,
        updatedAt: new Date()
      });
      
      if (!result) {
        return res.status(400).json({ message: 'Failed to update profile' });
      }
      
      // Get the updated profile
      const updatedProfile = await ProfileModel.findByUserId(userId);
      res.status(200).json({ 
        message: 'Profile updated successfully',
        profile: updatedProfile
      });
    } else {
      // Create new profile
      const newProfile: IProfile = {
        userId: new ObjectId(userId),
        ...profileData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const createdProfile = await ProfileModel.create(newProfile);
      
      res.status(201).json({ 
        message: 'Profile created successfully',
        profile: createdProfile
      });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ 
      message: 'Error updating profile', 
      error: error.message 
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