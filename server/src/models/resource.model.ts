import { ObjectId, Collection } from 'mongodb';
import { getDB, COLLECTIONS } from '../config/db.config';

export interface IResource {
  _id?: ObjectId;
  title: string;
  description: string;
  content?: string;
  resourceType: 'article' | 'video' | 'podcast' | 'book' | 'course' | 'template' | 'other';
  url?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  duration?: number; // in minutes
  author?: string;
  authorId?: ObjectId;
  tags?: string[];
  categories?: string[];
  isPublic: boolean;
  viewCount?: number;
  rating?: {
    average: number;
    count: number;
  };
  comments?: {
    _id?: ObjectId;
    userId: ObjectId;
    content: string;
    createdAt: Date;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IResourceRating {
  _id?: ObjectId;
  resourceId: ObjectId;
  userId: ObjectId;
  rating: number;
  review?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ResourceModel {
  private static getResourceCollection(): Collection<IResource> {
    const db = getDB();
    if (!db) throw new Error('Database connection not established');
    return db.collection<IResource>(COLLECTIONS.RESOURCES);
  }

  private static getRatingCollection(): Collection<IResourceRating> {
    const db = getDB();
    if (!db) throw new Error('Database connection not established');
    return db.collection<IResourceRating>('resource_ratings');
  }

  static async findById(id: string | ObjectId): Promise<IResource | null> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    return this.getResourceCollection().findOne({ _id });
  }

  static async create(resourceData: IResource): Promise<IResource> {
    resourceData.createdAt = new Date();
    resourceData.updatedAt = new Date();
    resourceData.viewCount = 0;
    resourceData.rating = { average: 0, count: 0 };
    
    const result = await this.getResourceCollection().insertOne(resourceData);
    return { ...resourceData, _id: result.insertedId };
  }

  static async updateById(id: string | ObjectId, updateData: Partial<IResource>): Promise<boolean> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    updateData.updatedAt = new Date();
    
    const result = await this.getResourceCollection().updateOne(
      { _id },
      { $set: updateData }
    );
    
    return result.modifiedCount > 0;
  }

  static async delete(id: string | ObjectId): Promise<boolean> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    
    const result = await this.getResourceCollection().deleteOne({ _id });
    return result.deletedCount > 0;
  }

  static async incrementViewCount(id: string | ObjectId): Promise<boolean> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    
    const result = await this.getResourceCollection().updateOne(
      { _id },
      { $inc: { viewCount: 1 }, $set: { updatedAt: new Date() } }
    );
    
    return result.modifiedCount > 0;
  }

  static async findAll(
    filters: {
      searchQuery?: string;
      categories?: string[];
      tags?: string[];
      resourceType?: IResource['resourceType'] | IResource['resourceType'][];
      limit?: number;
      skip?: number;
      sortBy?: string;
      sortDirection?: 'asc' | 'desc';
    } = {}
  ): Promise<IResource[]> {
    const { 
      searchQuery, 
      categories, 
      tags, 
      resourceType, 
      limit = 20, 
      skip = 0,
      sortBy = 'createdAt',
      sortDirection = 'desc'
    } = filters;
    
    const query: any = { isPublic: true };
    
    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { tags: { $regex: searchQuery, $options: 'i' } }
      ];
    }
    
    if (categories && categories.length > 0) {
      query.categories = { $in: categories };
    }
    
    if (tags && tags.length > 0) {
      query.tags = { $in: tags };
    }
    
    if (resourceType) {
      if (Array.isArray(resourceType)) {
        query.resourceType = { $in: resourceType };
      } else {
        query.resourceType = resourceType;
      }
    }
    
    const sortOption: any = {};
    sortOption[sortBy] = sortDirection === 'asc' ? 1 : -1;
    
    return this.getResourceCollection()
      .find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  static async addComment(resourceId: string | ObjectId, userId: string | ObjectId, content: string): Promise<boolean> {
    const _resourceId = typeof resourceId === 'string' ? new ObjectId(resourceId) : resourceId;
    const _userId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    
    const comment = {
      _id: new ObjectId(),
      userId: _userId,
      content,
      createdAt: new Date()
    };
    
    const result = await this.getResourceCollection().updateOne(
      { _id: _resourceId },
      { 
        $push: { comments: comment },
        $set: { updatedAt: new Date() }
      }
    );
    
    return result.modifiedCount > 0;
  }

  static async rateResource(rating: IResourceRating): Promise<boolean> {
    rating.createdAt = new Date();
    rating.updatedAt = new Date();
    
    // Convert string IDs to ObjectId if needed
    if (typeof rating.resourceId === 'string') {
      rating.resourceId = new ObjectId(rating.resourceId);
    }
    
    if (typeof rating.userId === 'string') {
      rating.userId = new ObjectId(rating.userId);
    }
    
    // Check if user has already rated this resource
    const existingRating = await this.getRatingCollection().findOne({
      resourceId: rating.resourceId,
      userId: rating.userId
    });
    
    if (existingRating) {
      // Update existing rating
      await this.getRatingCollection().updateOne(
        { _id: existingRating._id },
        { $set: { rating: rating.rating, review: rating.review, updatedAt: new Date() } }
      );
    } else {
      // Add new rating
      await this.getRatingCollection().insertOne(rating);
    }
    
    // Calculate new average rating
    const ratings = await this.getRatingCollection()
      .find({ resourceId: rating.resourceId })
      .toArray();
    
    const sum = ratings.reduce((total, curr) => total + curr.rating, 0);
    const average = ratings.length > 0 ? sum / ratings.length : 0;
    
    // Update resource with new rating information
    const result = await this.getResourceCollection().updateOne(
      { _id: rating.resourceId },
      { 
        $set: { 
          'rating.average': average, 
          'rating.count': ratings.length,
          updatedAt: new Date()
        } 
      }
    );
    
    return result.modifiedCount > 0;
  }
} 