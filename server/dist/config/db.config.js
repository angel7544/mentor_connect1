"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLLECTIONS = exports.disconnectDB = exports.getDB = exports.connectDB = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const CONNECTION_STRING = process.env.MONGODB_URI || 'mongodb://localhost:27017/mentorconnect';
let dbConnection = null;
let client = null;
const connectDB = async () => {
    try {
        if (dbConnection)
            return dbConnection;
        client = new mongodb_1.MongoClient(CONNECTION_STRING);
        await client.connect();
        dbConnection = client.db();
        console.log('Successfully connected to MongoDB');
        return dbConnection;
    }
    catch (error) {
        console.error('Could not connect to MongoDB', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const getDB = () => {
    return dbConnection;
};
exports.getDB = getDB;
const disconnectDB = async () => {
    try {
        if (client) {
            await client.close();
            dbConnection = null;
            client = null;
            console.log('MongoDB connection closed');
        }
    }
    catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
};
exports.disconnectDB = disconnectDB;
// Model-related constants
exports.COLLECTIONS = {
    USERS: 'users',
    PROFILES: 'profiles',
    MENTORSHIPS: 'mentorships',
    MESSAGES: 'messages',
    RESOURCES: 'resources',
    EVENTS: 'events'
};
