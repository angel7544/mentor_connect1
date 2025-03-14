import { ObjectId, Collection } from 'mongodb';
import { getDB, COLLECTIONS } from '../config/db.config';

export interface IMessage {
  _id?: ObjectId;
  senderId: ObjectId;
  receiverId: ObjectId;
  conversationId?: ObjectId;
  mentorshipId?: ObjectId;
  content: string;
  attachments?: {
    filename: string;
    url: string;
    type: string;
    size?: number;
  }[];
  readAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IConversation {
  _id?: ObjectId;
  participants: ObjectId[];
  mentorshipId?: ObjectId;
  lastMessageAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class MessageModel {
  private static getMessageCollection(): Collection<IMessage> {
    const db = getDB();
    if (!db) throw new Error('Database connection not established');
    return db.collection<IMessage>(COLLECTIONS.MESSAGES);
  }

  private static getConversationCollection(): Collection<IConversation> {
    const db = getDB();
    if (!db) throw new Error('Database connection not established');
    return db.collection<IConversation>('conversations');
  }

  static async findMessageById(id: string | ObjectId): Promise<IMessage | null> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    return this.getMessageCollection().findOne({ _id });
  }

  static async createMessage(messageData: IMessage): Promise<IMessage> {
    messageData.createdAt = new Date();
    messageData.updatedAt = new Date();
    
    // If conversationId is not provided, try to find or create a conversation
    if (!messageData.conversationId) {
      let conversation: IConversation | null = null;
      
      // Check if conversation already exists
      conversation = await this.getConversationCollection().findOne({
        participants: { 
          $all: [
            typeof messageData.senderId === 'string' ? new ObjectId(messageData.senderId) : messageData.senderId,
            typeof messageData.receiverId === 'string' ? new ObjectId(messageData.receiverId) : messageData.receiverId
          ]
        }
      });
      
      // If not, create a new conversation
      if (!conversation) {
        const newConversation: IConversation = {
          participants: [
            typeof messageData.senderId === 'string' ? new ObjectId(messageData.senderId) : messageData.senderId,
            typeof messageData.receiverId === 'string' ? new ObjectId(messageData.receiverId) : messageData.receiverId
          ],
          mentorshipId: messageData.mentorshipId,
          lastMessageAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const result = await this.getConversationCollection().insertOne(newConversation);
        messageData.conversationId = result.insertedId;
      } else {
        messageData.conversationId = conversation._id;
        
        // Update lastMessageAt time
        await this.getConversationCollection().updateOne(
          { _id: conversation._id },
          { $set: { lastMessageAt: new Date(), updatedAt: new Date() } }
        );
      }
    }
    
    const result = await this.getMessageCollection().insertOne(messageData);
    return { ...messageData, _id: result.insertedId };
  }

  static async markAsRead(messageId: string | ObjectId): Promise<boolean> {
    const _id = typeof messageId === 'string' ? new ObjectId(messageId) : messageId;
    
    const result = await this.getMessageCollection().updateOne(
      { _id },
      { $set: { readAt: new Date(), updatedAt: new Date() } }
    );
    
    return result.modifiedCount > 0;
  }

  static async getConversation(conversationId: string | ObjectId, limit: number = 50, skip: number = 0): Promise<IMessage[]> {
    const _id = typeof conversationId === 'string' ? new ObjectId(conversationId) : conversationId;
    
    return this.getMessageCollection()
      .find({ conversationId: _id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  static async getUserConversations(userId: string | ObjectId): Promise<IConversation[]> {
    const _userId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    
    return this.getConversationCollection()
      .find({ participants: _userId })
      .sort({ lastMessageAt: -1 })
      .toArray();
  }

  static async getUnreadCount(userId: string | ObjectId): Promise<number> {
    const _userId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    
    return this.getMessageCollection().countDocuments({
      receiverId: _userId,
      readAt: { $exists: false }
    });
  }

  static async getRecentMessagesForUser(userId: string | ObjectId, limit: number = 10): Promise<IMessage[]> {
    const _userId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    
    return this.getMessageCollection()
      .find({
        $or: [
          { senderId: _userId },
          { receiverId: _userId }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }
} 