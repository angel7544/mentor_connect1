import { ObjectId, Collection } from 'mongodb';
import { getDB, COLLECTIONS } from '../config/db.config';

export interface IEvent {
  _id?: ObjectId;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: {
    type: 'virtual' | 'in-person' | 'hybrid';
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    virtualLink?: string;
  };
  organizerId: ObjectId;
  imageUrl?: string;
  capacity?: number;
  tags?: string[];
  category?: string;
  registrationDeadline?: Date;
  isPaid?: boolean;
  price?: number;
  attendees?: {
    userId: ObjectId;
    registrationDate: Date;
    hasPaid?: boolean;
    status: 'registered' | 'waitlisted' | 'attended' | 'cancelled';
  }[];
  isPublic: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

export class EventModel {
  private static getCollection(): Collection<IEvent> {
    const db = getDB();
    if (!db) throw new Error('Database connection not established');
    return db.collection<IEvent>(COLLECTIONS.EVENTS);
  }

  static async findById(id: string | ObjectId): Promise<IEvent | null> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    return this.getCollection().findOne({ _id });
  }

  static async create(eventData: IEvent): Promise<IEvent> {
    eventData.createdAt = new Date();
    eventData.updatedAt = new Date();
    eventData.attendees = eventData.attendees || [];
    
    // Set default status based on dates if not provided
    if (!eventData.status) {
      const now = new Date();
      if (eventData.startDate > now) {
        eventData.status = 'upcoming';
      } else if (eventData.endDate < now) {
        eventData.status = 'completed';
      } else {
        eventData.status = 'ongoing';
      }
    }
    
    const result = await this.getCollection().insertOne(eventData);
    return { ...eventData, _id: result.insertedId };
  }

  static async updateById(id: string | ObjectId, updateData: Partial<IEvent>): Promise<boolean> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
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
        } else if (endDate < now) {
          updateData.status = 'completed';
        } else {
          updateData.status = 'ongoing';
        }
      }
    }
    
    const result = await this.getCollection().updateOne(
      { _id },
      { $set: updateData }
    );
    
    return result.modifiedCount > 0;
  }

  static async delete(id: string | ObjectId): Promise<boolean> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    
    const result = await this.getCollection().deleteOne({ _id });
    return result.deletedCount > 0;
  }

  static async registerForEvent(eventId: string | ObjectId, userId: string | ObjectId): Promise<boolean> {
    const _eventId = typeof eventId === 'string' ? new ObjectId(eventId) : eventId;
    const _userId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    
    // Get event to check if registration is possible
    const event = await this.findById(_eventId);
    
    if (!event) {
      throw new Error('Event not found');
    }
    
    // Check if user is already registered
    const isRegistered = event.attendees?.some(a => a.userId.toString() === _userId.toString());
    if (isRegistered) {
      throw new Error('User is already registered for this event');
    }
    
    // Check if registration deadline has passed
    const now = new Date();
    if (event.registrationDeadline && event.registrationDeadline < now) {
      throw new Error('Registration deadline has passed');
    }
    
    // Check if event is at capacity
    const attendeeCount = event.attendees?.length || 0;
    const status = event.capacity && attendeeCount >= event.capacity ? 'waitlisted' : 'registered';
    
    // Register user
    const result = await this.getCollection().updateOne(
      { _id: _eventId },
      { 
        $push: { 
          attendees: {
            userId: _userId,
            registrationDate: now,
            hasPaid: !event.isPaid, // Set as paid if event is free
            status
          }
        },
        $set: { updatedAt: now }
      }
    );
    
    return result.modifiedCount > 0;
  }

  static async cancelRegistration(eventId: string | ObjectId, userId: string | ObjectId): Promise<boolean> {
    const _eventId = typeof eventId === 'string' ? new ObjectId(eventId) : eventId;
    const _userId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    
    const result = await this.getCollection().updateOne(
      { _id: _eventId, 'attendees.userId': _userId },
      { 
        $set: { 
          'attendees.$.status': 'cancelled',
          updatedAt: new Date()
        }
      }
    );
    
    return result.modifiedCount > 0;
  }

  static async findAll(
    filters: {
      status?: IEvent['status'] | IEvent['status'][];
      category?: string;
      tags?: string[];
      startDate?: Date;
      endDate?: Date;
      isPublic?: boolean;
      limit?: number;
      skip?: number;
    } = {}
  ): Promise<IEvent[]> {
    const { 
      status, 
      category, 
      tags, 
      startDate, 
      endDate, 
      isPublic = true,
      limit = 20, 
      skip = 0
    } = filters;
    
    const query: any = { isPublic };
    
    if (status) {
      if (Array.isArray(status)) {
        query.status = { $in: status };
      } else {
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
    } else if (startDate) {
      query.startDate = { $gte: startDate };
    } else if (endDate) {
      query.endDate = { $lte: endDate };
    }
    
    return this.getCollection()
      .find(query)
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  static async getUpcomingEvents(limit: number = 5): Promise<IEvent[]> {
    const now = new Date();
    
    return this.getCollection()
      .find({ startDate: { $gt: now }, isPublic: true, status: 'upcoming' })
      .sort({ startDate: 1 })
      .limit(limit)
      .toArray();
  }

  static async getUserEvents(userId: string | ObjectId): Promise<IEvent[]> {
    const _userId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    
    return this.getCollection()
      .find({ 'attendees.userId': _userId })
      .sort({ startDate: 1 })
      .toArray();
  }

  static async getOrganizedEvents(organizerId: string | ObjectId): Promise<IEvent[]> {
    const _organizerId = typeof organizerId === 'string' ? new ObjectId(organizerId) : organizerId;
    
    return this.getCollection()
      .find({ organizerId: _organizerId })
      .sort({ startDate: 1 })
      .toArray();
  }
} 