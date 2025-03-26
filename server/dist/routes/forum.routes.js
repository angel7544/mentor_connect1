"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const forum_controller_1 = require("../controllers/forum.controller");
const router = express_1.default.Router();
// Category routes
router.post('/categories', auth_middleware_1.authenticateToken, forum_controller_1.createCategory);
router.put('/categories/:id', auth_middleware_1.authenticateToken, forum_controller_1.updateCategory);
router.get('/categories', forum_controller_1.getCategories);
router.get('/categories/:id', forum_controller_1.getCategoryById);
// Topic routes
router.post('/topics', auth_middleware_1.authenticateToken, forum_controller_1.createTopic);
router.put('/topics/:id', auth_middleware_1.authenticateToken, forum_controller_1.updateTopic);
router.get('/topics/:id', forum_controller_1.getTopicById);
router.get('/categories/:categoryId/topics', forum_controller_1.getTopicsByCategory);
router.get('/topics/recent', forum_controller_1.getRecentTopics);
router.get('/topics/search', forum_controller_1.searchTopics);
// Reply routes
router.post('/replies', auth_middleware_1.authenticateToken, forum_controller_1.createReply);
router.put('/replies/:id', auth_middleware_1.authenticateToken, forum_controller_1.updateReply);
router.post('/replies/:id/accept', auth_middleware_1.authenticateToken, forum_controller_1.markReplyAsAccepted);
exports.default = router;
