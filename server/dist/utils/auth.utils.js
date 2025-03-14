"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateToken = exports.comparePasswords = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Hash a password
 */
const hashPassword = async (password) => {
    const salt = await bcryptjs_1.default.genSalt(10);
    return await bcryptjs_1.default.hash(password, salt);
};
exports.hashPassword = hashPassword;
/**
 * Compare a password with a hashed password
 */
const comparePasswords = async (plainPassword, hashedPassword) => {
    return await bcryptjs_1.default.compare(plainPassword, hashedPassword);
};
exports.comparePasswords = comparePasswords;
/**
 * Generate JWT token for authentication
 */
const generateToken = (userId) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jsonwebtoken_1.default.sign({ userId: userId.toString() }, JWT_SECRET, { expiresIn: '1h' } // Token expires in 1 hour
    );
};
exports.generateToken = generateToken;
/**
 * Generate refresh token
 */
const generateRefreshToken = (userId) => {
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
    if (!REFRESH_TOKEN_SECRET) {
        throw new Error('REFRESH_TOKEN_SECRET is not defined in environment variables');
    }
    return jsonwebtoken_1.default.sign({ userId: userId.toString() }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' } // Refresh token expires in 7 days
    );
};
exports.generateRefreshToken = generateRefreshToken;
