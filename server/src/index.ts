import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './config/database';
import helmet from 'helmet';
import path from 'path';
// Import middleware
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { standardLimiter, authLimiter } from './middleware/rate-limiter.middleware';
import { authenticateToken, requireAdmin } from './middleware/auth.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import mentorshipRoutes from './routes/mentorship.routes';
import messageRoutes from './routes/message.routes';
import resourceRoutes from './routes/resource.routes';
import eventRoutes from './routes/event.routes';
import forumRoutes from './routes/forum.routes';

// import swagger 
import swaggerDoc from 'swagger-ui-express';
import swaggerdocumentation from './helper/swaggerdocumentation';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Configure CORS with specific options
app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, 
    req.body ? JSON.stringify(req.body) : '');
  next();
});

// Middleware
app.use(express.json());
app.use(helmet());

// configure swagger 
app.use('/docs',swaggerDoc.serve);
app.use('/docs',swaggerDoc.setup(swaggerdocumentation));

// Apply standard rate limiting to all routes
app.use(standardLimiter);

const baseUrl = process.env.BASE_URL;
// API routes with specific rate limiters where needed
app.use(`${baseUrl}/auth`, authLimiter, authRoutes);  // Stricter limits for auth routes
app.use(`${baseUrl}/profile`, profileRoutes);
app.use(`${baseUrl}/mentorship`, mentorshipRoutes);
app.use(`${baseUrl}/messages`, messageRoutes);
app.use(`${baseUrl}/resources`, resourceRoutes);
app.use(`${baseUrl}/events`, eventRoutes);
app.use(`${baseUrl}/forum`, forumRoutes);

// Basic route with EJS template
app.get('/', (req: Request, res: Response) => {
  res.render('index');
});

// Apply the 404 handler for undefined routes
app.use(notFoundHandler);

// Apply the global error handler
app.use(errorHandler);

// Handle process termination
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  await disconnectDB();
  process.exit(0);
};

// Listen for termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();