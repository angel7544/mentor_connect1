import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { 
  requestMentorship,
  getMentorshipRequests,
  getMyMentorships,
  getMentorshipById,
  updateMentorshipStatus,
  addMentorshipFeedback
} from '../controllers/mentorship.controller';

const router = express.Router();

// Request a new mentorship
router.post('/request', authenticateToken, requestMentorship);

// Get mentorship requests (for mentors)
router.get('/requests', authenticateToken, getMentorshipRequests);

// Get my mentorships (for mentees)
router.get('/my-mentorships', authenticateToken, getMyMentorships);

// Get a specific mentorship by ID
router.get('/:id', authenticateToken, getMentorshipById);

// Update mentorship status (accept, decline, complete, etc.)
router.put('/:id/status', authenticateToken, updateMentorshipStatus);

// Add feedback to a mentorship
router.post('/:id/feedback', authenticateToken, addMentorshipFeedback);

export default router; 