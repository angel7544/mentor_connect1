import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { MentorshipModel, IMentorship } from '../models/mentorship.model';
import { UserModel } from '../models/user.model';
import { ProfileModel } from '../models/profile.model';

// Request a new mentorship
export const requestMentorship = async (req: Request, res: Response) => {
  try {
    const menteeId = req.user._id;
    const { mentorId, requestMessage, goals, topics, meetingFrequency, meetingPreference } = req.body;
    
    if (!mentorId) {
      return res.status(400).json({ message: 'Mentor ID is required' });
    }
    
    // Check if mentor exists
    const mentor = await UserModel.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    
    // Check if mentor's profile has mentorship availability
    const mentorProfile = await ProfileModel.findByUserId(mentorId);
    if (!mentorProfile?.availability?.mentorshipAvailable) {
      return res.status(400).json({ message: 'Mentor is not available for mentorship' });
    }
    
    // Check if there's already an active mentorship
    const existingMentorship = await MentorshipModel.findActiveMentorships(menteeId);
    const alreadyHasMentorship = existingMentorship.some(m => 
      (m.mentorId.toString() === mentorId && m.menteeId.toString() === menteeId.toString()) && 
      (m.status === 'active' || m.status === 'pending')
    );
    
    if (alreadyHasMentorship) {
      return res.status(400).json({ message: 'You already have a pending or active mentorship with this mentor' });
    }
    
    // Create new mentorship request
    const mentorship: IMentorship = {
      mentorId: new ObjectId(mentorId),
      menteeId: new ObjectId(menteeId),
      status: 'pending',
      requestMessage,
      goals,
      topics,
      meetingFrequency,
      meetingPreference,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const createdMentorship = await MentorshipModel.create(mentorship);
    
    res.status(201).json({
      message: 'Mentorship request sent successfully',
      mentorship: createdMentorship
    });
  } catch (error) {
    console.error('Error requesting mentorship:', error);
    res.status(500).json({
      message: 'Error requesting mentorship',
      error: error.message
    });
  }
};

// Get mentorships where the user is a mentor
export const getMentorshipRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;
    
    const mentorships = await MentorshipModel.findByMentorId(
      userId, 
      status as IMentorship['status']
    );
    
    // Get mentee details for each mentorship
    const mentorshipsWithUsers = await Promise.all(
      mentorships.map(async (mentorship) => {
        const mentee = await UserModel.findById(mentorship.menteeId);
        const menteeProfile = await ProfileModel.findByUserId(mentorship.menteeId);
        
        if (!mentee) return null;
        
        // Remove sensitive information
        const { password, ...menteeWithoutPassword } = mentee;
        
        return {
          ...mentorship,
          mentee: menteeWithoutPassword,
          menteeProfile
        };
      })
    );
    
    // Filter out any null values
    const validMentorships = mentorshipsWithUsers.filter(m => m !== null);
    
    res.status(200).json({ mentorships: validMentorships });
  } catch (error) {
    console.error('Error fetching mentorship requests:', error);
    res.status(500).json({
      message: 'Error fetching mentorship requests',
      error: error.message
    });
  }
};

// Get mentorships where the user is a mentee
export const getMyMentorships = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;
    
    const mentorships = await MentorshipModel.findByMenteeId(
      userId, 
      status as IMentorship['status']
    );
    
    // Get mentor details for each mentorship
    const mentorshipsWithUsers = await Promise.all(
      mentorships.map(async (mentorship) => {
        const mentor = await UserModel.findById(mentorship.mentorId);
        const mentorProfile = await ProfileModel.findByUserId(mentorship.mentorId);
        
        if (!mentor) return null;
        
        // Remove sensitive information
        const { password, ...mentorWithoutPassword } = mentor;
        
        return {
          ...mentorship,
          mentor: mentorWithoutPassword,
          mentorProfile
        };
      })
    );
    
    // Filter out any null values
    const validMentorships = mentorshipsWithUsers.filter(m => m !== null);
    
    res.status(200).json({ mentorships: validMentorships });
  } catch (error) {
    console.error('Error fetching mentorships:', error);
    res.status(500).json({
      message: 'Error fetching mentorships',
      error: error.message
    });
  }
};

