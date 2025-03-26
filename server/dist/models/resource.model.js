"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceModel = void 0;
const mongodb_1 = require("mongodb");
const db_config_1 = require("../config/db.config");
class ResourceModel {
    static getResourceCollection() {
        const db = (0, db_config_1.getDB)();
        if (!db)
            throw new Error('Database connection not established');
        return db.collection(db_config_1.COLLECTIONS.RESOURCES);
    }
    static getRatingCollection() {
        const db = (0, db_config_1.getDB)();
        if (!db)
            throw new Error('Database connection not established');
        return db.collection('resource_ratings');
    }
    static async findById(id) {
        const _id = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        return this.getResourceCollection().findOne({ _id });
    }
    static async create(resourceData) {
        resourceData.createdAt = new Date();
        resourceData.updatedAt = new Date();
        resourceData.viewCount = 0;
        resourceData.rating = { average: 0, count: 0 };
        const result = await this.getResourceCollection().insertOne(resourceData);
        return Object.assign(Object.assign({}, resourceData), { _id: result.insertedId });
    }
    static async updateById(id, updateData) {
        const _id = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        updateData.updatedAt = new Date();
        const result = await this.getResourceCollection().updateOne({ _id }, { $set: updateData });
        return result.modifiedCount > 0;
    }
    static async delete(id) {
        const _id = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        const result = await this.getResourceCollection().deleteOne({ _id });
        return result.deletedCount > 0;
    }
    static async incrementViewCount(id) {
        const _id = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        const result = await this.getResourceCollection().updateOne({ _id }, { $inc: { viewCount: 1 }, $set: { updatedAt: new Date() } });
        return result.modifiedCount > 0;
    }
    static async findAll(filters = {}) {
        const { searchQuery, categories, tags, resourceType, limit = 20, skip = 0, sortBy = 'createdAt', sortDirection = 'desc' } = filters;
        const query = { isPublic: true };
        if (searchQuery) {
            query.$or = [
                { title: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
                { tags: { $regex: searchQuery, $options: 'i' } }
            ];
        }
        if (categories && categories.length > 0) {
            query.categories = { $in: categories };
        }
        if (tags && tags.length > 0) {
            query.tags = { $in: tags };
        }
        if (resourceType) {
            if (Array.isArray(resourceType)) {
                query.resourceType = { $in: resourceType };
            }
            else {
                query.resourceType = resourceType;
            }
        }
        const sortOption = {};
        sortOption[sortBy] = sortDirection === 'asc' ? 1 : -1;
        return this.getResourceCollection()
            .find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .toArray();
    }
    static async addComment(resourceId, userId, content) {
        const _resourceId = typeof resourceId === 'string' ? new mongodb_1.ObjectId(resourceId) : resourceId;
        const _userId = typeof userId === 'string' ? new mongodb_1.ObjectId(userId) : userId;
        const comment = {
            _id: new mongodb_1.ObjectId(),
            userId: _userId,
            content,
            createdAt: new Date()
        };
        const result = await this.getResourceCollection().updateOne({ _id: _resourceId }, {
            $push: { comments: comment },
            $set: { updatedAt: new Date() }
        });
        return result.modifiedCount > 0;
    }
    static async rateResource(rating) {
        rating.createdAt = new Date();
        rating.updatedAt = new Date();
        // Convert string IDs to ObjectId if needed
        if (typeof rating.resourceId === 'string') {
            rating.resourceId = new mongodb_1.ObjectId(rating.resourceId);
        }
        if (typeof rating.userId === 'string') {
            rating.userId = new mongodb_1.ObjectId(rating.userId);
        }
        // Check if user has already rated this resource
        const existingRating = await this.getRatingCollection().findOne({
            resourceId: rating.resourceId,
            userId: rating.userId
        });
        if (existingRating) {
            // Update existing rating
            await this.getRatingCollection().updateOne({ _id: existingRating._id }, { $set: { rating: rating.rating, review: rating.review, updatedAt: new Date() } });
        }
        else {
            // Add new rating
            await this.getRatingCollection().insertOne(rating);
        }
        // Calculate new average rating
        const ratings = await this.getRatingCollection()
            .find({ resourceId: rating.resourceId })
            .toArray();
        const sum = ratings.reduce((total, curr) => total + curr.rating, 0);
        const average = ratings.length > 0 ? sum / ratings.length : 0;
        // Update resource with new rating information
        const result = await this.getResourceCollection().updateOne({ _id: rating.resourceId }, {
            $set: {
                'rating.average': average,
                'rating.count': ratings.length,
                updatedAt: new Date()
            }
        });
        return result.modifiedCount > 0;
    }
}
exports.ResourceModel = ResourceModel;
