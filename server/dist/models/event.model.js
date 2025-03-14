"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventModel = void 0;
const mongodb_1 = require("mongodb");
const db_config_1 = require("../config/db.config");
class EventModel {
    static getCollection() {
        const db = (0, db_config_1.getDB)();
        if (!db)
            throw new Error('Database connection not established');
        return db.collection(db_config_1.COLLECTIONS.EVENTS);
    }
    static async findById(id) {
        const _id = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        return this.getCollection().findOne({ _id });
    }
    static async create(eventData) {
        eventData.createdAt = new Date();
        eventData.updatedAt = new Date();
        eventData.attendees = eventData.attendees || [];
        // Set default status based on dates if not provided
        if (!eventData.status) {
            const now = new Date();
            if (eventData.startDate > now) {
                eventData.status = 'upcoming';
            }
            else if (eventData.endDate < now) {
                eventData.status = 'completed';
            }
            else {
                eventData.status = 'ongoing';
            }
        }
        const result = await this.getCollection().insertOne(eventData);
        return Object.assign(Object.assign({}, eventData), { _id: result.insertedId });
    }
    static async updateById(id, updateData) {
        const _id = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        updateData.updatedAt = new Date();
        // Update status based on dates if dates are being updated
        if (updateData.startDate || updateData.endDate) {
            const event = await this.findById(_id);
            if (event) {
                const startDate = updateData.startDate || event.startDate;
                const endDate = updateData.endDate || event.endDate;
                const now = new Date();
                if (startDate > now) {
                    updateData.status = 'upcoming';
                }
                else if (endDate < now) {
                    updateData.status = 'completed';
                }
                else {
                    updateData.status = 'ongoing';
                }
            }
        }
        const result = await this.getCollection().updateOne({ _id }, { $set: updateData });
        return result.modifiedCount > 0;
    }
    static async delete(id) {
        const _id = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        const result = await this.getCollection().deleteOne({ _id });
        return result.deletedCount > 0;
    }
    static async registerForEvent(eventId, userId) {
        var _a, _b;
        const _eventId = typeof eventId === 'string' ? new mongodb_1.ObjectId(eventId) : eventId;
        const _userId = typeof userId === 'string' ? new mongodb_1.ObjectId(userId) : userId;
        // Get event to check if registration is possible
        const event = await this.findById(_eventId);
        if (!event) {
            throw new Error('Event not found');
        }
        // Check if user is already registered
        const isRegistered = (_a = event.attendees) === null || _a === void 0 ? void 0 : _a.some(a => a.userId.toString() === _userId.toString());
        if (isRegistered) {
            throw new Error('User is already registered for this event');
        }
        // Check if registration deadline has passed
        const now = new Date();
        if (event.registrationDeadline && event.registrationDeadline < now) {
            throw new Error('Registration deadline has passed');
        }
        // Check if event is at capacity
        const attendeeCount = ((_b = event.attendees) === null || _b === void 0 ? void 0 : _b.length) || 0;
        const status = event.capacity && attendeeCount >= event.capacity ? 'waitlisted' : 'registered';
        // Register user
        const result = await this.getCollection().updateOne({ _id: _eventId }, {
            $push: {
                attendees: {
                    userId: _userId,
                    registrationDate: now,
                    hasPaid: !event.isPaid, // Set as paid if event is free
                    status
                }
            },
            $set: { updatedAt: now }
        });
        return result.modifiedCount > 0;
    }
    static async cancelRegistration(eventId, userId) {
        const _eventId = typeof eventId === 'string' ? new mongodb_1.ObjectId(eventId) : eventId;
        const _userId = typeof userId === 'string' ? new mongodb_1.ObjectId(userId) : userId;
        const result = await this.getCollection().updateOne({ _id: _eventId, 'attendees.userId': _userId }, {
            $set: {
                'attendees.$.status': 'cancelled',
                updatedAt: new Date()
            }
        });
        return result.modifiedCount > 0;
    }
    static async findAll(filters = {}) {
        const { status, category, tags, startDate, endDate, isPublic = true, limit = 20, skip = 0 } = filters;
        const query = { isPublic };
        if (status) {
            if (Array.isArray(status)) {
                query.status = { $in: status };
            }
            else {
                query.status = status;
            }
        }
        if (category) {
            query.category = category;
        }
        if (tags && tags.length > 0) {
            query.tags = { $in: tags };
        }
        if (startDate && endDate) {
            query.startDate = { $gte: startDate };
            query.endDate = { $lte: endDate };
        }
        else if (startDate) {
            query.startDate = { $gte: startDate };
        }
        else if (endDate) {
            query.endDate = { $lte: endDate };
        }
        return this.getCollection()
            .find(query)
            .sort({ startDate: 1 })
            .skip(skip)
            .limit(limit)
            .toArray();
    }
    static async getUpcomingEvents(limit = 5) {
        const now = new Date();
        return this.getCollection()
            .find({ startDate: { $gt: now }, isPublic: true, status: 'upcoming' })
            .sort({ startDate: 1 })
            .limit(limit)
            .toArray();
    }
    static async getUserEvents(userId) {
        const _userId = typeof userId === 'string' ? new mongodb_1.ObjectId(userId) : userId;
        return this.getCollection()
            .find({ 'attendees.userId': _userId })
            .sort({ startDate: 1 })
            .toArray();
    }
    static async getOrganizedEvents(organizerId) {
        const _organizerId = typeof organizerId === 'string' ? new mongodb_1.ObjectId(organizerId) : organizerId;
        return this.getCollection()
            .find({ organizerId: _organizerId })
            .sort({ startDate: 1 })
            .toArray();
    }
}
exports.EventModel = EventModel;
