import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './config/database';
import helmet from 'helmet';

// matric collections 
import client from 'prom-client'

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



// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

//  create functuion to collect Defualt Matrics 

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });





// Configure CORS with specific options
app.use(cors({
 origin: '*',
 methods: ['GET', 'POST', 'PUT', 'DELETE'],
 allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, 
    req.body ? JSON.stringify(req.body) : '');
  next();
});


// Middleware
app.use(express.json());
app.use(helmet());




// create the  matric routes 
app.get('/metrics', async (req: Request, res: Response) => {
  console.log('Metrics route accessed'); // Log when the route is accessed
  res.setHeader('Content-Type', client.register.contentType);
  const metrics = await client.register.metrics();
  res.send(metrics);
});



// API routes with specific rate limiters where needed
app.use('/api/auth', authLimiter, authRoutes);  // Stricter limits for auth routes
app.use('/api/profile', profileRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/forum', forumRoutes);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to MentorConnect API' });
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