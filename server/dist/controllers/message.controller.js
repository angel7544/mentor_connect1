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
exports.getRecentMessages = exports.getUnreadMessageCount = exports.markMessageAsRead = exports.getConversationMessages = exports.getConversations = exports.sendMessage = void 0;
const mongodb_1 = require("mongodb");
const message_model_1 = require("../models/message.model");
const user_model_1 = require("../models/user.model");
// Send a message
const sendMessage = async (req, res) => {
    try {
        const senderId = req.user._id;
        const { receiverId, content, conversationId, mentorshipId, attachments } = req.body;
        if (!receiverId || !content) {
            return res.status(400).json({ message: 'Receiver ID and content are required' });
        }
        // Check if receiver exists
        const receiver = await user_model_1.UserModel.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }
        // Create message
        const messageData = {
            senderId: new mongodb_1.ObjectId(senderId),
            receiverId: new mongodb_1.ObjectId(receiverId),
            content,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        if (conversationId) {
            messageData.conversationId = new mongodb_1.ObjectId(conversationId);
        }
        if (mentorshipId) {
            messageData.mentorshipId = new mongodb_1.ObjectId(mentorshipId);
        }
        if (attachments && attachments.length > 0) {
            messageData.attachments = attachments;
        }
        const message = await message_model_1.MessageModel.createMessage(messageData);
        res.status(201).json({
            message: 'Message sent successfully',
            data: message
        });
    }
    catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            message: 'Error sending message',
            error: error.message
        });
    }
};
exports.sendMessage = sendMessage;
// Get conversations for a user
const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        const conversations = await message_model_1.MessageModel.getUserConversations(userId);
        // Get user details for each participant
        const conversationsWithUsers = await Promise.all(conversations.map(async (conversation) => {
            // Get other participants' details
            const otherParticipants = conversation.participants.filter(p => p.toString() !== userId.toString());
            const participantsDetails = await Promise.all(otherParticipants.map(async (participantId) => {
                const user = await user_model_1.UserModel.findById(participantId);
                if (!user)
                    return null;
                // Remove sensitive information
                const { password } = user, userWithoutPassword = __rest(user, ["password"]);
                return userWithoutPassword;
            }));
            // Filter out null values
            const validParticipants = participantsDetails.filter(p => p !== null);
            return Object.assign(Object.assign({}, conversation), { participants: validParticipants });
        }));
        res.status(200).json({ conversations: conversationsWithUsers });
    }
    catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({
            message: 'Error fetching conversations',
            error: error.message
        });
    }
};
exports.getConversations = getConversations;
// Get messages for a specific conversation
const getConversationMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user._id;
        const { limit, skip } = req.query;
        // Convert query params to numbers
        const parsedLimit = limit ? parseInt(limit) : 50;
        const parsedSkip = skip ? parseInt(skip) : 0;
        // Get messages
        const messages = await message_model_1.MessageModel.getConversation(conversationId, parsedLimit, parsedSkip);
        // Mark messages as read if the user is the receiver
        await Promise.all(messages
            .filter(msg => msg.receiverId.toString() === userId.toString() && !msg.readAt)
            .map(msg => message_model_1.MessageModel.markAsRead(msg._id)));
        res.status(200).json({ messages });
    }
    catch (error) {
        console.error('Error fetching conversation messages:', error);
        res.status(500).json({
            message: 'Error fetching conversation messages',
            error: error.message
        });
    }
};
exports.getConversationMessages = getConversationMessages;
// Mark a message as read
const markMessageAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user._id;
        // Get the message
        const message = await message_model_1.MessageModel.findMessageById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        // Check if the user is the receiver
        if (message.receiverId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You can only mark messages sent to you as read' });
        }
        // Mark as read
        const updated = await message_model_1.MessageModel.markAsRead(messageId);
        if (!updated) {
            return res.status(400).json({ message: 'Failed to mark message as read' });
        }
        res.status(200).json({ message: 'Message marked as read' });
    }
    catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({
            message: 'Error marking message as read',
            error: error.message
        });
    }
};
exports.markMessageAsRead = markMessageAsRead;
// Get unread message count
const getUnreadMessageCount = async (req, res) => {
    try {
        const userId = req.user._id;
        const count = await message_model_1.MessageModel.getUnreadCount(userId);
        res.status(200).json({ count });
    }
    catch (error) {
        console.error('Error getting unread message count:', error);
        res.status(500).json({
            message: 'Error getting unread message count',
            error: error.message
        });
    }
};
exports.getUnreadMessageCount = getUnreadMessageCount;
// Get recent messages for dashboard
const getRecentMessages = async (req, res) => {
    try {
        const userId = req.user._id;
        const { limit } = req.query;
        const parsedLimit = limit ? parseInt(limit) : 5;
        const messages = await message_model_1.MessageModel.getRecentMessagesForUser(userId, parsedLimit);
        // Get user details for each message
        const messagesWithUsers = await Promise.all(messages.map(async (message) => {
            const otherUserId = message.senderId.toString() === userId.toString()
                ? message.receiverId
                : message.senderId;
            const user = await user_model_1.UserModel.findById(otherUserId);
            if (!user)
                return message;
            // Remove sensitive information
            const { password } = user, userWithoutPassword = __rest(user, ["password"]);
            return Object.assign(Object.assign({}, message), { otherUser: userWithoutPassword });
        }));
        res.status(200).json({ messages: messagesWithUsers });
    }
    catch (error) {
        console.error('Error fetching recent messages:', error);
        res.status(500).json({
            message: 'Error fetching recent messages',
            error: error.message
        });
    }
};
exports.getRecentMessages = getRecentMessages;
