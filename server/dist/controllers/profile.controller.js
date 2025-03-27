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
exports.uploadProfileImage = exports.findMentors = exports.updateProfile = exports.getProfileByUserId = exports.getCurrentProfile = void 0;
const mongodb_1 = require("mongodb");
const profile_model_1 = require("../models/profile.model");
const user_model_1 = require("../models/user.model");
// Get current user's profile
const getCurrentProfile = async (req, res) => {
    try {
        console.log('Getting current profile for user:', req.user);
        const userId = req.user._id;
        // Find profile
        console.log('Looking up profile for user ID:', userId);
        const profile = await profile_model_1.ProfileModel.findByUserId(userId);
        if (!profile) {
            console.log('No profile found for user:', userId);
            // Create a default profile if none exists
            const defaultProfile = {
                userId: userId,
                bio: 'Welcome to your profile! Add your bio here.',
                headline: 'Add a headline to describe yourself',
                skills: [],
                interests: [],
                education: [],
                experience: [],
                socialLinks: [],
                contactInfo: {},
                availability: {
                    mentorshipAvailable: false
                },
                preferences: {
                    contactPreference: 'email',
                    notificationSettings: {
                        email: true,
                        app: true
                    }
                },
                createdAt: new Date(),
                updatedAt: new Date()
            };
            console.log('Creating default profile for user:', userId);
            const createdProfile = await profile_model_1.ProfileModel.create(defaultProfile);
            console.log('Default profile created:', createdProfile);
            return res.status(200).json({ profile: createdProfile });
        }
        console.log('Profile found:', profile);
        res.status(200).json({ profile });
    }
    catch (error) {
        console.error('Error in getCurrentProfile:', error);
        res.status(500).json({
            message: 'Error fetching profile',
            error: error instanceof Error ? error.message : 'Unknown error'
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
        console.log('Updating profile for user:', req.user._id);
        console.log('Update data:', req.body);
        const userId = req.user._id;
        const profileData = req.body;
        // Validate required fields
        if (!profileData) {
            console.error('No profile data provided');
            return res.status(400).json({ message: 'No profile data provided' });
        }
        // Find existing profile
        const existingProfile = await profile_model_1.ProfileModel.findByUserId(userId);
        console.log('Existing profile:', existingProfile);
        if (existingProfile) {
            // Update existing profile
            const updateData = Object.assign(Object.assign({}, profileData), { updatedAt: new Date() });
            console.log('Updating profile with data:', updateData);
            const updatedProfile = await profile_model_1.ProfileModel.updateByUserId(userId, updateData);
            if (!updatedProfile) {
                console.error('Failed to update profile');
                return res.status(400).json({ message: 'Failed to update profile' });
            }
            console.log('Profile updated successfully:', updatedProfile);
            try {
                // Get user data
                const user = await user_model_1.UserModel.findById(userId);
                if (!user) {
                    console.error('User not found after profile update');
                    // Still return the updated profile, but without user data
                    return res.status(200).json({
                        message: 'Profile updated successfully, but user data could not be retrieved',
                        profile: updatedProfile
                    });
                }
                // Remove sensitive information
                const { password } = user, userWithoutPassword = __rest(user, ["password"]);
                return res.status(200).json({
                    message: 'Profile updated successfully',
                    profile: updatedProfile,
                    user: userWithoutPassword
                });
            }
            catch (userError) {
                console.error('Error fetching user data after profile update:', userError);
                // Still return the updated profile, but without user data
                return res.status(200).json({
                    message: 'Profile updated successfully, but user data could not be retrieved',
                    profile: updatedProfile
                });
            }
        }
        else {
            // Create new profile
            const newProfile = Object.assign(Object.assign({ userId: new mongodb_1.ObjectId(userId) }, profileData), { createdAt: new Date(), updatedAt: new Date() });
            console.log('Creating new profile:', newProfile);
            const createdProfile = await profile_model_1.ProfileModel.create(newProfile);
            if (!createdProfile) {
                console.error('Failed to create profile');
                return res.status(400).json({ message: 'Failed to create profile' });
            }
            try {
                // Get user data
                const user = await user_model_1.UserModel.findById(userId);
                if (!user) {
                    console.error('User not found after profile creation');
                    // Still return the created profile, but without user data
                    return res.status(201).json({
                        message: 'Profile created successfully, but user data could not be retrieved',
                        profile: createdProfile
                    });
                }
                // Remove sensitive information
                const { password } = user, userWithoutPassword = __rest(user, ["password"]);
                return res.status(201).json({
                    message: 'Profile created successfully',
                    profile: createdProfile,
                    user: userWithoutPassword
                });
            }
            catch (userError) {
                console.error('Error fetching user data after profile creation:', userError);
                // Still return the created profile, but without user data
                return res.status(201).json({
                    message: 'Profile created successfully, but user data could not be retrieved',
                    profile: createdProfile
                });
            }
        }
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            message: 'Error updating profile',
            error: error instanceof Error ? error.message : 'Unknown error'
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
// Upload profile image
const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }
        const userId = req.user._id;
        const imageUrl = `/uploads/profiles/${req.file.filename}`;
        // Update profile with new image URL
        const result = await profile_model_1.ProfileModel.updateByUserId(userId, {
            avatarUrl: imageUrl,
            updatedAt: new Date()
        });
        if (!result) {
            return res.status(400).json({ message: 'Failed to update profile image' });
        }
        res.status(200).json({
            message: 'Profile image uploaded successfully',
            imageUrl
        });
    }
    catch (error) {
        console.error('Error uploading profile image:', error);
        res.status(500).json({
            message: 'Error uploading profile image',
            error: error.message
        });
    }
};
exports.uploadProfileImage = uploadProfileImage;
