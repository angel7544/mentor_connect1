"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForumModel = void 0;
const mongodb_1 = require("mongodb");
const db_config_1 = require("../config/db.config");
class ForumModel {
    static getCategoryCollection() {
        const db = (0, db_config_1.getDB)();
        if (!db)
            throw new Error('Database connection not established');
        return db.collection('forum_categories');
    }
    static getTopicCollection() {
        const db = (0, db_config_1.getDB)();
        if (!db)
            throw new Error('Database connection not established');
        return db.collection('forum_topics');
    }
    static getReplyCollection() {
        const db = (0, db_config_1.getDB)();
        if (!db)
            throw new Error('Database connection not established');
        return db.collection('forum_replies');
    }
    // Category methods
    static async createCategory(categoryData) {
        var _a;
        categoryData.createdAt = new Date();
        categoryData.updatedAt = new Date();
        categoryData.isActive = (_a = categoryData.isActive) !== null && _a !== void 0 ? _a : true;
        const result = await this.getCategoryCollection().insertOne(categoryData);
        return Object.assign(Object.assign({}, categoryData), { _id: result.insertedId });
    }
    static async updateCategory(id, updateData) {
        const _id = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        updateData.updatedAt = new Date();
        const result = await this.getCategoryCollection().updateOne({ _id }, { $set: updateData });
        return result.modifiedCount > 0;
    }
    static async getCategories() {
        return this.getCategoryCollection()
            .find({ isActive: true })
            .sort({ order: 1, name: 1 })
            .toArray();
    }
    static async getCategoryById(id) {
        const _id = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        return this.getCategoryCollection().findOne({ _id });
    }
    // Topic methods
    static async createTopic(topicData) {
        var _a, _b;
        topicData.createdAt = new Date();
        topicData.updatedAt = new Date();
        topicData.viewCount = 0;
        topicData.isSticky = (_a = topicData.isSticky) !== null && _a !== void 0 ? _a : false;
        topicData.isLocked = (_b = topicData.isLocked) !== null && _b !== void 0 ? _b : false;
        const result = await this.getTopicCollection().insertOne(topicData);
        return Object.assign(Object.assign({}, topicData), { _id: result.insertedId });
    }
    static async updateTopic(id, updateData) {
        const _id = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        updateData.updatedAt = new Date();
        const result = await this.getTopicCollection().updateOne({ _id }, { $set: updateData });
        return result.modifiedCount > 0;
    }
    static async getTopicById(id) {
        const _id = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        return this.getTopicCollection().findOne({ _id });
    }
    static async incrementTopicViewCount(id) {
        const _id = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        const result = await this.getTopicCollection().updateOne({ _id }, { $inc: { viewCount: 1 } });
        return result.modifiedCount > 0;
    }
    static async getTopicsByCategory(categoryId, options = {}) {
        const _categoryId = typeof categoryId === 'string' ? new mongodb_1.ObjectId(categoryId) : categoryId;
        const { limit = 20, skip = 0, sortBy = 'createdAt', sortDirection = 'desc' } = options;
        const sortOption = {};
        sortOption[sortBy] = sortDirection === 'asc' ? 1 : -1;
        // Always sort sticky topics to the top
        const pipeline = [
            { $match: { categoryId: _categoryId } },
            { $addFields: { sortOrder: { $cond: [{ $eq: ["$isSticky", true] }, 0, 1] } } },
            { $sort: Object.assign({ sortOrder: 1 }, sortOption) },
            { $skip: skip },
            { $limit: limit }
        ];
        return this.getTopicCollection().aggregate(pipeline).toArray();
    }
    static async getRecentTopics(limit = 10) {
        return this.getTopicCollection()
            .find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .toArray();
    }
    static async getUserTopics(userId, limit = 10) {
        const _userId = typeof userId === 'string' ? new mongodb_1.ObjectId(userId) : userId;
        return this.getTopicCollection()
            .find({ authorId: _userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .toArray();
    }
    // Reply methods
    static async createReply(replyData) {
        replyData.createdAt = new Date();
        replyData.updatedAt = new Date();
        const result = await this.getReplyCollection().insertOne(replyData);
        // Update the topic's last reply information
        await this.getTopicCollection().updateOne({ _id: replyData.topicId }, {
            $set: {
                lastReplyAt: new Date(),
                lastReplyBy: replyData.authorId,
                updatedAt: new Date()
            }
        });
        return Object.assign(Object.assign({}, replyData), { _id: result.insertedId });
    }
    static async updateReply(id, updateData) {
        const _id = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        updateData.updatedAt = new Date();
        updateData.isEdited = true;
        const result = await this.getReplyCollection().updateOne({ _id }, { $set: updateData });
        return result.modifiedCount > 0;
    }
    static async getReplyById(id) {
        const _id = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        return this.getReplyCollection().findOne({ _id });
    }
    static async getRepliesByTopic(topicId, options = {}) {
        const _topicId = typeof topicId === 'string' ? new mongodb_1.ObjectId(topicId) : topicId;
        const { limit = 50, skip = 0 } = options;
        // First get top-level replies sorted by creation date
        return this.getReplyCollection()
            .find({
            topicId: _topicId,
            parentReplyId: { $exists: false }
        })
            .sort({
            isAcceptedAnswer: -1, // Show accepted answers first
            createdAt: 1 // Then oldest to newest
        })
            .skip(skip)
            .limit(limit)
            .toArray();
    }
    static async getNestedReplies(parentReplyId) {
        const _parentReplyId = typeof parentReplyId === 'string' ? new mongodb_1.ObjectId(parentReplyId) : parentReplyId;
        return this.getReplyCollection()
            .find({ parentReplyId: _parentReplyId })
            .sort({ createdAt: 1 })
            .toArray();
    }
    static async markReplyAsAccepted(replyId, topicId) {
        const _replyId = typeof replyId === 'string' ? new mongodb_1.ObjectId(replyId) : replyId;
        const _topicId = typeof topicId === 'string' ? new mongodb_1.ObjectId(topicId) : topicId;
        // First, unmark any previously accepted answers for this topic
        await this.getReplyCollection().updateMany({ topicId: _topicId, isAcceptedAnswer: true }, { $set: { isAcceptedAnswer: false, updatedAt: new Date() } });
        // Then mark the new accepted answer
        const result = await this.getReplyCollection().updateOne({ _id: _replyId }, { $set: { isAcceptedAnswer: true, updatedAt: new Date() } });
        return result.modifiedCount > 0;
    }
    static async getUserReplies(userId, limit = 10) {
        const _userId = typeof userId === 'string' ? new mongodb_1.ObjectId(userId) : userId;
        return this.getReplyCollection()
            .find({ authorId: _userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .toArray();
    }
    static async searchTopics(searchQuery, options = {}) {
        const { limit = 20, skip = 0 } = options;
        return this.getTopicCollection()
            .find({
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { content: { $regex: searchQuery, $options: 'i' } },
                { tags: { $regex: searchQuery, $options: 'i' } }
            ]
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();
    }
}
exports.ForumModel = ForumModel;
