"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportContact = exports.subscription = exports.getCurrentUser = exports.refreshToken = exports.login = exports.signup = void 0;
const user_model_1 = require("../models/user.model");
const auth_utils_1 = require("../utils/auth.utils");
const mailoptions_1 = require("../utils/mailoptions");
const mailtransport_1 = __importDefault(require("../utils/mailtransport"));
/**
 * User signup controller - handles registration for students and alumni
 */
const signup = async (req, res) => {
    try {
        const _a = req.body, { email, password, firstName, lastName, role } = _a, additionalData = __rest(_a, ["email", "password", "firstName", "lastName", "role"]);
        // Validate required fields
        if (!email || !password || !firstName || !lastName || !role) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }
        // Validate role
        if (role !== 'student' && role !== 'alumni') {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be either student or alumni'
            });
        }
        // Check if user with email already exists
        const existingUser = await user_model_1.UserModel.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'A user with this email already exists'
            });
        }
        // Role-specific validations and data structuring
        let userData;
        if (role === 'student') {
            // Student specific validations
            const { program, graduationYear } = additionalData;
            userData = {
                email,
                password,
                firstName,
                lastName,
                role: 'student',
                studentId: additionalData.studentId,
                program,
                major: additionalData.major,
                minor: additionalData.minor,
                graduationYear: graduationYear ? parseInt(graduationYear) : undefined,
                interests: additionalData.interests || [],
                skills: additionalData.skills || [],
                bio: additionalData.bio || ''
            };
        }
        else if (role === 'alumni') {
            // Alumni specific validations
            const { graduationYear, company, jobTitle } = additionalData;
            if (!graduationYear) {
                return res.status(400).json({
                    success: false,
                    message: 'Graduation year is required for alumni'
                });
            }
            userData = {
                email,
                password,
                firstName,
                lastName,
                role: 'alumni',
                graduationYear: parseInt(graduationYear),
                company,
                jobTitle,
                industry: additionalData.industry,
                expertise: additionalData.expertise || [],
                yearsOfExperience: additionalData.yearsOfExperience ? parseInt(additionalData.yearsOfExperience) : undefined,
                bio: additionalData.bio || '',
                linkedin: additionalData.linkedin,
                isAvailableForMentoring: additionalData.isAvailableForMentoring || false,
                mentorshipAreas: additionalData.mentorshipAreas || []
            };
        }
        // Create new user in database
        const newUser = await user_model_1.UserModel.createUser(userData);
        // Remove password before sending response
        const { password: _ } = newUser, userWithoutPassword = __rest(newUser, ["password"]);
        // Generate JWT tokens
        const token = (0, auth_utils_1.generateToken)(newUser._id);
        const refreshToken = (0, auth_utils_1.generateRefreshToken)(newUser._id);
        await mailtransport_1.default.sendMail((0, mailoptions_1.welcomeMailOptions)(email, firstName));
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: userWithoutPassword,
                token,
                refreshToken
            }
        });
    }
    catch (error) {
        console.error('Error in signup:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred during registration',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.signup = signup;
/**
 * User login controller
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        // Find user by email
        const user = await user_model_1.UserModel.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        // Verify password
        const isPasswordValid = await (0, auth_utils_1.comparePasswords)(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        // Check if user is active
        if (user.isActive === false) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated. Please contact support'
            });
        }
        // Update last login timestamp
        await user_model_1.UserModel.updateLastLogin(user._id);
        // Remove password before sending response
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        // Generate JWT tokens
        const token = (0, auth_utils_1.generateToken)(user._id);
        const refreshToken = (0, auth_utils_1.generateRefreshToken)(user._id);
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: userWithoutPassword,
                token,
                refreshToken
            }
        });
    }
    catch (error) {
        console.error('Error in login:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred during login',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.login = login;
/**
 * Refresh token controller
 */
const refreshToken = async (req, res) => {
    var _a;
    try {
        // The user ID should be attached to the request by the auth middleware
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token'
            });
        }
        // Generate new access token
        const newToken = (0, auth_utils_1.generateToken)(userId);
        return res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                token: newToken
            }
        });
    }
    catch (error) {
        console.error('Error in refreshToken:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while refreshing the token',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.refreshToken = refreshToken;
/**
 * Get current user information
 */
const getCurrentUser = async (req, res) => {
    var _a;
    try {
        // The user should be attached to the request by the auth middleware
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }
        // Get user data from database
        const user = await user_model_1.UserModel.findUserById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Remove password before sending response
        const { password } = user, userWithoutPassword = __rest(user, ["password"]);
        return res.status(200).json({
            success: true,
            data: userWithoutPassword
        });
    }
    catch (error) {
        console.error('Error in getCurrentUser:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while getting user information',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getCurrentUser = getCurrentUser;
const subscription = async (req, res) => {
    try {
        const email = req.body.email;
        console.log(email);
        if (!email) {
            return res.status(400).json({ message: "Enter vaid Email" });
        }
        await mailtransport_1.default.sendMail((0, mailoptions_1.Subscriptions)(email));
        return res.status(200).json({ message: "Subscription Successfull" });
    }
    catch (error) {
        console.error('Error in subscription:', error);
    }
};
exports.subscription = subscription;
const supportContact = async (req, res) => {
    try {
        const { firstName, email, subject, message } = req.body;
        console.log(req.body);
        if (!firstName || !email || !subject || !message) {
            return res.status(400).json({ message: "Enter all fields" });
        }
        mailtransport_1.default.sendMail((0, mailoptions_1.supportContactOpition)(firstName, email, subject, message));
        return res.status(200).json({ message: "Message Sent Successfully" });
    }
    catch (error) {
        console.error('Error in support:', error);
    }
};
exports.supportContact = supportContact;
