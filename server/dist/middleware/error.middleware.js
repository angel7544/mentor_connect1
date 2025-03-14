"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = exports.ApiError = void 0;
// Custom error class that can include status code and additional data
class ApiError extends Error {
    constructor(message, statusCode = 500, data) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
        this.name = this.constructor.name;
        // Use safer approach for stack trace capture that works with TypeScript
        if (Error.captureStackTrace && typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        }
        else {
            this.stack = new Error().stack;
        }
    }
}
exports.ApiError = ApiError;
// Environment variable handling that works with TypeScript
const getNodeEnv = () => {
    return typeof process !== 'undefined' && process.env && process.env.NODE_ENV
        ? process.env.NODE_ENV
        : 'development';
};
// Global error handling middleware
const errorHandler = (err, req, res, next) => {
    // Log errors for monitoring - using conditional checks for TypeScript
    if (typeof console !== 'undefined' && console.error) {
        console.error('ERROR HANDLER CAUGHT:', {
            name: err.name,
            message: err.message,
            stack: getNodeEnv() === 'development' ? err.stack : undefined,
            path: req.path,
            method: req.method,
            ip: req.ip,
            timestamp: new Date().toISOString()
        });
    }
    // Set default status code
    let statusCode = 500;
    let errorData = undefined;
    // Handle custom ApiError instances
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        errorData = err.data;
    }
    // Handle common error types
    if (err.name === 'ValidationError') {
        statusCode = 400; // Bad request for validation errors
    }
    else if (err.name === 'UnauthorizedError' || err.message.includes('unauthorized') || err.message.includes('unauthenticated')) {
        statusCode = 401; // Unauthorized
    }
    else if (err.name === 'ForbiddenError' || err.message.includes('forbidden') || err.message.includes('not allowed')) {
        statusCode = 403; // Forbidden
    }
    else if (err.name === 'NotFoundError' || err.message.includes('not found')) {
        statusCode = 404; // Not found
    }
    else if (err.name === 'ConflictError' || err.message.includes('conflict') || err.message.includes('already exists')) {
        statusCode = 409; // Conflict
    }
    else if (err.name === 'TooManyRequestsError' || err.message.includes('too many requests')) {
        statusCode = 429; // Too many requests
    }
    // Send standardized error response
    return res.status(statusCode).json({
        success: false,
        message: err.message,
        error: getNodeEnv() === 'development' ? {
            name: err.name,
            stack: err.stack,
            data: errorData
        } : undefined
    });
};
exports.errorHandler = errorHandler;
// 404 error handler for undefined routes
const notFoundHandler = (req, res, next) => {
    const error = new ApiError(`Resource not found: ${req.method} ${req.path}`, 404);
    next(error);
};
exports.notFoundHandler = notFoundHandler;
