import { ObjectId, Collection } from 'mongodb';
import { getDB, COLLECTIONS } from '../config/db.config';

export interface IForumCategory {
  _id?: ObjectId;
  name: string;
  description: string;
  slug: string;
  isActive: boolean;
  order?: number;
  parentId?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IForumTopic {
  _id?: ObjectId;
  title: string;
  content: string;
  authorId: ObjectId;
  categoryId: ObjectId;
  tags?: string[];
  isSticky?: boolean;
  isLocked?: boolean;
  viewCount?: number;
  lastReplyAt?: Date;
  lastReplyBy?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IForumReply {
  _id?: ObjectId;
  topicId: ObjectId;
  authorId: ObjectId;
  content: string;
  parentReplyId?: ObjectId; // For nested replies
  isAcceptedAnswer?: boolean;
  isEdited?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ForumModel {
  private static getCategoryCollection(): Collection<IForumCategory> {
    const db = getDB();
    if (!db) throw new Error('Database connection not established');
    return db.collection<IForumCategory>('forum_categories');
  }

  private static getTopicCollection(): Collection<IForumTopic> {
    const db = getDB();
    if (!db) throw new Error('Database connection not established');
    return db.collection<IForumTopic>('forum_topics');
  }

  private static getReplyCollection(): Collection<IForumReply> {
    const db = getDB();
    if (!db) throw new Error('Database connection not established');
    return db.collection<IForumReply>('forum_replies');
  }

  // Category methods
  static async createCategory(categoryData: IForumCategory): Promise<IForumCategory> {
    categoryData.createdAt = new Date();
    categoryData.updatedAt = new Date();
    categoryData.isActive = categoryData.isActive ?? true;
    
    const result = await this.getCategoryCollection().insertOne(categoryData);
    return { ...categoryData, _id: result.insertedId };
  }

  static async updateCategory(id: string | ObjectId, updateData: Partial<IForumCategory>): Promise<boolean> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    updateData.updatedAt = new Date();
    
    const result = await this.getCategoryCollection().updateOne(
      { _id },
      { $set: updateData }
    );
    
    return result.modifiedCount > 0;
  }

  static async getCategories(): Promise<IForumCategory[]> {
    return this.getCategoryCollection()
      .find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .toArray();
  }

  static async getCategoryById(id: string | ObjectId): Promise<IForumCategory | null> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    return this.getCategoryCollection().findOne({ _id });
  }

  // Topic methods
  static async createTopic(topicData: IForumTopic): Promise<IForumTopic> {
    topicData.createdAt = new Date();
    topicData.updatedAt = new Date();
    topicData.viewCount = 0;
    topicData.isSticky = topicData.isSticky ?? false;
    topicData.isLocked = topicData.isLocked ?? false;
    
    const result = await this.getTopicCollection().insertOne(topicData);
    return { ...topicData, _id: result.insertedId };
  }

  static async updateTopic(id: string | ObjectId, updateData: Partial<IForumTopic>): Promise<boolean> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    updateData.updatedAt = new Date();
    
    const result = await this.getTopicCollection().updateOne(
      { _id },
      { $set: updateData }
    );
    
    return result.modifiedCount > 0;
  }

