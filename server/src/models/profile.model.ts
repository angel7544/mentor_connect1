import { ObjectId, Collection } from 'mongodb';
import { getDB, COLLECTIONS } from '../config/db.config';

export interface IProfile {
  _id?: ObjectId;
  userId: ObjectId;
  bio?: string;
  headline?: string;
  skills?: string[];
  interests?: string[];
  education?: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startYear: number;
    endYear?: number;
  }[];
  experience?: {
    title: string;
    company: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
  }[];
  socialLinks?: {
    platform: string;
    url: string;
  }[];
  avatarUrl?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    linkedIn?: string;
  };
  availability?: {
    mentorshipAvailable: boolean;
    availableHours?: {
      day: string;
      startTime: string;
      endTime: string;
    }[];
  };
  preferences?: {
    contactPreference?: 'email' | 'in-app' | 'both';
    notificationSettings?: {
      email: boolean;
      app: boolean;
    };
    mentorshipTopics?: string[];
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProfileModel {
  private static getCollection(): Collection<IProfile> {
    const db = getDB();
    if (!db) throw new Error('Database connection not established');
    return db.collection<IProfile>(COLLECTIONS.PROFILES);
  }

  static async findByUserId(userId: string | ObjectId): Promise<IProfile | null> {
    const _userId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    return this.getCollection().findOne({ userId: _userId });
  }

  static async findById(id: string | ObjectId): Promise<IProfile | null> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    return this.getCollection().findOne({ _id });
  }

  static async create(profileData: IProfile): Promise<IProfile> {
    profileData.createdAt = new Date();
    profileData.updatedAt = new Date();
    
    const result = await this.getCollection().insertOne(profileData);
    return { ...profileData, _id: result.insertedId };
  }

  static async updateById(id: string | ObjectId, updateData: Partial<IProfile>): Promise<boolean> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    updateData.updatedAt = new Date();
    
    const result = await this.getCollection().updateOne(
      { _id },
      { $set: updateData }
    );
    
    return result.modifiedCount > 0;
  }

  static async updateByUserId(userId: string | ObjectId, updateData: Partial<IProfile>): Promise<boolean> {
    const _userId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    updateData.updatedAt = new Date();
    
    const result = await this.getCollection().updateOne(
      { userId: _userId },
      { $set: updateData }
    );
    
    return result.modifiedCount > 0;
  }

  static async findMentors(filters: {
    skills?: string[],
    interests?: string[],
    limit?: number,
    skip?: number
  } = {}): Promise<IProfile[]> {
    const { skills, interests, limit = 10, skip = 0 } = filters;
    
    const query: any = {
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