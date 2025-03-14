import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { EventModel, IEvent } from '../models/event.model';
import { UserModel } from '../models/user.model';

// Create a new event
export const createEvent = async (req: Request, res: Response) => {
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
    const event: IEvent = {
      ...eventData,
      organizerId: new ObjectId(organizerId),
      startDate,
      endDate,
      isPublic: eventData.isPublic !== undefined ? eventData.isPublic : true,
      attendees: [],
      status: 'upcoming',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    if (eventData.registrationDeadline) {
      event.registrationDeadline = new Date(eventData.registrationDeadline);
    }
    
    const createdEvent = await EventModel.create(event);
    
    res.status(201).json({
      message: 'Event created successfully',
      event: createdEvent
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      message: 'Error creating event',
      error: error.message
    });
  }
};

// Get all events
export const getEvents = async (req: Request, res: Response) => {
  try {
    const { 
      status, 
      category, 
      tags, 
      startDate,
      endDate,
      isPublic,
      limit, 
      skip 
    } = req.query;
    
    const filters: any = {};
    
    if (status) {
      filters.status = Array.isArray(status) ? status : status as string;
    }
    
    if (category) {
      filters.category = category as string;
    }
    
    if (tags) {
      filters.tags = Array.isArray(tags) ? tags : [tags as string];
    }
    
    if (startDate) {
      filters.startDate = new Date(startDate as string);
    }
    
    if (endDate) {
      filters.endDate = new Date(endDate as string);
    }
    
    if (isPublic !== undefined) {
      filters.isPublic = isPublic === 'true';
    }
    
    if (limit) {
      filters.limit = parseInt(limit as string);
    }
    
    if (skip) {
      filters.skip = parseInt(skip as string);
    }
    
    const events = await EventModel.findAll(filters);
    
    // Get organizer details for each event
    const eventsWithOrganizers = await Promise.all(
      events.map(async (event) => {
        const organizer = await UserModel.findById(event.organizerId);
        
        if (!organizer) return event;
        
        // Remove sensitive information
        const { password, ...organizerWithoutPassword } = organizer;
        
        return {
          ...event,
          organizer: organizerWithoutPassword
        };
      })
    );
    
    res.status(200).json({ events: eventsWithOrganizers });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      message: 'Error fetching events',
      error: error.message
    });
  }
};

// Get event by ID
export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const event = await EventModel.findById(id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Get organizer details
    const organizer = await UserModel.findById(event.organizerId);
    
    let organizerData = null;
    if (organizer) {
      // Remove sensitive information
      const { password, ...organizerWithoutPassword } = organizer;
      organizerData = organizerWithoutPassword;
    }
    
    // Get attendee details
    const attendeesWithDetails = await Promise.all(
      (event.attendees || []).map(async (attendee) => {
        const user = await UserModel.findById(attendee.userId);
        
        if (!user) return attendee;
        
        // Remove sensitive information
        const { password, ...userWithoutPassword } = user;
        
        return {
          ...attendee,
          user: userWithoutPassword
        };
      })
    );
    
    res.status(200).json({
      event: {
        ...event,
        organizer: organizerData,
        attendees: attendeesWithDetails
      }
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      message: 'Error fetching event',
      error: error.message
    });
  }
};

// Update event
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updateData = req.body;
    
    // Get event
    const event = await EventModel.findById(id);
    
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
    const updated = await EventModel.updateById(id, {
      ...updateData,
      updatedAt: new Date()
    });
    
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update event' });
    }
    
    // Get updated event
    const updatedEvent = await EventModel.findById(id);
    
    res.status(200).json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      message: 'Error updating event',
      error: error.message
    });
  }
};

// Delete event
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    // Get event
    const event = await EventModel.findById(id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is the organizer or admin
    if (event.organizerId.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to delete this event' });
    }
    
    // Delete event
    const deleted = await EventModel.delete(id);
    
    if (!deleted) {
      return res.status(400).json({ message: 'Failed to delete event' });
    }
    
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      message: 'Error deleting event',
      error: error.message
    });
  }
};

// Register for an event
export const registerForEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    // Register for event
    try {
      const registered = await EventModel.registerForEvent(id, userId);
      
      if (!registered) {
        return res.status(400).json({ message: 'Failed to register for event' });
      }
      
      // Get updated event
      const updatedEvent = await EventModel.findById(id);
      
      res.status(200).json({
        message: 'Registered for event successfully',
        event: updatedEvent
      });
    } catch (error) {
      // Handle specific error messages from the model
      return res.status(400).json({ message: error.message });
    }
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({
      message: 'Error registering for event',
      error: error.message
    });
  }
};

// Cancel event registration
export const cancelEventRegistration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    // Cancel registration
    const cancelled = await EventModel.cancelRegistration(id, userId);
    
    if (!cancelled) {
      return res.status(400).json({ message: 'Failed to cancel registration' });
    }
    
    // Get updated event
    const updatedEvent = await EventModel.findById(id);
    
    res.status(200).json({
      message: 'Registration cancelled successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Error cancelling registration:', error);
    res.status(500).json({
      message: 'Error cancelling registration',
      error: error.message
    });
  }
};

// Get upcoming events for dashboard
export const getUpcomingEvents = async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;
    
    const parsedLimit = limit ? parseInt(limit as string) : 5;
    
    const events = await EventModel.getUpcomingEvents(parsedLimit);
    
    // Get organizer details for each event
    const eventsWithOrganizers = await Promise.all(
      events.map(async (event) => {
        const organizer = await UserModel.findById(event.organizerId);
        
        if (!organizer) return event;
        
        // Remove sensitive information
        const { password, ...organizerWithoutPassword } = organizer;
        
        return {
          ...event,
          organizer: organizerWithoutPassword
        };
      })
    );
    
    res.status(200).json({ events: eventsWithOrganizers });
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({
      message: 'Error fetching upcoming events',
      error: error.message
    });
  }
};

// Get user's events
export const getUserEvents = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    
    const events = await EventModel.getUserEvents(userId);
    
    // Get organizer details for each event
    const eventsWithOrganizers = await Promise.all(
      events.map(async (event) => {
        const organizer = await UserModel.findById(event.organizerId);
        
        if (!organizer) return event;
        
        // Remove sensitive information
        const { password, ...organizerWithoutPassword } = organizer;
        
        return {
          ...event,
          organizer: organizerWithoutPassword
        };
      })
    );
    
    res.status(200).json({ events: eventsWithOrganizers });
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({
      message: 'Error fetching user events',
      error: error.message
    });
  }
};

// Get events organized by the user
export const getOrganizedEvents = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    
    const events = await EventModel.getOrganizedEvents(userId);
    
    res.status(200).json({ events });
  } catch (error) {
    console.error('Error fetching organized events:', error);
    res.status(500).json({
      message: 'Error fetching organized events',
      error: error.message
    });
  }
}; 