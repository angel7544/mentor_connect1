import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mentorconnect';

// MongoDB client
let client: MongoClient;
let db: Db;

/**
 * Connect to MongoDB database
 */
export const connectDB = async (): Promise<Db> => {
  try {
    if (db) return db;

    // Create a new MongoDB client
    client = new MongoClient(MONGODB_URI);
    
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    // Get database instance
    db = client.db();
    
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

/**
 * Get database instance (only call after connectDB)
 */
export const getDb = (): Db => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

/**
 * Disconnect from MongoDB database
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    if (client) {
      await client.close();
      console.log('Disconnected from MongoDB');
    }
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}; 