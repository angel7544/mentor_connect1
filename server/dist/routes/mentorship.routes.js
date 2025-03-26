"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const mentorship_controller_1 = require("../controllers/mentorship.controller");
const router = express_1.default.Router();
// Request a new mentorship
router.post('/request', auth_middleware_1.authenticateToken, mentorship_controller_1.requestMentorship);
// Get mentorship requests (for mentors)
router.get('/requests', auth_middleware_1.authenticateToken, mentorship_controller_1.getMentorshipRequests);
// Get my mentorships (for mentees)
router.get('/my-mentorships', auth_middleware_1.authenticateToken, mentorship_controller_1.getMyMentorships);
// Get a specific mentorship by ID
router.get('/:id', auth_middleware_1.authenticateToken, mentorship_controller_1.getMentorshipById);
// Update mentorship status (accept, decline, complete, etc.)
router.put('/:id/status', auth_middleware_1.authenticateToken, mentorship_controller_1.updateMentorshipStatus);
// Add feedback to a mentorship
router.post('/:id/feedback', auth_middleware_1.authenticateToken, mentorship_controller_1.addMentorshipFeedback);
exports.default = router;
