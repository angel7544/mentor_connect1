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
exports.rateResource = exports.addComment = exports.deleteResource = exports.updateResource = exports.getResourceById = exports.getResources = exports.createResource = void 0;
const mongodb_1 = require("mongodb");
const resource_model_1 = require("../models/resource.model");
const user_model_1 = require("../models/user.model");
// Create a new resource
const createResource = async (req, res) => {
    try {
        const userId = req.user._id;
        const resourceData = req.body;
        // Validate required fields
        if (!resourceData.title || !resourceData.description || !resourceData.resourceType) {
            return res.status(400).json({ message: 'Title, description, and resource type are required' });
        }
        // Create resource
        const resource = Object.assign(Object.assign({}, resourceData), { authorId: new mongodb_1.ObjectId(userId), isPublic: resourceData.isPublic !== undefined ? resourceData.isPublic : true, createdAt: new Date(), updatedAt: new Date() });
        const createdResource = await resource_model_1.ResourceModel.create(resource);
        res.status(201).json({
            message: 'Resource created successfully',
            resource: createdResource
        });
    }
    catch (error) {
        console.error('Error creating resource:', error);
        res.status(500).json({
            message: 'Error creating resource',
            error: error.message
        });
    }
};
exports.createResource = createResource;
// Get all resources
const getResources = async (req, res) => {
    try {
        const { searchQuery, categories, tags, resourceType, limit, skip, sortBy, sortDirection } = req.query;
        const filters = {};
        if (searchQuery) {
            filters.searchQuery = searchQuery;
        }
        if (categories) {
            filters.categories = Array.isArray(categories) ? categories : [categories];
        }
        if (tags) {
            filters.tags = Array.isArray(tags) ? tags : [tags];
        }
        if (resourceType) {
            filters.resourceType = Array.isArray(resourceType) ? resourceType : resourceType;
        }
        if (limit) {
            filters.limit = parseInt(limit);
        }
        if (skip) {
            filters.skip = parseInt(skip);
        }
        if (sortBy) {
            filters.sortBy = sortBy;
        }
        if (sortDirection) {
            filters.sortDirection = sortDirection;
        }
        const resources = await resource_model_1.ResourceModel.findAll(filters);
        // Get author details for each resource
        const resourcesWithAuthors = await Promise.all(resources.map(async (resource) => {
            if (!resource.authorId)
                return resource;
            const author = await user_model_1.UserModel.findById(resource.authorId);
            if (!author)
                return resource;
            // Remove sensitive information
            const { password } = author, authorWithoutPassword = __rest(author, ["password"]);
            return Object.assign(Object.assign({}, resource), { author: authorWithoutPassword });
        }));
        res.status(200).json({ resources: resourcesWithAuthors });
    }
    catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({
            message: 'Error fetching resources',
            error: error.message
        });
    }
};
exports.getResources = getResources;
// Get a specific resource by ID
const getResourceById = async (req, res) => {
    try {
        const { id } = req.params;
        const resource = await resource_model_1.ResourceModel.findById(id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        // Increment view count
        await resource_model_1.ResourceModel.incrementViewCount(id);
        // Get author details
        let author = null;
        if (resource.authorId) {
            const authorData = await user_model_1.UserModel.findById(resource.authorId);
            if (authorData) {
                // Remove sensitive information
                const { password } = authorData, authorWithoutPassword = __rest(authorData, ["password"]);
                author = authorWithoutPassword;
            }
        }
        res.status(200).json({
            resource: Object.assign(Object.assign({}, resource), { author })
        });
    }
    catch (error) {
        console.error('Error fetching resource:', error);
        res.status(500).json({
            message: 'Error fetching resource',
            error: error.message
        });
    }
};
exports.getResourceById = getResourceById;
// Update a resource
const updateResource = async (req, res) => {
    var _a;
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const updateData = req.body;
        // Get resource
        const resource = await resource_model_1.ResourceModel.findById(id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        // Check if user is the author or admin
        if (((_a = resource.authorId) === null || _a === void 0 ? void 0 : _a.toString()) !== userId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to update this resource' });
        }
        // Update resource
        const updated = await resource_model_1.ResourceModel.updateById(id, Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }));
        if (!updated) {
            return res.status(400).json({ message: 'Failed to update resource' });
        }
        // Get updated resource
        const updatedResource = await resource_model_1.ResourceModel.findById(id);
        res.status(200).json({
            message: 'Resource updated successfully',
            resource: updatedResource
        });
    }
    catch (error) {
        console.error('Error updating resource:', error);
        res.status(500).json({
            message: 'Error updating resource',
            error: error.message
        });
    }
};
exports.updateResource = updateResource;
// Delete a resource
const deleteResource = async (req, res) => {
    var _a;
    try {
        const { id } = req.params;
        const userId = req.user._id;
        // Get resource
        const resource = await resource_model_1.ResourceModel.findById(id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        // Check if user is the author or admin
        if (((_a = resource.authorId) === null || _a === void 0 ? void 0 : _a.toString()) !== userId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to delete this resource' });
        }
        // Delete resource
        const deleted = await resource_model_1.ResourceModel.delete(id);
        if (!deleted) {
            return res.status(400).json({ message: 'Failed to delete resource' });
        }
        res.status(200).json({ message: 'Resource deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting resource:', error);
        res.status(500).json({
            message: 'Error deleting resource',
            error: error.message
        });
    }
};
exports.deleteResource = deleteResource;
// Add a comment to a resource
const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ message: 'Comment content is required' });
        }
        // Check if resource exists
        const resource = await resource_model_1.ResourceModel.findById(id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        // Add comment
        const added = await resource_model_1.ResourceModel.addComment(id, userId, content);
        if (!added) {
            return res.status(400).json({ message: 'Failed to add comment' });
        }
        // Get updated resource
        const updatedResource = await resource_model_1.ResourceModel.findById(id);
        res.status(200).json({
            message: 'Comment added successfully',
            resource: updatedResource
        });
    }
    catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({
            message: 'Error adding comment',
            error: error.message
        });
    }
};
exports.addComment = addComment;
// Rate a resource
const rateResource = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const { rating, review } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Valid rating (1-5) is required' });
        }
        // Check if resource exists
        const resource = await resource_model_1.ResourceModel.findById(id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        // Create rating
        const ratingData = {
            resourceId: new mongodb_1.ObjectId(id),
            userId: new mongodb_1.ObjectId(userId),
            rating,
            review,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        // Add rating
        const added = await resource_model_1.ResourceModel.rateResource(ratingData);
        if (!added) {
            return res.status(400).json({ message: 'Failed to rate resource' });
        }
        // Get updated resource
        const updatedResource = await resource_model_1.ResourceModel.findById(id);
        res.status(200).json({
            message: 'Resource rated successfully',
            resource: updatedResource
        });
    }
    catch (error) {
        console.error('Error rating resource:', error);
        res.status(500).json({
            message: 'Error rating resource',
            error: error.message
        });
    }
};
exports.rateResource = rateResource;
