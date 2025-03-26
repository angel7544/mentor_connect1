import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

/**
 * Hash a password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compare a password with a hashed password
 */
export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Generate JWT token for authentication
 */
export const generateToken = (userId: ObjectId): string => {
  const JWT_SECRET = process.env.JWT_SECRET;
  
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  return jwt.sign(
    { userId: userId.toString() },
    JWT_SECRET,
    { expiresIn: '1h' } // Token expires in 1 hour
  );
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (userId: ObjectId): string => {
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
  
  if (!REFRESH_TOKEN_SECRET) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined in environment variables');
  }
  
  return jwt.sign(
    { userId: userId.toString() },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' } // Refresh token expires in 7 days
  );
}; 