  static async getTopicById(id: string | ObjectId): Promise<IForumTopic | null> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    return this.getTopicCollection().findOne({ _id });
  }

  static async incrementTopicViewCount(id: string | ObjectId): Promise<boolean> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    
    const result = await this.getTopicCollection().updateOne(
      { _id },
      { $inc: { viewCount: 1 } }
    );
    
    return result.modifiedCount > 0;
  }

  static async getTopicsByCategory(
    categoryId: string | ObjectId, 
    options: { 
      limit?: number, 
      skip?: number, 
      sortBy?: string, 
      sortDirection?: 'asc' | 'desc' 
    } = {}
  ): Promise<IForumTopic[]> {
    const _categoryId = typeof categoryId === 'string' ? new ObjectId(categoryId) : categoryId;
    const { limit = 20, skip = 0, sortBy = 'createdAt', sortDirection = 'desc' } = options;
    
    const sortOption: any = {};
    sortOption[sortBy] = sortDirection === 'asc' ? 1 : -1;
    
    // Always sort sticky topics to the top
    const pipeline = [
      { $match: { categoryId: _categoryId } },
      { $addFields: { sortOrder: { $cond: [{ $eq: ["$isSticky", true] }, 0, 1] } } },
      { $sort: { sortOrder: 1, ...sortOption } },
      { $skip: skip },
      { $limit: limit }
    ];
    
    return this.getTopicCollection().aggregate(pipeline).toArray() as Promise<IForumTopic[]>;
  }

  static async getRecentTopics(limit: number = 10): Promise<IForumTopic[]> {
    return this.getTopicCollection()
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }

  static async getUserTopics(userId: string | ObjectId, limit: number = 10): Promise<IForumTopic[]> {
    const _userId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    
    return this.getTopicCollection()
      .find({ authorId: _userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }

  // Reply methods
  static async createReply(replyData: IForumReply): Promise<IForumReply> {
    replyData.createdAt = new Date();
    replyData.updatedAt = new Date();
    
    const result = await this.getReplyCollection().insertOne(replyData);
    
    // Update the topic's last reply information
    await this.getTopicCollection().updateOne(
      { _id: replyData.topicId },
      { 
        $set: { 
          lastReplyAt: new Date(),
          lastReplyBy: replyData.authorId,
          updatedAt: new Date()
        } 
      }
    );
    
    return { ...replyData, _id: result.insertedId };
  }

  static async updateReply(id: string | ObjectId, updateData: Partial<IForumReply>): Promise<boolean> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    updateData.updatedAt = new Date();
    updateData.isEdited = true;
    
    const result = await this.getReplyCollection().updateOne(
      { _id },
      { $set: updateData }
    );
    
    return result.modifiedCount > 0;
  }

  static async getReplyById(id: string | ObjectId): Promise<IForumReply | null> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    return this.getReplyCollection().findOne({ _id });
  }

  static async getRepliesByTopic(
    topicId: string | ObjectId, 
    options: { limit?: number, skip?: number } = {}
  ): Promise<IForumReply[]> {
    const _topicId = typeof topicId === 'string' ? new ObjectId(topicId) : topicId;
    const { limit = 50, skip = 0 } = options;
    
    // First get top-level replies sorted by creation date
    return this.getReplyCollection()
      .find({ 
        topicId: _topicId,
        parentReplyId: { $exists: false }
      })
      .sort({ 
        isAcceptedAnswer: -1, // Show accepted answers first
        createdAt: 1 // Then oldest to newest
      })
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  static async getNestedReplies(parentReplyId: string | ObjectId): Promise<IForumReply[]> {
    const _parentReplyId = typeof parentReplyId === 'string' ? new ObjectId(parentReplyId) : parentReplyId;
    
    return this.getReplyCollection()
      .find({ parentReplyId: _parentReplyId })
      .sort({ createdAt: 1 })
      .toArray();
  }

  static async markReplyAsAccepted(replyId: string | ObjectId, topicId: string | ObjectId): Promise<boolean> {
    const _replyId = typeof replyId === 'string' ? new ObjectId(replyId) : replyId;
    const _topicId = typeof topicId === 'string' ? new ObjectId(topicId) : topicId;
    
    // First, unmark any previously accepted answers for this topic
    await this.getReplyCollection().updateMany(
      { topicId: _topicId, isAcceptedAnswer: true },
      { $set: { isAcceptedAnswer: false, updatedAt: new Date() } }
    );
    
    // Then mark the new accepted answer
    const result = await this.getReplyCollection().updateOne(
      { _id: _replyId },
      { $set: { isAcceptedAnswer: true, updatedAt: new Date() } }
    );
    
    return result.modifiedCount > 0;
  }

  static async getUserReplies(userId: string | ObjectId, limit: number = 10): Promise<IForumReply[]> {
    const _userId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    
    return this.getReplyCollection()
      .find({ authorId: _userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }

  static async searchTopics(searchQuery: string, options: { limit?: number, skip?: number } = {}): Promise<IForumTopic[]> {
    const { limit = 20, skip = 0 } = options;
    
    return this.getTopicCollection()
      .find({
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { content: { $regex: searchQuery, $options: 'i' } },
          { tags: { $regex: searchQuery, $options: 'i' } }
        ]
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
  }
} 