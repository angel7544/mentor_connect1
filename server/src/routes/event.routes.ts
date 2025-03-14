import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { 
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelEventRegistration,
  getUpcomingEvents,
  getUserEvents,
  getOrganizedEvents
} from '../controllers/event.controller';

const router = express.Router();

// Create a new event
router.post('/', authenticateToken, createEvent);

// Get all events
router.get('/', getEvents);

// Get upcoming events
router.get('/upcoming', getUpcomingEvents);

// Get user's events (events they're attending)
router.get('/my-events', authenticateToken, getUserEvents);

// Get events organized by the user
router.get('/organized', authenticateToken, getOrganizedEvents);

// Get a specific event by ID
router.get('/:id', getEventById);

// Update an event
router.put('/:id', authenticateToken, updateEvent);

// Delete an event
router.delete('/:id', authenticateToken, deleteEvent);

// Register for an event
router.post('/:id/register', authenticateToken, registerForEvent);

// Cancel event registration
router.post('/:id/cancel-registration', authenticateToken, cancelEventRegistration);

export default router; 