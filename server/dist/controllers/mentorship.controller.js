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
exports.addMentorshipFeedback = exports.updateMentorshipStatus = exports.getMentorshipById = exports.getMyMentorships = exports.getMentorshipRequests = exports.requestMentorship = void 0;
const mongodb_1 = require("mongodb");
const mentorship_model_1 = require("../models/mentorship.model");
const user_model_1 = require("../models/user.model");
const profile_model_1 = require("../models/profile.model");
// Request a new mentorship
const requestMentorship = async (req, res) => {
    var _a;
    try {
        const menteeId = req.user._id;
        const { mentorId, requestMessage, goals, topics, meetingFrequency, meetingPreference } = req.body;
        if (!mentorId) {
            return res.status(400).json({ message: 'Mentor ID is required' });
        }
        // Check if mentor exists
        const mentor = await user_model_1.UserModel.findById(mentorId);
        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }
        // Check if mentor's profile has mentorship availability
        const mentorProfile = await profile_model_1.ProfileModel.findByUserId(mentorId);
        if (!((_a = mentorProfile === null || mentorProfile === void 0 ? void 0 : mentorProfile.availability) === null || _a === void 0 ? void 0 : _a.mentorshipAvailable)) {
            return res.status(400).json({ message: 'Mentor is not available for mentorship' });
        }
        // Check if there's already an active mentorship
        const existingMentorship = await mentorship_model_1.MentorshipModel.findActiveMentorships(menteeId);
        const alreadyHasMentorship = existingMentorship.some(m => (m.mentorId.toString() === mentorId && m.menteeId.toString() === menteeId.toString()) &&
            (m.status === 'active' || m.status === 'pending'));
        if (alreadyHasMentorship) {
            return res.status(400).json({ message: 'You already have a pending or active mentorship with this mentor' });
        }
        // Create new mentorship request
        const mentorship = {
            mentorId: new mongodb_1.ObjectId(mentorId),
            menteeId: new mongodb_1.ObjectId(menteeId),
            status: 'pending',
            requestMessage,
            goals,
            topics,
            meetingFrequency,
            meetingPreference,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const createdMentorship = await mentorship_model_1.MentorshipModel.create(mentorship);
        res.status(201).json({
            message: 'Mentorship request sent successfully',
            mentorship: createdMentorship
        });
    }
    catch (error) {
        console.error('Error requesting mentorship:', error);
        res.status(500).json({
            message: 'Error requesting mentorship',
            error: error.message
        });
    }
};
exports.requestMentorship = requestMentorship;
// Get mentorships where the user is a mentor
const getMentorshipRequests = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status } = req.query;
        const mentorships = await mentorship_model_1.MentorshipModel.findByMentorId(userId, status);
        // Get mentee details for each mentorship
        const mentorshipsWithUsers = await Promise.all(mentorships.map(async (mentorship) => {
            const mentee = await user_model_1.UserModel.findById(mentorship.menteeId);
            const menteeProfile = await profile_model_1.ProfileModel.findByUserId(mentorship.menteeId);
            if (!mentee)
                return null;
            // Remove sensitive information
            const { password } = mentee, menteeWithoutPassword = __rest(mentee, ["password"]);
            return Object.assign(Object.assign({}, mentorship), { mentee: menteeWithoutPassword, menteeProfile });
        }));
        // Filter out any null values
        const validMentorships = mentorshipsWithUsers.filter(m => m !== null);
        res.status(200).json({ mentorships: validMentorships });
    }
    catch (error) {
        console.error('Error fetching mentorship requests:', error);
        res.status(500).json({
            message: 'Error fetching mentorship requests',
            error: error.message
        });
    }
};
exports.getMentorshipRequests = getMentorshipRequests;
// Get mentorships where the user is a mentee
const getMyMentorships = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status } = req.query;
        const mentorships = await mentorship_model_1.MentorshipModel.findByMenteeId(userId, status);
        // Get mentor details for each mentorship
        const mentorshipsWithUsers = await Promise.all(mentorships.map(async (mentorship) => {
            const mentor = await user_model_1.UserModel.findById(mentorship.mentorId);
            const mentorProfile = await profile_model_1.ProfileModel.findByUserId(mentorship.mentorId);
            if (!mentor)
                return null;
            // Remove sensitive information
            const { password } = mentor, mentorWithoutPassword = __rest(mentor, ["password"]);
            return Object.assign(Object.assign({}, mentorship), { mentor: mentorWithoutPassword, mentorProfile });
        }));
        // Filter out any null values
        const validMentorships = mentorshipsWithUsers.filter(m => m !== null);
        res.status(200).json({ mentorships: validMentorships });
    }
    catch (error) {
        console.error('Error fetching mentorships:', error);
        res.status(500).json({
            message: 'Error fetching mentorships',
            error: error.message
        });
    }
};
exports.getMyMentorships = getMyMentorships;
// Get a specific mentorship by ID
const getMentorshipById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const mentorship = await mentorship_model_1.MentorshipModel.findById(id);
        if (!mentorship) {
            return res.status(404).json({ message: 'Mentorship not found' });
        }
        // Check if user is part of this mentorship
        if (mentorship.mentorId.toString() !== userId.toString() &&
            mentorship.menteeId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to view this mentorship' });
        }
        // Get mentor and mentee details
        const mentor = await user_model_1.UserModel.findById(mentorship.mentorId);
        const mentee = await user_model_1.UserModel.findById(mentorship.menteeId);
        const mentorProfile = await profile_model_1.ProfileModel.findByUserId(mentorship.mentorId);
        const menteeProfile = await profile_model_1.ProfileModel.findByUserId(mentorship.menteeId);
        if (!mentor || !mentee) {
            return res.status(404).json({ message: 'User information missing' });
        }
        // Remove sensitive information
        const { password: mentorPassword } = mentor, mentorWithoutPassword = __rest(mentor, ["password"]);
        const { password: menteePassword } = mentee, menteeWithoutPassword = __rest(mentee, ["password"]);
        res.status(200).json({
            mentorship,
            mentor: mentorWithoutPassword,
            mentee: menteeWithoutPassword,
            mentorProfile,
            menteeProfile
        });
    }
    catch (error) {
        console.error('Error fetching mentorship:', error);
        res.status(500).json({
            message: 'Error fetching mentorship',
            error: error.message
        });
    }
};
exports.getMentorshipById = getMentorshipById;
// Update mentorship status (accept, decline, complete, etc.)
const updateMentorshipStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        const userId = req.user._id;
        // Get the mentorship
        const mentorship = await mentorship_model_1.MentorshipModel.findById(id);
        if (!mentorship) {
            return res.status(404).json({ message: 'Mentorship not found' });
        }
        // Check permissions based on the action being taken
        if (status === 'active' || status === 'declined') {
            // Only the mentor can accept or decline
            if (mentorship.mentorId.toString() !== userId.toString()) {
                return res.status(403).json({ message: 'Only the mentor can accept or decline a mentorship request' });
            }
        }
        else if (status === 'canceled') {
            // Only the mentee can cancel their request
            if (mentorship.menteeId.toString() !== userId.toString()) {
                return res.status(403).json({ message: 'Only the mentee can cancel a mentorship request' });
            }
        }
        else if (status === 'completed') {
            // Either mentor or mentee can mark as completed
            if (mentorship.mentorId.toString() !== userId.toString() &&
                mentorship.menteeId.toString() !== userId.toString()) {
                return res.status(403).json({ message: 'You are not authorized to update this mentorship' });
            }
        }
        // Update mentorship
        const updateData = {
            status: status,
            updatedAt: new Date()
        };
        if (notes) {
            updateData.notes = notes;
        }
        // If accepting, set the start date
        if (status === 'active') {
            updateData.startDate = new Date();
        }
        // If completing, set the end date
        if (status === 'completed') {
            updateData.endDate = new Date();
        }
        const updated = await mentorship_model_1.MentorshipModel.updateById(id, updateData);
        if (!updated) {
            return res.status(400).json({ message: 'Failed to update mentorship status' });
        }
        // Get updated mentorship
        const updatedMentorship = await mentorship_model_1.MentorshipModel.findById(id);
        res.status(200).json({
            message: `Mentorship ${status} successfully`,
            mentorship: updatedMentorship
        });
    }
    catch (error) {
        console.error('Error updating mentorship:', error);
        res.status(500).json({
            message: 'Error updating mentorship',
            error: error.message
        });
    }
};
exports.updateMentorshipStatus = updateMentorshipStatus;
// Add feedback to a mentorship
const addMentorshipFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id;
        if (!rating) {
            return res.status(400).json({ message: 'Rating is required' });
        }
        // Get the mentorship
        const mentorship = await mentorship_model_1.MentorshipModel.findById(id);
        if (!mentorship) {
            return res.status(404).json({ message: 'Mentorship not found' });
        }
        // Check if user is part of this mentorship
        if (mentorship.mentorId.toString() !== userId.toString() &&
            mentorship.menteeId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to add feedback to this mentorship' });
        }
        // Determine if this is mentor or mentee feedback
        const isMentor = mentorship.mentorId.toString() === userId.toString();
        // Prepare update data
        const feedback = Object.assign({}, (mentorship.feedback || {}));
        if (isMentor) {
            feedback.mentorFeedback = {
                rating,
                comment,
                date: new Date()
            };
        }
        else {
            feedback.menteeFeedback = {
                rating,
                comment,
                date: new Date()
            };
        }
        // Update mentorship
        const updated = await mentorship_model_1.MentorshipModel.updateById(id, {
            feedback,
            updatedAt: new Date()
        });
        if (!updated) {
            return res.status(400).json({ message: 'Failed to add feedback' });
        }
        // Get updated mentorship
        const updatedMentorship = await mentorship_model_1.MentorshipModel.findById(id);
        res.status(200).json({
            message: 'Feedback added successfully',
            mentorship: updatedMentorship
        });
    }
    catch (error) {
        console.error('Error adding feedback:', error);
        res.status(500).json({
            message: 'Error adding feedback',
            error: error.message
        });
    }
};
exports.addMentorshipFeedback = addMentorshipFeedback;
