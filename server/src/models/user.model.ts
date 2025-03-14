import { Collection, ObjectId } from 'mongodb';
import { getDb } from '../config/database';
import { hashPassword } from '../utils/auth.utils';

export interface IBaseUser {
  _id?: ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'alumni' | 'admin';
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
}

export interface IStudent extends IBaseUser {
  role: 'student';
  studentId?: string;
  graduationYear?: number;
  program?: string;
  major?: string;
  minor?: string;
  interests?: string[];
  skills?: string[];
  bio?: string;
}

export interface IAlumni extends IBaseUser {
  role: 'alumni';
  graduationYear: number;
  company?: string;
  jobTitle?: string;
  industry?: string;
  expertise?: string[];
  yearsOfExperience?: number;
  bio?: string;
  linkedin?: string;
  isAvailableForMentoring?: boolean;
  mentorshipAreas?: string[];
}

export interface IAdmin extends IBaseUser {
  role: 'admin';
  permissions?: string[];
}

export type User = IStudent | IAlumni | IAdmin;

export class UserModel {
  private static getUserCollection(): Collection<User> {
    const db = getDb();
    return db.collection<User>('users');
  }

  static async createUser(userData: User): Promise<User> {
    const collection = this.getUserCollection();
    
    // Hash the password before storing
    const hashedPassword = await hashPassword(userData.password);
    
    const userToInsert: User = {
      ...userData,
      password: hashedPassword,
      isVerified: userData.isVerified || false,
      isActive: userData.isActive || true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(userToInsert);
    
    return {
      ...userToInsert,
      _id: result.insertedId
    };
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    const collection = this.getUserCollection();
    return await collection.findOne({ email });
  }

  static async findUserById(id: string | ObjectId): Promise<User | null> {
    if (typeof id === 'string') {
      id = new ObjectId(id);
    }
    
    const collection = this.getUserCollection();
    return await collection.findOne({ _id: id });
  }

  static async updateUser(id: string | ObjectId, updateData: Partial<User>): Promise<boolean> {
    if (typeof id === 'string') {
      id = new ObjectId(id);
    }
    
    const collection = this.getUserCollection();
    
    // Don't allow updating role or email directly for security
    const { role, email, _id, password, ...safeUpdateData } = updateData;
    
    // If there's a new password, hash it
    if (password) {
      safeUpdateData.password = await hashPassword(password);
    }
    
    safeUpdateData.updatedAt = new Date();
    
    const result = await collection.updateOne(
      { _id: id },
      { $set: safeUpdateData }
    );
    
    return result.modifiedCount > 0;
  }

  static async updateLastLogin(id: string | ObjectId): Promise<boolean> {
    if (typeof id === 'string') {
      id = new ObjectId(id);
    }
    
    const collection = this.getUserCollection();
    const result = await collection.updateOne(
      { _id: id },
      { $set: { lastLoginAt: new Date() } }
    );
    
    return result.modifiedCount > 0;
  }

  static async findStudents(
    query: Partial<IStudent> = {},
    options: { limit?: number; skip?: number } = {}
  ): Promise<IStudent[]> {
    const collection = this.getUserCollection();
    
    return await collection
      .find({ ...query, role: 'student' })
      .limit(options.limit || 20)
      .skip(options.skip || 0)
      .toArray() as IStudent[];
  }

  static async findAlumni(
    query: Partial<IAlumni> = {},
    options: { limit?: number; skip?: number } = {}
  ): Promise<IAlumni[]> {
    const collection = this.getUserCollection();
    
    return await collection
      .find({ ...query, role: 'alumni' })
      .limit(options.limit || 20)
      .skip(options.skip || 0)
      .toArray() as IAlumni[];
  }
  
  static async findMentors(
    query: Partial<IAlumni> = {},
    options: { limit?: number; skip?: number } = {}
  ): Promise<IAlumni[]> {
    const collection = this.getUserCollection();
    
    return await collection
      .find({ 
        ...query, 
        role: 'alumni',
        isAvailableForMentoring: true 
      })
      .limit(options.limit || 20)
      .skip(options.skip || 0)
      .toArray() as IAlumni[];
  }

  static async countUsers(role?: 'student' | 'alumni' | 'admin'): Promise<number> {
    const collection = this.getUserCollection();
    const query = role ? { role } : {};
    
    return await collection.countDocuments(query);
  }
  
  static async getRecentUsers(
    limit: number = 10,
    role?: 'student' | 'alumni' | 'admin'
  ): Promise<User[]> {
    const collection = this.getUserCollection();
    const query = role ? { role } : {};
    
    return await collection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }
} 