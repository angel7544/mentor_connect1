import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { MessageModel, IMessage } from '../models/message.model';
import { UserModel } from '../models/user.model';

// Send a message
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const senderId = req.user._id;
    const { receiverId, content, conversationId, mentorshipId, attachments } = req.body;
    
    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Receiver ID and content are required' });
    }
    
    // Check if receiver exists
    const receiver = await UserModel.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }
    
    // Create message
    const messageData: IMessage = {
      senderId: new ObjectId(senderId),
      receiverId: new ObjectId(receiverId),
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    if (conversationId) {
      messageData.conversationId = new ObjectId(conversationId);
    }
    
    if (mentorshipId) {
      messageData.mentorshipId = new ObjectId(mentorshipId);
    }
    
    if (attachments && attachments.length > 0) {
      messageData.attachments = attachments;
    }
    
    const message = await MessageModel.createMessage(messageData);
    
    res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      message: 'Error sending message',
      error: error.message
    });
  }
};

// Get conversations for a user
export const getConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    
    const conversations = await MessageModel.getUserConversations(userId);
    
    // Get user details for each participant
    const conversationsWithUsers = await Promise.all(
      conversations.map(async (conversation) => {
        // Get other participants' details
        const otherParticipants = conversation.participants.filter(
          p => p.toString() !== userId.toString()
        );
        
        const participantsDetails = await Promise.all(
          otherParticipants.map(async (participantId) => {
            const user = await UserModel.findById(participantId);
            
            if (!user) return null;
            
            // Remove sensitive information
            const { password, ...userWithoutPassword } = user;
            
            return userWithoutPassword;
          })
        );
        
        // Filter out null values
        const validParticipants = participantsDetails.filter(p => p !== null);
        
        return {
          ...conversation,
          participants: validParticipants
        };
      })
    );
    
    res.status(200).json({ conversations: conversationsWithUsers });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      message: 'Error fetching conversations',
      error: error.message
    });
  }
};

// Get messages for a specific conversation
export const getConversationMessages = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;
    const { limit, skip } = req.query;
    
    // Convert query params to numbers
    const parsedLimit = limit ? parseInt(limit as string) : 50;
    const parsedSkip = skip ? parseInt(skip as string) : 0;
    
    // Get messages
    const messages = await MessageModel.getConversation(
      conversationId,
      parsedLimit,
      parsedSkip
    );
    
    // Mark messages as read if the user is the receiver
    await Promise.all(
      messages
        .filter(msg => msg.receiverId.toString() === userId.toString() && !msg.readAt)
        .map(msg => MessageModel.markAsRead(msg._id as ObjectId))
    );
    
    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error fetching conversation messages:', error);
    res.status(500).json({
      message: 'Error fetching conversation messages',
      error: error.message
    });
  }
};

// Mark a message as read
export const markMessageAsRead = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;
    
    // Get the message
    const message = await MessageModel.findMessageById(messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Check if the user is the receiver
    if (message.receiverId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You can only mark messages sent to you as read' });
    }
    
    // Mark as read
    const updated = await MessageModel.markAsRead(messageId);
    
    if (!updated) {
      return res.status(400).json({ message: 'Failed to mark message as read' });
    }
    
    res.status(200).json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({
      message: 'Error marking message as read',
      error: error.message
    });
  }
};

// Get unread message count
export const getUnreadMessageCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    
    const count = await MessageModel.getUnreadCount(userId);
    
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting unread message count:', error);
    res.status(500).json({
      message: 'Error getting unread message count',
      error: error.message
    });
  }
};

// Get recent messages for dashboard
export const getRecentMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { limit } = req.query;
    
    const parsedLimit = limit ? parseInt(limit as string) : 5;
    
    const messages = await MessageModel.getRecentMessagesForUser(userId, parsedLimit);
    
    // Get user details for each message
    const messagesWithUsers = await Promise.all(
      messages.map(async (message) => {
        const otherUserId = message.senderId.toString() === userId.toString() 
          ? message.receiverId 
          : message.senderId;
        
        const user = await UserModel.findById(otherUserId);
        
        if (!user) return message;
        
        // Remove sensitive information
        const { password, ...userWithoutPassword } = user;
        
        return {
          ...message,
          otherUser: userWithoutPassword
        };
      })
    );
    
    res.status(200).json({ messages: messagesWithUsers });
  } catch (error) {
    console.error('Error fetching recent messages:', error);
    res.status(500).json({
      message: 'Error fetching recent messages',
      error: error.message
    });
  }
}; 