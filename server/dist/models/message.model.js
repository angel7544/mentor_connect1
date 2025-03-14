"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
const mongodb_1 = require("mongodb");
const db_config_1 = require("../config/db.config");
class MessageModel {
    static getMessageCollection() {
        const db = (0, db_config_1.getDB)();
        if (!db)
            throw new Error('Database connection not established');
        return db.collection(db_config_1.COLLECTIONS.MESSAGES);
    }
    static getConversationCollection() {
        const db = (0, db_config_1.getDB)();
        if (!db)
            throw new Error('Database connection not established');
        return db.collection('conversations');
    }
    static async findMessageById(id) {
        const _id = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        return this.getMessageCollection().findOne({ _id });
    }
    static async createMessage(messageData) {
        messageData.createdAt = new Date();
        messageData.updatedAt = new Date();
        // If conversationId is not provided, try to find or create a conversation
        if (!messageData.conversationId) {
            let conversation = null;
            // Check if conversation already exists
            conversation = await this.getConversationCollection().findOne({
                participants: {
                    $all: [
                        typeof messageData.senderId === 'string' ? new mongodb_1.ObjectId(messageData.senderId) : messageData.senderId,
                        typeof messageData.receiverId === 'string' ? new mongodb_1.ObjectId(messageData.receiverId) : messageData.receiverId
                    ]
                }
            });
            // If not, create a new conversation
            if (!conversation) {
                const newConversation = {
                    participants: [
                        typeof messageData.senderId === 'string' ? new mongodb_1.ObjectId(messageData.senderId) : messageData.senderId,
                        typeof messageData.receiverId === 'string' ? new mongodb_1.ObjectId(messageData.receiverId) : messageData.receiverId
                    ],
                    mentorshipId: messageData.mentorshipId,
                    lastMessageAt: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                const result = await this.getConversationCollection().insertOne(newConversation);
                messageData.conversationId = result.insertedId;
            }
            else {
                messageData.conversationId = conversation._id;
                // Update lastMessageAt time
                await this.getConversationCollection().updateOne({ _id: conversation._id }, { $set: { lastMessageAt: new Date(), updatedAt: new Date() } });
            }
        }
        const result = await this.getMessageCollection().insertOne(messageData);
        return Object.assign(Object.assign({}, messageData), { _id: result.insertedId });
    }
    static async markAsRead(messageId) {
        const _id = typeof messageId === 'string' ? new mongodb_1.ObjectId(messageId) : messageId;
        const result = await this.getMessageCollection().updateOne({ _id }, { $set: { readAt: new Date(), updatedAt: new Date() } });
        return result.modifiedCount > 0;
    }
    static async getConversation(conversationId, limit = 50, skip = 0) {
        const _id = typeof conversationId === 'string' ? new mongodb_1.ObjectId(conversationId) : conversationId;
        return this.getMessageCollection()
            .find({ conversationId: _id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();
    }
    static async getUserConversations(userId) {
        const _userId = typeof userId === 'string' ? new mongodb_1.ObjectId(userId) : userId;
        return this.getConversationCollection()
            .find({ participants: _userId })
            .sort({ lastMessageAt: -1 })
            .toArray();
    }
    static async getUnreadCount(userId) {
        const _userId = typeof userId === 'string' ? new mongodb_1.ObjectId(userId) : userId;
        return this.getMessageCollection().countDocuments({
            receiverId: _userId,
            readAt: { $exists: false }
        });
    }
    static async getRecentMessagesForUser(userId, limit = 10) {
        const _userId = typeof userId === 'string' ? new mongodb_1.ObjectId(userId) : userId;
        return this.getMessageCollection()
            .find({
            $or: [
                { senderId: _userId },
                { receiverId: _userId }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .toArray();
    }
}
exports.MessageModel = MessageModel;
