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
exports.getOrganizedEvents = exports.getUserEvents = exports.getUpcomingEvents = exports.cancelEventRegistration = exports.registerForEvent = exports.deleteEvent = exports.updateEvent = exports.getEventById = exports.getEvents = exports.createEvent = void 0;
const mongodb_1 = require("mongodb");
const event_model_1 = require("../models/event.model");
const user_model_1 = require("../models/user.model");
// Create a new event
const createEvent = async (req, res) => {
    try {
        const organizerId = req.user._id;
        const eventData = req.body;
        // Validate required fields
        if (!eventData.title || !eventData.description || !eventData.startDate || !eventData.endDate) {
            return res.status(400).json({
                message: 'Title, description, start date, and end date are required'
            });
        }
        // Convert string dates to Date objects
        const startDate = new Date(eventData.startDate);
        const endDate = new Date(eventData.endDate);
        // Validate dates
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }
        if (startDate > endDate) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }
        // Create event
        const event = Object.assign(Object.assign({}, eventData), { organizerId: new mongodb_1.ObjectId(organizerId), startDate,
            endDate, isPublic: eventData.isPublic !== undefined ? eventData.isPublic : true, attendees: [], status: 'upcoming', createdAt: new Date(), updatedAt: new Date() });
        if (eventData.registrationDeadline) {
            event.registrationDeadline = new Date(eventData.registrationDeadline);
        }
        const createdEvent = await event_model_1.EventModel.create(event);
        res.status(201).json({
            message: 'Event created successfully',
            event: createdEvent
        });
    }
    catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({
            message: 'Error creating event',
            error: error.message
        });
    }
};
exports.createEvent = createEvent;
// Get all events
const getEvents = async (req, res) => {
    try {
        const { status, category, tags, startDate, endDate, isPublic, limit, skip } = req.query;
        const filters = {};
        if (status) {
            filters.status = Array.isArray(status) ? status : status;
        }
        if (category) {
            filters.category = category;
        }
        if (tags) {
            filters.tags = Array.isArray(tags) ? tags : [tags];
        }
        if (startDate) {
            filters.startDate = new Date(startDate);
        }
        if (endDate) {
            filters.endDate = new Date(endDate);
        }
        if (isPublic !== undefined) {
            filters.isPublic = isPublic === 'true';
        }
        if (limit) {
            filters.limit = parseInt(limit);
        }
        if (skip) {
            filters.skip = parseInt(skip);
        }
        const events = await event_model_1.EventModel.findAll(filters);
        // Get organizer details for each event
        const eventsWithOrganizers = await Promise.all(events.map(async (event) => {
            const organizer = await user_model_1.UserModel.findById(event.organizerId);
            if (!organizer)
                return event;
            // Remove sensitive information
            const { password } = organizer, organizerWithoutPassword = __rest(organizer, ["password"]);
            return Object.assign(Object.assign({}, event), { organizer: organizerWithoutPassword });
        }));
        res.status(200).json({ events: eventsWithOrganizers });
    }
    catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({
            message: 'Error fetching events',
            error: error.message
        });
    }
};
exports.getEvents = getEvents;
// Get event by ID
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await event_model_1.EventModel.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        // Get organizer details
        const organizer = await user_model_1.UserModel.findById(event.organizerId);
        let organizerData = null;
        if (organizer) {
            // Remove sensitive information
            const { password } = organizer, organizerWithoutPassword = __rest(organizer, ["password"]);
            organizerData = organizerWithoutPassword;
        }
        // Get attendee details
        const attendeesWithDetails = await Promise.all((event.attendees || []).map(async (attendee) => {
            const user = await user_model_1.UserModel.findById(attendee.userId);
            if (!user)
                return attendee;
            // Remove sensitive information
            const { password } = user, userWithoutPassword = __rest(user, ["password"]);
            return Object.assign(Object.assign({}, attendee), { user: userWithoutPassword });
        }));
        res.status(200).json({
            event: Object.assign(Object.assign({}, event), { organizer: organizerData, attendees: attendeesWithDetails })
        });
    }
    catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({
            message: 'Error fetching event',
            error: error.message
        });
    }
};
exports.getEventById = getEventById;
// Update event
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const updateData = req.body;
        // Get event
        const event = await event_model_1.EventModel.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        // Check if user is the organizer or admin
        if (event.organizerId.toString() !== userId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to update this event' });
        }
        // Process date fields
        if (updateData.startDate) {
            updateData.startDate = new Date(updateData.startDate);
        }
        if (updateData.endDate) {
            updateData.endDate = new Date(updateData.endDate);
        }
        if (updateData.registrationDeadline) {
            updateData.registrationDeadline = new Date(updateData.registrationDeadline);
        }
        // Update event
        const updated = await event_model_1.EventModel.updateById(id, Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }));
        if (!updated) {
            return res.status(400).json({ message: 'Failed to update event' });
        }
        // Get updated event
        const updatedEvent = await event_model_1.EventModel.findById(id);
        res.status(200).json({
            message: 'Event updated successfully',
            event: updatedEvent
        });
    }
    catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({
            message: 'Error updating event',
            error: error.message
        });
    }
};
exports.updateEvent = updateEvent;
// Delete event
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        // Get event
        const event = await event_model_1.EventModel.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        // Check if user is the organizer or admin
        if (event.organizerId.toString() !== userId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to delete this event' });
        }
        // Delete event
        const deleted = await event_model_1.EventModel.delete(id);
        if (!deleted) {
            return res.status(400).json({ message: 'Failed to delete event' });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({
            message: 'Error deleting event',
            error: error.message
        });
    }
};
exports.deleteEvent = deleteEvent;
// Register for an event
const registerForEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        // Register for event
        try {
            const registered = await event_model_1.EventModel.registerForEvent(id, userId);
            if (!registered) {
                return res.status(400).json({ message: 'Failed to register for event' });
            }
            // Get updated event
            const updatedEvent = await event_model_1.EventModel.findById(id);
            res.status(200).json({
                message: 'Registered for event successfully',
                event: updatedEvent
            });
        }
        catch (error) {
            // Handle specific error messages from the model
            return res.status(400).json({ message: error.message });
        }
    }
    catch (error) {
        console.error('Error registering for event:', error);
        res.status(500).json({
            message: 'Error registering for event',
            error: error.message
        });
    }
};
exports.registerForEvent = registerForEvent;
// Cancel event registration
const cancelEventRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        // Cancel registration
        const cancelled = await event_model_1.EventModel.cancelRegistration(id, userId);
        if (!cancelled) {
            return res.status(400).json({ message: 'Failed to cancel registration' });
        }
        // Get updated event
        const updatedEvent = await event_model_1.EventModel.findById(id);
        res.status(200).json({
            message: 'Registration cancelled successfully',
            event: updatedEvent
        });
    }
    catch (error) {
        console.error('Error cancelling registration:', error);
        res.status(500).json({
            message: 'Error cancelling registration',
            error: error.message
        });
    }
};
exports.cancelEventRegistration = cancelEventRegistration;
// Get upcoming events for dashboard
const getUpcomingEvents = async (req, res) => {
    try {
        const { limit } = req.query;
        const parsedLimit = limit ? parseInt(limit) : 5;
        const events = await event_model_1.EventModel.getUpcomingEvents(parsedLimit);
        // Get organizer details for each event
        const eventsWithOrganizers = await Promise.all(events.map(async (event) => {
            const organizer = await user_model_1.UserModel.findById(event.organizerId);
            if (!organizer)
                return event;
            // Remove sensitive information
            const { password } = organizer, organizerWithoutPassword = __rest(organizer, ["password"]);
            return Object.assign(Object.assign({}, event), { organizer: organizerWithoutPassword });
        }));
        res.status(200).json({ events: eventsWithOrganizers });
    }
    catch (error) {
        console.error('Error fetching upcoming events:', error);
        res.status(500).json({
            message: 'Error fetching upcoming events',
            error: error.message
        });
    }
};
exports.getUpcomingEvents = getUpcomingEvents;
// Get user's events
const getUserEvents = async (req, res) => {
    try {
        const userId = req.user._id;
        const events = await event_model_1.EventModel.getUserEvents(userId);
        // Get organizer details for each event
        const eventsWithOrganizers = await Promise.all(events.map(async (event) => {
            const organizer = await user_model_1.UserModel.findById(event.organizerId);
            if (!organizer)
                return event;
            // Remove sensitive information
            const { password } = organizer, organizerWithoutPassword = __rest(organizer, ["password"]);
            return Object.assign(Object.assign({}, event), { organizer: organizerWithoutPassword });
        }));
        res.status(200).json({ events: eventsWithOrganizers });
    }
    catch (error) {
        console.error('Error fetching user events:', error);
        res.status(500).json({
            message: 'Error fetching user events',
            error: error.message
        });
    }
};
exports.getUserEvents = getUserEvents;
// Get events organized by the user
const getOrganizedEvents = async (req, res) => {
    try {
        const userId = req.user._id;
        const events = await event_model_1.EventModel.getOrganizedEvents(userId);
        res.status(200).json({ events });
    }
    catch (error) {
        console.error('Error fetching organized events:', error);
        res.status(500).json({
            message: 'Error fetching organized events',
            error: error.message
        });
    }
};
exports.getOrganizedEvents = getOrganizedEvents;
