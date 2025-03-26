import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { 
  createCategory,
  updateCategory,
  getCategories,
  getCategoryById,
  createTopic,
  updateTopic,
  getTopicById,
  getTopicsByCategory,
  getRecentTopics,
  createReply,
  updateReply,
  markReplyAsAccepted,
  searchTopics
} from '../controllers/forum.controller';

const router = express.Router();

// Category routes
router.post('/categories', authenticateToken, createCategory);
router.put('/categories/:id', authenticateToken, updateCategory);
router.get('/categories', getCategories);
router.get('/categories/:id', getCategoryById);

// Topic routes
router.post('/topics', authenticateToken, createTopic);
router.put('/topics/:id', authenticateToken, updateTopic);
router.get('/topics/:id', getTopicById);
router.get('/categories/:categoryId/topics', getTopicsByCategory);
router.get('/topics/recent', getRecentTopics);
router.get('/topics/search', searchTopics);


// Reply routes
router.post('/replies', authenticateToken, createReply);
router.put('/replies/:id', authenticateToken, updateReply);
router.post('/replies/:id/accept', authenticateToken, markReplyAsAccepted);




export default router; 