import { ObjectId, Collection } from 'mongodb';
import { getDB, COLLECTIONS } from '../config/db.config';

export interface IMentorship {
  _id?: ObjectId;
  mentorId: ObjectId;
  menteeId: ObjectId;
  status: 'pending' | 'active' | 'completed' | 'declined' | 'canceled';
  requestMessage?: string;
  goals?: string[];
  topics?: string[];
  startDate?: Date;
  endDate?: Date;
  meetingFrequency?: 'weekly' | 'biweekly' | 'monthly' | 'asNeeded';
  meetingPreference?: 'inPerson' | 'virtual' | 'both';
  feedback?: {
    mentorFeedback?: {
      rating?: number;
      comment?: string;
      date?: Date;
    };
    menteeFeedback?: {
      rating?: number;
      comment?: string;
      date?: Date;
    };
  };
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class MentorshipModel {
  private static getCollection(): Collection<IMentorship> {
    const db = getDB();
    if (!db) throw new Error('Database connection not established');
    return db.collection<IMentorship>(COLLECTIONS.MENTORSHIPS);
  }

  static async findById(id: string | ObjectId): Promise<IMentorship | null> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    return this.getCollection().findOne({ _id });
  }

  static async create(mentorshipData: IMentorship): Promise<IMentorship> {
    mentorshipData.createdAt = new Date();
    mentorshipData.updatedAt = new Date();
    mentorshipData.status = mentorshipData.status || 'pending';
    
    const result = await this.getCollection().insertOne(mentorshipData);
    return { ...mentorshipData, _id: result.insertedId };
  }

  static async updateById(id: string | ObjectId, updateData: Partial<IMentorship>): Promise<boolean> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    updateData.updatedAt = new Date();
    
    const result = await this.getCollection().updateOne(
      { _id },
      { $set: updateData }
    );
    
    return result.modifiedCount > 0;
  }

  static async findByMentorId(mentorId: string | ObjectId, status?: IMentorship['status']): Promise<IMentorship[]> {
    const _mentorId = typeof mentorId === 'string' ? new ObjectId(mentorId) : mentorId;
    
    const query: any = { mentorId: _mentorId };
    if (status) {
      query.status = status;
    }
    
    return this.getCollection().find(query).toArray();
  }

  static async findByMenteeId(menteeId: string | ObjectId, status?: IMentorship['status']): Promise<IMentorship[]> {
    const _menteeId = typeof menteeId === 'string' ? new ObjectId(menteeId) : menteeId;
    
    const query: any = { menteeId: _menteeId };
    if (status) {
      query.status = status;
    }
    
    return this.getCollection().find(query).toArray();
  }

  static async findActiveMentorships(userId: string | ObjectId): Promise<IMentorship[]> {
    const _userId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    
    return this.getCollection().find({
      $or: [
        { mentorId: _userId, status: 'active' },
        { menteeId: _userId, status: 'active' }
      ]
    }).toArray();
  }

  static async countMentorships(userId: string | ObjectId, role: 'mentor' | 'mentee'): Promise<number> {
    const _userId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    
    const query = role === 'mentor' 
      ? { mentorId: _userId }
      : { menteeId: _userId };
    
    return this.getCollection().countDocuments(query);
  }
} 