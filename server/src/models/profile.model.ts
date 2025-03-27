import { ObjectId, Collection } from 'mongodb';
import { getDb } from '../config/database';

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
  static getCollection() {
    const db = getDb();
    if (!db) {
      console.error('Database connection not established');
      throw new Error('Database connection not established');
    }
    return db.collection<IProfile>('profiles');
  }

  static async findByUserId(userId: string | ObjectId) {
    try {
      console.log('Finding profile for user ID:', userId);
      const _userId = typeof userId === 'string' ? new ObjectId(userId) : userId;
      const profile = await this.getCollection().findOne({ userId: _userId });
      console.log('Profile found:', profile ? 'Yes' : 'No');
      return profile;
    } catch (error) {
      console.error('Error in findByUserId:', error);
      throw error;
    }
  }

  static async findById(id: string | ObjectId): Promise<IProfile | null> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    return this.getCollection().findOne({ _id });
  }

  static async create(profileData: Partial<IProfile>) {
    try {
      console.log('Creating new profile with data:', profileData);
      const result = await this.getCollection().insertOne(profileData as IProfile);
      console.log('Profile created with ID:', result.insertedId);
      return { ...profileData, _id: result.insertedId };
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
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

  static async updateByUserId(userId: string | ObjectId, updateData: Partial<IProfile>): Promise<IProfile | null> {
    try {
      console.log(`Updating profile for user ${userId} with data:`, updateData);
      const collection = await this.getCollection();
      
      // Convert string ID to ObjectId if needed
      const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
      
      const result = await collection.findOneAndUpdate(
        { userId: objectId },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      
      if (!result) {
        console.error(`No profile found to update for user ${userId}`);
        return null;
      }
      
      console.log(`Profile updated successfully for user ${userId}`);
      return result;
    } catch (error) {
      console.error(`Error updating profile for user ${userId}:`, error);
      throw error;
    }
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