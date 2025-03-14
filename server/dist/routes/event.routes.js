"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const event_controller_1 = require("../controllers/event.controller");
const router = express_1.default.Router();
// Create a new event
router.post('/', auth_middleware_1.authenticateToken, event_controller_1.createEvent);
// Get all events
router.get('/', event_controller_1.getEvents);
// Get upcoming events
router.get('/upcoming', event_controller_1.getUpcomingEvents);
// Get user's events (events they're attending)
router.get('/my-events', auth_middleware_1.authenticateToken, event_controller_1.getUserEvents);
// Get events organized by the user
router.get('/organized', auth_middleware_1.authenticateToken, event_controller_1.getOrganizedEvents);
// Get a specific event by ID
router.get('/:id', event_controller_1.getEventById);
// Update an event
router.put('/:id', auth_middleware_1.authenticateToken, event_controller_1.updateEvent);
// Delete an event
router.delete('/:id', auth_middleware_1.authenticateToken, event_controller_1.deleteEvent);
// Register for an event
router.post('/:id/register', auth_middleware_1.authenticateToken, event_controller_1.registerForEvent);
// Cancel event registration
router.post('/:id/cancel-registration', auth_middleware_1.authenticateToken, event_controller_1.cancelEventRegistration);
exports.default = router;