// Get a specific mentorship by ID
export const getMentorshipById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const mentorship = await MentorshipModel.findById(id);
    
    if (!mentorship) {
      return res.status(404).json({ message: 'Mentorship not found' });
    }
    
    // Check if user is part of this mentorship
    if (mentorship.mentorId.toString() !== userId.toString() && 
        mentorship.menteeId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to view this mentorship' });
    }
    
    // Get mentor and mentee details
    const mentor = await UserModel.findById(mentorship.mentorId);
    const mentee = await UserModel.findById(mentorship.menteeId);
    const mentorProfile = await ProfileModel.findByUserId(mentorship.mentorId);
    const menteeProfile = await ProfileModel.findByUserId(mentorship.menteeId);
    
    if (!mentor || !mentee) {
      return res.status(404).json({ message: 'User information missing' });
    }
    
    // Remove sensitive information
    const { password: mentorPassword, ...mentorWithoutPassword } = mentor;
    const { password: menteePassword, ...menteeWithoutPassword } = mentee;
    
    res.status(200).json({
      mentorship,
      mentor: mentorWithoutPassword,
      mentee: menteeWithoutPassword,
      mentorProfile,
      menteeProfile
    });
  } catch (error) {
    console.error('Error fetching mentorship:', error);
    res.status(500).json({
      message: 'Error fetching mentorship',
      error: error.message
    });
  }
};

// Update mentorship status (accept, decline, complete, etc.)
export const updateMentorshipStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const userId = req.user._id;
    
    // Get the mentorship
    const mentorship = await MentorshipModel.findById(id);
    
    if (!mentorship) {
      return res.status(404).json({ message: 'Mentorship not found' });
    }
    
    // Check permissions based on the action being taken
    if (status === 'active' || status === 'declined') {
      // Only the mentor can accept or decline
      if (mentorship.mentorId.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Only the mentor can accept or decline a mentorship request' });
      }
    } else if (status === 'canceled') {
      // Only the mentee can cancel their request
      if (mentorship.menteeId.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Only the mentee can cancel a mentorship request' });
      }
    } else if (status === 'completed') {
      // Either mentor or mentee can mark as completed
      if (mentorship.mentorId.toString() !== userId.toString() && 
          mentorship.menteeId.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'You are not authorized to update this mentorship' });
      }
    }
    
    // Update mentorship
    const updateData: Partial<IMentorship> = {
      status: status as IMentorship['status'],
      updatedAt: new Date()
    };
    
    if (notes) {
      updateData.notes = notes;
    }
    
    // If accepting, set the start date
    if (status === 'active') {
      updateData.startDate = new Date();
    }
    
    // If completing, set the end date
    if (status === 'completed') {
      updateData.endDate = new Date();
    }
    
    const updated = await MentorshipModel.updateById(id, updateData);
    
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update mentorship status' });
    }
    
    // Get updated mentorship
    const updatedMentorship = await MentorshipModel.findById(id);
    
    res.status(200).json({
      message: `Mentorship ${status} successfully`,
      mentorship: updatedMentorship
    });
  } catch (error) {
    console.error('Error updating mentorship:', error);
    res.status(500).json({
      message: 'Error updating mentorship',
      error: error.message
    });
  }
};

// Add feedback to a mentorship
export const addMentorshipFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;
    
    if (!rating) {
      return res.status(400).json({ message: 'Rating is required' });
    }
    
    // Get the mentorship
    const mentorship = await MentorshipModel.findById(id);
    
    if (!mentorship) {
      return res.status(404).json({ message: 'Mentorship not found' });
    }
    
    // Check if user is part of this mentorship
    if (mentorship.mentorId.toString() !== userId.toString() && 
        mentorship.menteeId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to add feedback to this mentorship' });
    }
    
    // Determine if this is mentor or mentee feedback
    const isMentor = mentorship.mentorId.toString() === userId.toString();
    
    // Prepare update data
    const feedback = {
      ...(mentorship.feedback || {}),
    };
    
    if (isMentor) {
      feedback.mentorFeedback = {
        rating,
        comment,
        date: new Date()
      };
    } else {
      feedback.menteeFeedback = {
        rating,
        comment,
        date: new Date()
      };
    }
    
    // Update mentorship
    const updated = await MentorshipModel.updateById(id, {
      feedback,
      updatedAt: new Date()
    });
    
    if (!updated) {
      return res.status(400).json({ message: 'Failed to add feedback' });
    }
    
    // Get updated mentorship
    const updatedMentorship = await MentorshipModel.findById(id);
    
    res.status(200).json({
      message: 'Feedback added successfully',
      mentorship: updatedMentorship
    });
  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).json({
      message: 'Error adding feedback',
      error: error.message
    });
  }
}; 