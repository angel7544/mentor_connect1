import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { UserModel } from '../models/user.model';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: ObjectId;
        role: string;
      };
    }
  }
}

/**
 * Middleware to authenticate JWT token for protected routes
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
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
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, role: string };
      
      // Get user from database to verify they still exist
      const user = await UserModel.findUserById(new ObjectId(decoded.userId));
      
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
        _id: user._id as ObjectId,
        role: user.role
      };
      
      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          success: false,
          message: 'Token expired'
        });
      }
      
      if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }
      
      throw err;
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during authentication',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Middleware to authenticate refresh token
 */
export const authenticateRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
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
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { userId: string, role: string };
      
      // Get user from database
      const user = await UserModel.findUserById(new ObjectId(decoded.userId));
      
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
        _id: user._id as ObjectId,
        role: user.role
      };
      
      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token expired'
        });
      }
      
      if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token'
        });
      }
      
      throw err;
    }
  } catch (error) {
    console.error('Refresh token authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during refresh token authentication',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Middleware to check if user has admin role
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required'
    });
  }
  
  next();
};

/**
 * Middleware to check if user is an alumni
 */
export const requireAlumni = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'alumni' && req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Alumni role required'
    });
  }
  
  next();
}; 