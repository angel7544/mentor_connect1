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
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMentors = exports.updateProfile = exports.getProfileByUserId = exports.getCurrentProfile = void 0;
const mongodb_1 = require("mongodb");
const profile_model_1 = require("../models/profile.model");
const user_model_1 = require("../models/user.model");
// Get current user's profile
const getCurrentProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        // Find profile
        const profile = await profile_model_1.ProfileModel.findByUserId(userId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json({ profile });
    }
    catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            message: 'Error fetching profile',
            error: error.message
        });
    }
};
exports.getCurrentProfile = getCurrentProfile;
// Get profile by user ID
const getProfileByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        // Find profile
        const profile = await profile_model_1.ProfileModel.findByUserId(userId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        // Get user's basic info
        const user = await user_model_1.UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Remove sensitive information
        const { password } = user, userWithoutPassword = __rest(user, ["password"]);
        res.status(200).json({
            profile,
            user: userWithoutPassword
        });
    }
    catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            message: 'Error fetching profile',
            error: error.message
        });
    }
};
exports.getProfileByUserId = getProfileByUserId;
// Create or update profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const profileData = req.body;
        // Find existing profile
        const existingProfile = await profile_model_1.ProfileModel.findByUserId(userId);
        let result;
        if (existingProfile) {
            // Update existing profile
            result = await profile_model_1.ProfileModel.updateByUserId(userId, Object.assign(Object.assign({}, profileData), { updatedAt: new Date() }));
            if (!result) {
                return res.status(400).json({ message: 'Failed to update profile' });
            }
            // Get the updated profile
            const updatedProfile = await profile_model_1.ProfileModel.findByUserId(userId);
            res.status(200).json({
                message: 'Profile updated successfully',
                profile: updatedProfile
            });
        }
        else {
            // Create new profile
            const newProfile = Object.assign(Object.assign({ userId: new mongodb_1.ObjectId(userId) }, profileData), { createdAt: new Date(), updatedAt: new Date() });
            const createdProfile = await profile_model_1.ProfileModel.create(newProfile);
            res.status(201).json({
                message: 'Profile created successfully',
                profile: createdProfile
            });
        }
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            message: 'Error updating profile',
            error: error.message
        });
    }
};
exports.updateProfile = updateProfile;
// Find mentors
const findMentors = async (req, res) => {
    try {
        const { skills, interests, limit, skip } = req.query;
        const filters = {};
        if (skills) {
            filters.skills = Array.isArray(skills) ? skills : [skills];
        }
        if (interests) {
            filters.interests = Array.isArray(interests) ? interests : [interests];
        }
        if (limit) {
            filters.limit = parseInt(limit);
        }
        if (skip) {
            filters.skip = parseInt(skip);
        }
        const mentors = await profile_model_1.ProfileModel.findMentors(filters);
        // Get user details for each mentor
        const mentorsWithUserInfo = await Promise.all(mentors.map(async (mentor) => {
            const user = await user_model_1.UserModel.findById(mentor.userId);
            if (!user)
                return null;
            // Remove sensitive information
            const { password } = user, userWithoutPassword = __rest(user, ["password"]);
            return {
                profile: mentor,
                user: userWithoutPassword
            };
        }));
        // Filter out any null values (in case a user was not found)
        const validMentors = mentorsWithUserInfo.filter(m => m !== null);
        res.status(200).json({ mentors: validMentors });
    }
    catch (error) {
        console.error('Error finding mentors:', error);
        res.status(500).json({
            message: 'Error finding mentors',
            error: error.message
        });
    }
};
exports.findMentors = findMentors;
