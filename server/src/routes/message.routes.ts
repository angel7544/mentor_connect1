import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { 
  sendMessage,
  getConversations,
  getConversationMessages,
  markMessageAsRead,
  getUnreadMessageCount,
  getRecentMessages
} from '../controllers/message.controller';

const router = express.Router();

// Send a message
router.post('/send', authenticateToken, sendMessage);

// Get conversations for a user
router.get('/conversations', authenticateToken, getConversations);

// Get messages for a specific conversation
router.get('/conversations/:conversationId', authenticateToken, getConversationMessages);

// Mark a message as read
router.put('/:messageId/read', authenticateToken, markMessageAsRead);

// Get unread message count
router.get('/unread/count', authenticateToken, getUnreadMessageCount);

// Get recent messages for dashboard
router.get('/recent', authenticateToken, getRecentMessages);

export default router; 