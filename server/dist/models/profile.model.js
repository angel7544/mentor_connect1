"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileModel = void 0;
const mongodb_1 = require("mongodb");
const db_config_1 = require("../config/db.config");
class ProfileModel {
    static getCollection() {
        const db = (0, db_config_1.getDB)();
        if (!db)
            throw new Error('Database connection not established');
        return db.collection(db_config_1.COLLECTIONS.PROFILES);
    }
    static async findByUserId(userId) {
        const _userId = typeof userId === 'string' ? new mongodb_1.ObjectId(userId) : userId;
        return this.getCollection().findOne({ userId: _userId });
    }
    static async findById(id) {
        const _id = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        return this.getCollection().findOne({ _id });
    }
    static async create(profileData) {
        profileData.createdAt = new Date();
        profileData.updatedAt = new Date();
        const result = await this.getCollection().insertOne(profileData);
        return Object.assign(Object.assign({}, profileData), { _id: result.insertedId });
    }
    static async updateById(id, updateData) {
        const _id = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        updateData.updatedAt = new Date();
        const result = await this.getCollection().updateOne({ _id }, { $set: updateData });
        return result.modifiedCount > 0;
    }
    static async updateByUserId(userId, updateData) {
        const _userId = typeof userId === 'string' ? new mongodb_1.ObjectId(userId) : userId;
        updateData.updatedAt = new Date();
        const result = await this.getCollection().updateOne({ userId: _userId }, { $set: updateData });
        return result.modifiedCount > 0;
    }
    static async findMentors(filters = {}) {
        const { skills, interests, limit = 10, skip = 0 } = filters;
        const query = {
            'availability.mentorshipAvailable': true
        };
        if (skills && skills.length > 0) {
            query.skills = { $in: skills };
        }
        if (interests && interests.length > 0) {
            query.interests = { $in: interests };
        }
        return this.getCollection()
            .find(query)
            .skip(skip)
            .limit(limit)
            .toArray();
    }
}
exports.ProfileModel = ProfileModel;
