"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.post('/signup', auth_controller_1.signup);
router.post('/login', auth_controller_1.login);
router.post('/subscribe', auth_controller_1.subscription);
router.post('/support', auth_controller_1.supportContact);
// Protected routes that require authentication
router.get('/me', auth_middleware_1.authenticateToken, auth_controller_1.getCurrentUser);
router.post('/refresh-token', auth_middleware_1.authenticateRefreshToken, auth_controller_1.refreshToken);
exports.default = router;
