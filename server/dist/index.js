"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const helmet_1 = __importDefault(require("helmet"));
// Import middleware
const error_middleware_1 = require("./middleware/error.middleware");
const rate_limiter_middleware_1 = require("./middleware/rate-limiter.middleware");
// Import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
const mentorship_routes_1 = __importDefault(require("./routes/mentorship.routes"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
const resource_routes_1 = __importDefault(require("./routes/resource.routes"));
const event_routes_1 = __importDefault(require("./routes/event.routes"));
const forum_routes_1 = __importDefault(require("./routes/forum.routes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Configure CORS with specific options
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // Allow frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, req.body ? JSON.stringify(req.body) : '');
    next();
});
// Middleware
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
// Apply standard rate limiting to all routes
app.use(rate_limiter_middleware_1.standardLimiter);
// API routes with specific rate limiters where needed
app.use('/api/auth', rate_limiter_middleware_1.authLimiter, auth_routes_1.default); // Stricter limits for auth routes
app.use('/api/profile', profile_routes_1.default);
app.use('/api/mentorship', mentorship_routes_1.default);
app.use('/api/messages', message_routes_1.default);
app.use('/api/resources', resource_routes_1.default);
app.use('/api/events', event_routes_1.default);
app.use('/api/forum', forum_routes_1.default);
// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to MentorConnect API' });
});
// Apply the 404 handler for undefined routes
app.use(error_middleware_1.notFoundHandler);
// Apply the global error handler
app.use(error_middleware_1.errorHandler);
// Handle process termination
const gracefulShutdown = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Shutting down gracefully...');
    yield (0, database_1.disconnectDB)();
    process.exit(0);
});
// Listen for termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
// Connect to MongoDB and start server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.connectDB)();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
});
startServer();
