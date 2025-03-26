import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const CONNECTION_STRING = process.env.MONGODB_URI || 'mongodb://localhost:27017/mentorconnect';
let dbConnection: Db | null = null;
let client: MongoClient | null = null;

export const connectDB = async (): Promise<Db> => {
  try {
    if (dbConnection) return dbConnection;

    client = new MongoClient(CONNECTION_STRING);
    await client.connect();
    
    dbConnection = client.db();
    console.log('Successfully connected to MongoDB');
    return dbConnection;
  } catch (error) {
    console.error('Could not connect to MongoDB', error);
    process.exit(1);
  }
};

export const getDB = (): Db | null => {
  return dbConnection;
};

export const disconnectDB = async (): Promise<void> => {
  try {
    if (client) {
      await client.close();
      dbConnection = null;
      client = null;
      console.log('MongoDB connection closed');
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
};

// Model-related constants
export const COLLECTIONS = {
  USERS: 'users',
  PROFILES: 'profiles',
  MENTORSHIPS: 'mentorships',
  MESSAGES: 'messages',
  RESOURCES: 'resources',
  EVENTS: 'events'
}; 