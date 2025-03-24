import { Request, Response } from 'express';
import { UserModel, IStudent, IAlumni, IAdmin } from '../models/user.model';
import { comparePasswords, generateToken, generateRefreshToken } from '../utils/auth.utils';
import { ObjectId } from 'mongodb';
import { welcomeMailOptions,Subscriptions,supportContactOpition } from '../utils/mailoptions';
import transporter from '../utils/mailtransport';
/**
 * User signup controller - handles registration for students and alumni
 */
export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role, ...additionalData } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate role
    if (role !== 'student' && role !== 'alumni') {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either student or alumni'
      });
    }

    // Check if user with email already exists
    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists'
      });
    }

    // Role-specific validations and data structuring
    let userData;

    if (role === 'student') {
      // Student specific validations
      const { program, graduationYear } = additionalData;
      
      userData = {
        email,
        password,
        firstName,
        lastName,
        role: 'student' as const,
        studentId: additionalData.studentId,
        program,
        major: additionalData.major,
        minor: additionalData.minor,
        graduationYear: graduationYear ? parseInt(graduationYear) : undefined,
        interests: additionalData.interests || [],
        skills: additionalData.skills || [],
        bio: additionalData.bio || ''
      } as IStudent;

    } else if (role === 'alumni') {
      // Alumni specific validations
      const { graduationYear, company, jobTitle } = additionalData;
      
      if (!graduationYear) {
        return res.status(400).json({
          success: false,
          message: 'Graduation year is required for alumni'
        });
      }
      
      userData = {
        email,
        password,
        firstName,
        lastName,
        role: 'alumni' as const,
        graduationYear: parseInt(graduationYear),
        company,
        jobTitle,
        industry: additionalData.industry,
        expertise: additionalData.expertise || [],
        yearsOfExperience: additionalData.yearsOfExperience ? parseInt(additionalData.yearsOfExperience) : undefined,
        bio: additionalData.bio || '',
        linkedin: additionalData.linkedin,
        isAvailableForMentoring: additionalData.isAvailableForMentoring || false,
        mentorshipAreas: additionalData.mentorshipAreas || []
      } as IAlumni;
    }

    // Create new user in database
    const newUser = await UserModel.createUser(userData);

    // Remove password before sending response
    const { password: _, ...userWithoutPassword } = newUser;

    // Generate JWT tokens
    const token = generateToken(newUser._id as ObjectId);
    const refreshToken = generateRefreshToken(newUser._id as ObjectId);
    
    await transporter.sendMail(welcomeMailOptions(email, firstName));
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userWithoutPassword,
        token,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Error in signup:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during registration',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * User login controller
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await UserModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support'
      });
    }

    // Update last login timestamp
    await UserModel.updateLastLogin(user._id as ObjectId);

    // Remove password before sending response
    const { password: _, ...userWithoutPassword } = user;

    // Generate JWT tokens
    const token = generateToken(user._id as ObjectId);
    const refreshToken = generateRefreshToken(user._id as ObjectId);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during login',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Refresh token controller
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    // The user ID should be attached to the request by the auth middleware
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    // Generate new access token
    const newToken = generateToken(userId as ObjectId);

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken
      }
    });

  } catch (error) {
    console.error('Error in refreshToken:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while refreshing the token',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get current user information
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // The user should be attached to the request by the auth middleware
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Get user data from database
    const user = await UserModel.findUserById(userId as ObjectId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove password before sending response
    const { password, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      data: userWithoutPassword
    });

  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while getting user information',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 

export const subscription = async (req: Request, res: Response)=>{
  try{
    const email = req.body.email;
    console.log(email);
    if(!email){
      return res.status(400).json({message:"Enter vaid Email"})
    }
   await transporter.sendMail(Subscriptions(email));
   return res.status(200).json({message:"Subscription Successfull"})
    
  }catch(error){
    console.error('Error in subscription:', error);
  }
}

export const supportContact  = async (req: Request, res: Response)=>{
  try{
    const {firstName,email,subject,message} = req.body;
    console.log(req.body);
    if(!firstName || !email || !subject || !message){
      return res.status(400).json({message:"Enter all fields"})
    }
     transporter.sendMail(supportContactOpition(firstName,email,subject,message));
     return res.status(200).json({message:"Message Sent Successfully"})
  } catch(error){
    console.error('Error in support:', error);
  }
}