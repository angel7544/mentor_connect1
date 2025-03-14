"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.getDb = exports.connectDB = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mentorconnect';
// MongoDB client
let client;
let db;
/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
    try {
        if (db)
            return db;
        // Create a new MongoDB client
        client = new mongodb_1.MongoClient(MONGODB_URI);
        // Connect to the MongoDB server
        await client.connect();
        console.log('Connected to MongoDB successfully');
        // Get database instance
        db = client.db();
        return db;
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};
exports.connectDB = connectDB;
/**
 * Get database instance (only call after connectDB)
 */
const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized. Call connectDB first.');
    }
    return db;
};
exports.getDb = getDb;
/**
 * Disconnect from MongoDB database
 */
const disconnectDB = async () => {
    try {
        if (client) {
            await client.close();
            console.log('Disconnected from MongoDB');
        }
    }
    catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
        throw error;
    }
};
exports.disconnectDB = disconnectDB;
