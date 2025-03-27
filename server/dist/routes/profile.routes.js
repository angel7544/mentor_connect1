"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const profile_controller_1 = require("../controllers/profile.controller");
const fileUpload_1 = require("../utils/fileUpload");
const router = express_1.default.Router();
// Get current user's profile
router.get('/me', auth_middleware_1.authenticateToken, profile_controller_1.getCurrentProfile);
// Get profile by user ID
router.get('/user/:userId', auth_middleware_1.authenticateToken, profile_controller_1.getProfileByUserId);
// Update profile
router.put('/update', auth_middleware_1.authenticateToken, profile_controller_1.updateProfile);
// Upload profile image
router.post('/upload-image', auth_middleware_1.authenticateToken, fileUpload_1.upload.single('image'), profile_controller_1.uploadProfileImage);
// Find mentors
router.get('/mentors', auth_middleware_1.authenticateToken, profile_controller_1.findMentors);
exports.default = router;
