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
exports.searchTopics = exports.markReplyAsAccepted = exports.updateReply = exports.createReply = exports.getRecentTopics = exports.getTopicsByCategory = exports.getTopicById = exports.updateTopic = exports.createTopic = exports.getCategoryById = exports.getCategories = exports.updateCategory = exports.createCategory = void 0;
const mongodb_1 = require("mongodb");
const forum_model_1 = require("../models/forum.model");
const user_model_1 = require("../models/user.model");
// Category controllers
const createCategory = async (req, res) => {
    try {
        // Only admins can create categories
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only administrators can create categories' });
        }
        const { name, description, slug, isActive, order, parentId } = req.body;
        if (!name || !description || !slug) {
            return res.status(400).json({ message: 'Name, description, and slug are required' });
        }
        // Check if slug is already in use
        const categories = await forum_model_1.ForumModel.getCategories();
        const slugExists = categories.some(c => c.slug === slug);
        if (slugExists) {
            return res.status(400).json({ message: 'Slug is already in use' });
        }
        // Create category
        const categoryData = {
            name,
            description,
            slug,
            isActive: isActive !== undefined ? isActive : true,
            order,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        if (parentId) {
            categoryData.parentId = new mongodb_1.ObjectId(parentId);
        }
        const category = await forum_model_1.ForumModel.createCategory(categoryData);
        res.status(201).json({
            message: 'Category created successfully',
            category
        });
    }
    catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({
            message: 'Error creating category',
            error: error.message
        });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        // Only admins can update categories
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only administrators can update categories' });
        }
        const { id } = req.params;
        const updateData = req.body;
        // Get category
        const category = await forum_model_1.ForumModel.getCategoryById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        // Check if slug is already in use (if changing slug)
        if (updateData.slug && updateData.slug !== category.slug) {
            const categories = await forum_model_1.ForumModel.getCategories();
            const slugExists = categories.some(c => c.slug === updateData.slug && c._id.toString() !== id);
            if (slugExists) {
                return res.status(400).json({ message: 'Slug is already in use' });
            }
        }
        // Update category
        const updated = await forum_model_1.ForumModel.updateCategory(id, Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }));
        if (!updated) {
            return res.status(400).json({ message: 'Failed to update category' });
        }
        // Get updated category
        const updatedCategory = await forum_model_1.ForumModel.getCategoryById(id);
        res.status(200).json({
            message: 'Category updated successfully',
            category: updatedCategory
        });
    }
    catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({
            message: 'Error updating category',
            error: error.message
        });
    }
};
exports.updateCategory = updateCategory;
const getCategories = async (req, res) => {
    try {
        const categories = await forum_model_1.ForumModel.getCategories();
        res.status(200).json({ categories });
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            message: 'Error fetching categories',
            error: error.message
        });
    }
};
exports.getCategories = getCategories;
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await forum_model_1.ForumModel.getCategoryById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ category });
    }
    catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({
            message: 'Error fetching category',
            error: error.message
        });
    }
};
exports.getCategoryById = getCategoryById;
// Topic controllers
const createTopic = async (req, res) => {
    try {
        const authorId = req.user._id;
        const { title, content, categoryId, tags } = req.body;
        if (!title || !content || !categoryId) {
            return res.status(400).json({ message: 'Title, content, and category ID are required' });
        }
        // Check if category exists
        const category = await forum_model_1.ForumModel.getCategoryById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        // Create topic
        const topicData = {
            title,
            content,
            authorId: new mongodb_1.ObjectId(authorId),
            categoryId: new mongodb_1.ObjectId(categoryId),
            tags,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const topic = await forum_model_1.ForumModel.createTopic(topicData);
        res.status(201).json({
            message: 'Topic created successfully',
            topic
        });
    }
    catch (error) {
        console.error('Error creating topic:', error);
        res.status(500).json({
            message: 'Error creating topic',
            error: error.message
        });
    }
};
exports.createTopic = createTopic;
const updateTopic = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const updateData = req.body;
        // Get topic
        const topic = await forum_model_1.ForumModel.getTopicById(id);
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }
        // Check if user is the author or admin
        if (topic.authorId.toString() !== userId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to update this topic' });
        }
        // Check if topic is locked
        if (topic.isLocked && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'This topic is locked and cannot be updated' });
        }
        // Update topic
        const updated = await forum_model_1.ForumModel.updateTopic(id, Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }));
        if (!updated) {
            return res.status(400).json({ message: 'Failed to update topic' });
        }
        // Get updated topic
        const updatedTopic = await forum_model_1.ForumModel.getTopicById(id);
        res.status(200).json({
            message: 'Topic updated successfully',
            topic: updatedTopic
        });
    }
    catch (error) {
        console.error('Error updating topic:', error);
        res.status(500).json({
            message: 'Error updating topic',
            error: error.message
        });
    }
};
exports.updateTopic = updateTopic;
const getTopicById = async (req, res) => {
    try {
        const { id } = req.params;
        const topic = await forum_model_1.ForumModel.getTopicById(id);
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }
        // Increment view count
        await forum_model_1.ForumModel.incrementTopicViewCount(id);
        // Get author details
        const author = await user_model_1.UserModel.findById(topic.authorId);
        let authorData = null;
        if (author) {
            // Remove sensitive information
            const { password } = author, authorWithoutPassword = __rest(author, ["password"]);
            authorData = authorWithoutPassword;
        }
        // Get replies
        const replies = await forum_model_1.ForumModel.getRepliesByTopic(id);
        // Get authors for replies
        const repliesWithAuthors = await Promise.all(replies.map(async (reply) => {
            const replyAuthor = await user_model_1.UserModel.findById(reply.authorId);
            if (!replyAuthor)
                return reply;
            // Remove sensitive information
            const { password } = replyAuthor, authorWithoutPassword = __rest(replyAuthor, ["password"]);
            // Get nested replies if any
            const nestedReplies = await forum_model_1.ForumModel.getNestedReplies(reply._id);
            // Get authors for nested replies
            const nestedRepliesWithAuthors = await Promise.all(nestedReplies.map(async (nestedReply) => {
                const nestedReplyAuthor = await user_model_1.UserModel.findById(nestedReply.authorId);
                if (!nestedReplyAuthor)
                    return nestedReply;
                // Remove sensitive information
                const { password } = nestedReplyAuthor, nestedAuthorWithoutPassword = __rest(nestedReplyAuthor, ["password"]);
                return Object.assign(Object.assign({}, nestedReply), { author: nestedAuthorWithoutPassword });
            }));
            return Object.assign(Object.assign({}, reply), { author: authorWithoutPassword, nestedReplies: nestedRepliesWithAuthors });
        }));
        res.status(200).json({
            topic: Object.assign(Object.assign({}, topic), { author: authorData }),
            replies: repliesWithAuthors
        });
    }
    catch (error) {
        console.error('Error fetching topic:', error);
        res.status(500).json({
            message: 'Error fetching topic',
            error: error.message
        });
    }
};
exports.getTopicById = getTopicById;
const getTopicsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { limit, skip, sortBy, sortDirection } = req.query;
        // Check if category exists
        const category = await forum_model_1.ForumModel.getCategoryById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const options = {};
        if (limit) {
            options.limit = parseInt(limit);
        }
        if (skip) {
            options.skip = parseInt(skip);
        }
        if (sortBy) {
            options.sortBy = sortBy;
        }
        if (sortDirection) {
            options.sortDirection = sortDirection;
        }
        const topics = await forum_model_1.ForumModel.getTopicsByCategory(categoryId, options);
        // Get author details for each topic
        const topicsWithAuthors = await Promise.all(topics.map(async (topic) => {
            const author = await user_model_1.UserModel.findById(topic.authorId);
            if (!author)
                return topic;
            // Remove sensitive information
            const { password } = author, authorWithoutPassword = __rest(author, ["password"]);
            return Object.assign(Object.assign({}, topic), { author: authorWithoutPassword });
        }));
        res.status(200).json({
            category,
            topics: topicsWithAuthors
        });
    }
    catch (error) {
        console.error('Error fetching topics by category:', error);
        res.status(500).json({
            message: 'Error fetching topics by category',
            error: error.message
        });
    }
};
exports.getTopicsByCategory = getTopicsByCategory;
const getRecentTopics = async (req, res) => {
    try {
        const { limit } = req.query;
        const parsedLimit = limit ? parseInt(limit) : 10;
        const topics = await forum_model_1.ForumModel.getRecentTopics(parsedLimit);
        // Get author details for each topic
        const topicsWithAuthors = await Promise.all(topics.map(async (topic) => {
            const author = await user_model_1.UserModel.findById(topic.authorId);
            if (!author)
                return topic;
            // Remove sensitive information
            const { password } = author, authorWithoutPassword = __rest(author, ["password"]);
            return Object.assign(Object.assign({}, topic), { author: authorWithoutPassword });
        }));
        res.status(200).json({ topics: topicsWithAuthors });
    }
    catch (error) {
        console.error('Error fetching recent topics:', error);
        res.status(500).json({
            message: 'Error fetching recent topics',
            error: error.message
        });
    }
};
exports.getRecentTopics = getRecentTopics;
// Reply controllers
const createReply = async (req, res) => {
    try {
        const authorId = req.user._id;
        const { topicId, content, parentReplyId } = req.body;
        if (!topicId || !content) {
            return res.status(400).json({ message: 'Topic ID and content are required' });
        }
        // Check if topic exists
        const topic = await forum_model_1.ForumModel.getTopicById(topicId);
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }
        // Check if topic is locked
        if (topic.isLocked && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'This topic is locked and cannot be replied to' });
        }
        // If this is a nested reply, check if parent reply exists
        if (parentReplyId) {
            const parentReply = await forum_model_1.ForumModel.getReplyById(parentReplyId);
            if (!parentReply) {
                return res.status(404).json({ message: 'Parent reply not found' });
            }
            // Make sure parent reply belongs to the same topic
            if (parentReply.topicId.toString() !== topicId) {
                return res.status(400).json({ message: 'Parent reply does not belong to the specified topic' });
            }
        }
        // Create reply
        const replyData = {
            topicId: new mongodb_1.ObjectId(topicId),
            authorId: new mongodb_1.ObjectId(authorId),
            content,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        if (parentReplyId) {
            replyData.parentReplyId = new mongodb_1.ObjectId(parentReplyId);
        }
        const reply = await forum_model_1.ForumModel.createReply(replyData);
        res.status(201).json({
            message: 'Reply created successfully',
            reply
        });
    }
    catch (error) {
        console.error('Error creating reply:', error);
        res.status(500).json({
            message: 'Error creating reply',
            error: error.message
        });
    }
};
exports.createReply = createReply;
const updateReply = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }
        // Get reply
        const reply = await forum_model_1.ForumModel.getReplyById(id);
        if (!reply) {
            return res.status(404).json({ message: 'Reply not found' });
        }
        // Check if user is the author or admin
        if (reply.authorId.toString() !== userId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to update this reply' });
        }
        // Get topic to check if it's locked
        const topic = await forum_model_1.ForumModel.getTopicById(reply.topicId);
        if ((topic === null || topic === void 0 ? void 0 : topic.isLocked) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'This topic is locked and replies cannot be updated' });
        }
        // Update reply
        const updated = await forum_model_1.ForumModel.updateReply(id, {
            content,
            updatedAt: new Date()
        });
        if (!updated) {
            return res.status(400).json({ message: 'Failed to update reply' });
        }
        // Get updated reply
        const updatedReply = await forum_model_1.ForumModel.getReplyById(id);
        res.status(200).json({
            message: 'Reply updated successfully',
            reply: updatedReply
        });
    }
    catch (error) {
        console.error('Error updating reply:', error);
        res.status(500).json({
            message: 'Error updating reply',
            error: error.message
        });
    }
};
exports.updateReply = updateReply;
const markReplyAsAccepted = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        // Get reply
        const reply = await forum_model_1.ForumModel.getReplyById(id);
        if (!reply) {
            return res.status(404).json({ message: 'Reply not found' });
        }
        // Get topic
        const topic = await forum_model_1.ForumModel.getTopicById(reply.topicId);
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }
        // Check if user is the topic author or admin
        if (topic.authorId.toString() !== userId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only the topic author or an admin can mark a reply as accepted' });
        }
        // Mark as accepted
        const marked = await forum_model_1.ForumModel.markReplyAsAccepted(id, reply.topicId);
        if (!marked) {
            return res.status(400).json({ message: 'Failed to mark reply as accepted' });
        }
        res.status(200).json({ message: 'Reply marked as accepted' });
    }
    catch (error) {
        console.error('Error marking reply as accepted:', error);
        res.status(500).json({
            message: 'Error marking reply as accepted',
            error: error.message
        });
    }
};
exports.markReplyAsAccepted = markReplyAsAccepted;
const searchTopics = async (req, res) => {
    try {
        const { query, limit, skip } = req.query;
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }
        const options = {};
        if (limit) {
            options.limit = parseInt(limit);
        }
        if (skip) {
            options.skip = parseInt(skip);
        }
        const topics = await forum_model_1.ForumModel.searchTopics(query, options);
        // Get author details for each topic
        const topicsWithAuthors = await Promise.all(topics.map(async (topic) => {
            const author = await user_model_1.UserModel.findById(topic.authorId);
            if (!author)
                return topic;
            // Remove sensitive information
            const { password } = author, authorWithoutPassword = __rest(author, ["password"]);
            return Object.assign(Object.assign({}, topic), { author: authorWithoutPassword });
        }));
        res.status(200).json({ topics: topicsWithAuthors });
    }
    catch (error) {
        console.error('Error searching topics:', error);
        res.status(500).json({
            message: 'Error searching topics',
            error: error.message
        });
    }
};
exports.searchTopics = searchTopics;
