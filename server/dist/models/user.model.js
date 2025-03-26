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
exports.UserModel = void 0;
const mongodb_1 = require("mongodb");
const database_1 = require("../config/database");
const auth_utils_1 = require("../utils/auth.utils");
class UserModel {
    static getUserCollection() {
        const db = (0, database_1.getDb)();
        return db.collection('users');
    }
    static async createUser(userData) {
        const collection = this.getUserCollection();
        // Hash the password before storing
        const hashedPassword = await (0, auth_utils_1.hashPassword)(userData.password);
        const userToInsert = Object.assign(Object.assign({}, userData), { password: hashedPassword, isVerified: userData.isVerified || false, isActive: userData.isActive || true, createdAt: new Date(), updatedAt: new Date() });
        const result = await collection.insertOne(userToInsert);
        return Object.assign(Object.assign({}, userToInsert), { _id: result.insertedId });
    }
    static async findUserByEmail(email) {
        const collection = this.getUserCollection();
        return await collection.findOne({ email });
    }
    static async findUserById(id) {
        if (typeof id === 'string') {
            id = new mongodb_1.ObjectId(id);
        }
        const collection = this.getUserCollection();
        return await collection.findOne({ _id: id });
    }
    static async updateUser(id, updateData) {
        if (typeof id === 'string') {
            id = new mongodb_1.ObjectId(id);
        }
        const collection = this.getUserCollection();
        // Don't allow updating role or email directly for security
        const { role, email, _id, password } = updateData, safeUpdateData = __rest(updateData, ["role", "email", "_id", "password"]);
        // If there's a new password, hash it
        if (password) {
            safeUpdateData.password = await (0, auth_utils_1.hashPassword)(password);
        }
        safeUpdateData.updatedAt = new Date();
        const result = await collection.updateOne({ _id: id }, { $set: safeUpdateData });
        return result.modifiedCount > 0;
    }
    static async updateLastLogin(id) {
        if (typeof id === 'string') {
            id = new mongodb_1.ObjectId(id);
        }
        const collection = this.getUserCollection();
        const result = await collection.updateOne({ _id: id }, { $set: { lastLoginAt: new Date() } });
        return result.modifiedCount > 0;
    }
    static async findStudents(query = {}, options = {}) {
        const collection = this.getUserCollection();
        return await collection
            .find(Object.assign(Object.assign({}, query), { role: 'student' }))
            .limit(options.limit || 20)
            .skip(options.skip || 0)
            .toArray();
    }
    static async findAlumni(query = {}, options = {}) {
        const collection = this.getUserCollection();
        return await collection
            .find(Object.assign(Object.assign({}, query), { role: 'alumni' }))
            .limit(options.limit || 20)
            .skip(options.skip || 0)
            .toArray();
    }
    static async findMentors(query = {}, options = {}) {
        const collection = this.getUserCollection();
        return await collection
            .find(Object.assign(Object.assign({}, query), { role: 'alumni', isAvailableForMentoring: true }))
            .limit(options.limit || 20)
            .skip(options.skip || 0)
            .toArray();
    }
    static async countUsers(role) {
        const collection = this.getUserCollection();
        const query = role ? { role } : {};
        return await collection.countDocuments(query);
    }
    static async getRecentUsers(limit = 10, role) {
        const collection = this.getUserCollection();
        const query = role ? { role } : {};
        return await collection
            .find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .toArray();
    }
}
exports.UserModel = UserModel;
