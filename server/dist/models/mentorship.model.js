"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorshipModel = void 0;
const mongodb_1 = require("mongodb");
const db_config_1 = require("../config/db.config");
class MentorshipModel {
    static getCollection() {
        const db = (0, db_config_1.getDB)();
        if (!db)
            throw new Error('Database connection not established');
        return db.collection(db_config_1.COLLECTIONS.MENTORSHIPS);
    }
    static async findById(id) {
        const _id = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        return this.getCollection().findOne({ _id });
    }
    static async create(mentorshipData) {
        mentorshipData.createdAt = new Date();
        mentorshipData.updatedAt = new Date();
        mentorshipData.status = mentorshipData.status || 'pending';
        const result = await this.getCollection().insertOne(mentorshipData);
        return Object.assign(Object.assign({}, mentorshipData), { _id: result.insertedId });
    }
    static async updateById(id, updateData) {
        const _id = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        updateData.updatedAt = new Date();
        const result = await this.getCollection().updateOne({ _id }, { $set: updateData });
        return result.modifiedCount > 0;
    }
    static async findByMentorId(mentorId, status) {
        const _mentorId = typeof mentorId === 'string' ? new mongodb_1.ObjectId(mentorId) : mentorId;
        const query = { mentorId: _mentorId };
        if (status) {
            query.status = status;
        }
        return this.getCollection().find(query).toArray();
    }
    static async findByMenteeId(menteeId, status) {
        const _menteeId = typeof menteeId === 'string' ? new mongodb_1.ObjectId(menteeId) : menteeId;
        const query = { menteeId: _menteeId };
        if (status) {
            query.status = status;
        }
        return this.getCollection().find(query).toArray();
    }
    static async findActiveMentorships(userId) {
        const _userId = typeof userId === 'string' ? new mongodb_1.ObjectId(userId) : userId;
        return this.getCollection().find({
            $or: [
                { mentorId: _userId, status: 'active' },
                { menteeId: _userId, status: 'active' }
            ]
        }).toArray();
    }
    static async countMentorships(userId, role) {
        const _userId = typeof userId === 'string' ? new mongodb_1.ObjectId(userId) : userId;
        const query = role === 'mentor'
            ? { mentorId: _userId }
            : { menteeId: _userId };
        return this.getCollection().countDocuments(query);
    }
}
exports.MentorshipModel = MentorshipModel;
