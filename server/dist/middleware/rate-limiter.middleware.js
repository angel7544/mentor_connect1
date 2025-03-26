"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = exports.standardLimiter = exports.rateLimiter = void 0;
const error_middleware_1 = require("./error.middleware");
// Rate limit storage with IP as key
const rateLimitStore = new Map();
// Clean up expired entries every 10 minutes
const CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes
setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((entry, key) => {
        if (entry.resetAt <= now) {
            rateLimitStore.delete(key);
        }
    });
}, CLEANUP_INTERVAL);
// Rate limiter factory function
const rateLimiter = (options) => {
    return (req, res, next) => {
        try {
            const ip = req.ip || req.socket.remoteAddress || 'unknown';
            const key = `${ip}:${req.path}`;
            const now = Date.now();
            let entry = rateLimitStore.get(key);
            if (!entry || entry.resetAt <= now) {
                // Create a new entry or reset an expired one
                entry = { count: 1, resetAt: now + options.windowMs };
                rateLimitStore.set(key, entry);
                // Add rate limit headers
                res.setHeader('X-RateLimit-Limit', String(options.maxRequests));
                res.setHeader('X-RateLimit-Remaining', String(options.maxRequests - 1));
                res.setHeader('X-RateLimit-Reset', String(entry.resetAt));
                return next();
            }
            // Increment the counter
            entry.count += 1;
            rateLimitStore.set(key, entry);
            // Add rate limit headers
            res.setHeader('X-RateLimit-Limit', String(options.maxRequests));
            res.setHeader('X-RateLimit-Remaining', String(Math.max(0, options.maxRequests - entry.count)));
            res.setHeader('X-RateLimit-Reset', String(entry.resetAt));
            // Check if rate limit is exceeded
            if (entry.count > options.maxRequests) {
                const resetInSeconds = Math.ceil((entry.resetAt - now) / 1000);
                const errorMessage = options.message ||
                    `Too many requests, please try again in ${resetInSeconds} seconds`;
                // Create an ApiError and pass it to next() instead of throwing it
                const rateError = new error_middleware_1.ApiError(errorMessage, 429, {
                    retryAfter: resetInSeconds
                });
                // Set a Retry-After header (in seconds)
                res.setHeader('Retry-After', String(resetInSeconds));
                return next(rateError);
            }
            next();
        }
        catch (error) {
            // Pass any unexpected errors to the error handler
            next(error);
        }
    };
};
exports.rateLimiter = rateLimiter;
// Predefined rate limiters for different routes
exports.standardLimiter = (0, exports.rateLimiter)({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
    message: 'Too many requests from this IP, please try again after a minute'
});
exports.authLimiter = (0, exports.rateLimiter)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10, // 10 requests per 15 minutes
    message: 'Too many authentication attempts, please try again after 15 minutes'
});
