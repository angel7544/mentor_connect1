import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { 
  getCurrentProfile, 
  getProfileByUserId, 
  updateProfile, 
  findMentors 
} from '../controllers/profile.controller';

const router = express.Router();

// Get current user's profile
router.get('/me', authenticateToken, getCurrentProfile);

// Get profile by user ID
router.get('/user/:userId', authenticateToken, getProfileByUserId);

// Update profile
router.put('/update', authenticateToken, updateProfile);

// Find mentors
router.get('/mentors', authenticateToken, findMentors);

export default router; 