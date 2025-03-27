import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { 
  getCurrentProfile, 
  getProfileByUserId, 
  updateProfile, 
  findMentors,
  uploadProfileImage
} from '../controllers/profile.controller';
import { upload } from '../utils/fileUpload';

const router = express.Router();

// Get current user's profile
router.get('/me', authenticateToken, getCurrentProfile);

// Get profile by user ID
router.get('/user/:userId', authenticateToken, getProfileByUserId);

// Update profile
router.put('/update', authenticateToken, updateProfile);

// Upload profile image
router.post('/upload-image', authenticateToken, upload.single('image'), uploadProfileImage);

// Find mentors
router.get('/mentors', authenticateToken, findMentors);

export default router; 