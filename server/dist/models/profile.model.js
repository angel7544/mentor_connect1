"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileModel = void 0;
const mongodb_1 = require("mongodb");
const database_1 = require("../config/database");
class ProfileModel {
    static getCollection() {
        const db = (0, database_1.getDb)();
        if (!db) {
            console.error('Database connection not established');
            throw new Error('Database connection not established');
        }
        return db.collection('profiles');
    }
    static async findByUserId(userId) {
        try {
            console.log('Finding profile for user ID:', userId);
            const _userId = typeof userId === 'string' ? new mongodb_1.ObjectId(userId) : userId;
            const profile = await this.getCollection().findOne({ userId: _userId });
            console.log('Profile found:', profile ? 'Yes' : 'No');
            return profile;
        }
        catch (error) {
            console.error('Error in findByUserId:', error);
            throw error;
        }
    }
    static async findById(id) {
        const _id = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        return this.getCollection().findOne({ _id });
    }
    static async create(profileData) {
        try {
            console.log('Creating new profile with data:', profileData);
            const result = await this.getCollection().insertOne(profileData);
            console.log('Profile created with ID:', result.insertedId);
            return Object.assign(Object.assign({}, profileData), { _id: result.insertedId });
        }
        catch (error) {
            console.error('Error in create:', error);
            throw error;
        }
    }
    static async updateById(id, updateData) {
        const _id = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        updateData.updatedAt = new Date();
        const result = await this.getCollection().updateOne({ _id }, { $set: updateData });
        return result.modifiedCount > 0;
    }
    static async updateByUserId(userId, updateData) {
        try {
            console.log(`Updating profile for user ${userId} with data:`, updateData);
            const collection = await this.getCollection();
            // Convert string ID to ObjectId if needed
            const objectId = typeof userId === 'string' ? new mongodb_1.ObjectId(userId) : userId;
            const result = await collection.findOneAndUpdate({ userId: objectId }, { $set: updateData }, { returnDocument: 'after' });
            if (!result) {
                console.error(`No profile found to update for user ${userId}`);
                return null;
            }
            console.log(`Profile updated successfully for user ${userId}`);
            return result;
        }
        catch (error) {
            console.error(`Error updating profile for user ${userId}:`, error);
            throw error;
        }
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
