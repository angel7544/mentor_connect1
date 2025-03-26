import { Router } from 'express';
import { signup, login, refreshToken, getCurrentUser,subscription,supportContact } from '../controllers/auth.controller';

import { authenticateToken, authenticateRefreshToken } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/subscribe', subscription);
router.post('/support', supportContact);
// Protected routes that require authentication
router.get('/me', authenticateToken, getCurrentUser);
router.post('/refresh-token', authenticateRefreshToken, refreshToken);

export default router; 