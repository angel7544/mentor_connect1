"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const message_controller_1 = require("../controllers/message.controller");
const router = express_1.default.Router();
// Send a message
router.post('/send', auth_middleware_1.authenticateToken, message_controller_1.sendMessage);
// Get conversations for a user
router.get('/conversations', auth_middleware_1.authenticateToken, message_controller_1.getConversations);
// Get messages for a specific conversation
router.get('/conversations/:conversationId', auth_middleware_1.authenticateToken, message_controller_1.getConversationMessages);
// Mark a message as read
router.put('/:messageId/read', auth_middleware_1.authenticateToken, message_controller_1.markMessageAsRead);
// Get unread message count
router.get('/unread/count', auth_middleware_1.authenticateToken, message_controller_1.getUnreadMessageCount);
// Get recent messages for dashboard
router.get('/recent', auth_middleware_1.authenticateToken, message_controller_1.getRecentMessages);
exports.default = router;
