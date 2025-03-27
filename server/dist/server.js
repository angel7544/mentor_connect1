"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const helmet_1 = __importDefault(require("helmet"));
const response_time_1 = __importDefault(require("response-time"));
const path_1 = __importDefault(require("path"));
// matric collections 
const prom_client_1 = __importDefault(require("prom-client"));
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
//  create function to collect Default Metrics 
const collectDefaultMetrics = prom_client_1.default.collectDefaultMetrics;
collectDefaultMetrics({ register: prom_client_1.default.register });
// create the custom dashboard 
const reqResTime = new prom_client_1.default.Histogram({
    name: 'http_req_res_time_mentor_connect',
    help: 'Request response time in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [1, 50, 100, 200, 500, 1000, 2000],
});
app.use((0, response_time_1.default)((req, res, time) => {
    reqResTime.labels({
        method: req.method,
        route: req.url,
        status_code: res.statusCode,
    })
        .observe(time);
}));
// Configure CORS with specific options
app.use((0, cors_1.default)({
    origin: ['http://localhost:4000', 'http://localhost:3000'], // Allow both common React ports
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    maxAge: 86400 // 24 hours
}));
// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
        headers: req.headers,
        body: req.body,
        query: req.query,
        params: req.params
    });
    next();
});
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, helmet_1.default)());
// Serve static files from uploads directory
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// create the  matric routes 
app.get('/metrics', async (req, res) => {
    console.log('Metrics route accessed'); // Log when the route is accessed
    res.setHeader('Content-Type', prom_client_1.default.register.contentType);
    const metrics = await prom_client_1.default.register.metrics();
    res.send(metrics);
});
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
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
// Handle process termination
const gracefulShutdown = async () => {
    console.log('Shutting down gracefully...');
    await (0, database_1.disconnectDB)();
    process.exit(0);
};
// Listen for termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
// Connect to MongoDB and start server
const startServer = async () => {
    try {
        await (0, database_1.connectDB)();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
