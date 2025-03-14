"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAlumni = exports.requireAdmin = exports.authenticateRefreshToken = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongodb_1 = require("mongodb");
const user_model_1 = require("../models/user.model");
/**
 * Middleware to authenticate JWT token for protected routes
 */
const authenticateToken = async (req, res, next) => {
    try {
        // Get the token from Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
        }
        // Verify the token
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            console.error('JWT_SECRET is not defined in environment variables');
            return res.status(500).json({
                success: false,
                message: 'Server configuration error'
            });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            // Get user from database to verify they still exist
            const user = await user_model_1.UserModel.findUserById(new mongodb_1.ObjectId(decoded.userId));
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            // Check if user is active
            if (user.isActive === false) {
                return res.status(403).json({
                    success: false,
                    message: 'Your account has been deactivated'
                });
            }
            // Attach user to request
            req.user = {
                _id: user._id,
                role: user.role
            };
            next();
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                return res.status(401).json({
                    success: false,
                    message: 'Token expired'
                });
            }
            if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token'
                });
            }
            throw err;
        }
    }
    catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred during authentication',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.authenticateToken = authenticateToken;
/**
 * Middleware to authenticate refresh token
 */
const authenticateRefreshToken = async (req, res, next) => {
    try {
        // Get refresh token from request body
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token is required'
            });
        }
        // Verify the refresh token
        const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
        if (!REFRESH_TOKEN_SECRET) {
            console.error('REFRESH_TOKEN_SECRET is not defined in environment variables');
            return res.status(500).json({
                success: false,
                message: 'Server configuration error'
            });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, REFRESH_TOKEN_SECRET);
            // Get user from database
            const user = await user_model_1.UserModel.findUserById(new mongodb_1.ObjectId(decoded.userId));
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            // Check if user is active
            if (user.isActive === false) {
                return res.status(403).json({
                    success: false,
                    message: 'Your account has been deactivated'
                });
            }
            // Attach user to request
            req.user = {
                _id: user._id,
                role: user.role
            };
            next();
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                return res.status(401).json({
                    success: false,
                    message: 'Refresh token expired'
                });
            }
            if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid refresh token'
                });
            }
            throw err;
        }
    }
    catch (error) {
        console.error('Refresh token authentication error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred during refresh token authentication',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.authenticateRefreshToken = authenticateRefreshToken;
/**
 * Middleware to check if user has admin role
 */
const requireAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin role required'
        });
    }
    next();
};
exports.requireAdmin = requireAdmin;
/**
 * Middleware to check if user is an alumni
 */
const requireAlumni = (req, res, next) => {
    var _a, _b;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'alumni' && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Alumni role required'
        });
    }
    next();
};
exports.requireAlumni = requireAlumni;
