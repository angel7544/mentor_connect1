import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { ForumModel, IForumCategory, IForumTopic, IForumReply } from '../models/forum.model';
import { UserModel } from '../models/user.model';

// Category controllers
export const createCategory = async (req: Request, res: Response) => {
  try {
    // Only admins can create categories
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only administrators can create categories' });
    }
    
    const { name, description, slug, isActive, order, parentId } = req.body;
    
    if (!name || !description || !slug) {
      return res.status(400).json({ message: 'Name, description, and slug are required' });
    }
    
    // Check if slug is already in use
    const categories = await ForumModel.getCategories();
    const slugExists = categories.some(c => c.slug === slug);
    
    if (slugExists) {
      return res.status(400).json({ message: 'Slug is already in use' });
    }
    
    // Create category
    const categoryData: IForumCategory = {
      name,
      description,
      slug,
      isActive: isActive !== undefined ? isActive : true,
      order,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    if (parentId) {
      categoryData.parentId = new ObjectId(parentId);
    }
    
    const category = await ForumModel.createCategory(categoryData);
    
    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      message: 'Error creating category',
      error: error.message
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    // Only admins can update categories
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only administrators can update categories' });
    }
    
    const { id } = req.params;
    const updateData = req.body;
    
    // Get category
    const category = await ForumModel.getCategoryById(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if slug is already in use (if changing slug)
    if (updateData.slug && updateData.slug !== category.slug) {
      const categories = await ForumModel.getCategories();
      const slugExists = categories.some(c => c.slug === updateData.slug && c._id.toString() !== id);
      
      if (slugExists) {
        return res.status(400).json({ message: 'Slug is already in use' });
      }
    }
    
    // Update category
    const updated = await ForumModel.updateCategory(id, {
      ...updateData,
      updatedAt: new Date()
    });
    
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update category' });
    }
    
    // Get updated category
    const updatedCategory = await ForumModel.getCategoryById(id);
    
    res.status(200).json({
      message: 'Category updated successfully',
      category: updatedCategory
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      message: 'Error updating category',
      error: error.message
    });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await ForumModel.getCategories();
    
    res.status(200).json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const category = await ForumModel.getCategoryById(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(200).json({ category });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      message: 'Error fetching category',
      error: error.message
    });
  }
};

// Topic controllers
export const createTopic = async (req: Request, res: Response) => {
  try {
    const authorId = req.user._id;
    const { title, content, categoryId, tags } = req.body;
    
    if (!title || !content || !categoryId) {
      return res.status(400).json({ message: 'Title, content, and category ID are required' });
    }
    
    // Check if category exists
    const category = await ForumModel.getCategoryById(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Create topic
    const topicData: IForumTopic = {
      title,
      content,
      authorId: new ObjectId(authorId),
      categoryId: new ObjectId(categoryId),
      tags,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const topic = await ForumModel.createTopic(topicData);
    
    res.status(201).json({
      message: 'Topic created successfully',
      topic
    });
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({
      message: 'Error creating topic',
      error: error.message
    });
  }
};

export const updateTopic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updateData = req.body;
    
    // Get topic
    const topic = await ForumModel.getTopicById(id);
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    // Check if user is the author or admin
    if (topic.authorId.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to update this topic' });
    }
    
    // Check if topic is locked
    if (topic.isLocked && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'This topic is locked and cannot be updated' });
    }
    
    // Update topic
    const updated = await ForumModel.updateTopic(id, {
      ...updateData,
      updatedAt: new Date()
    });
    
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update topic' });
    }
    
    // Get updated topic
    const updatedTopic = await ForumModel.getTopicById(id);
    
    res.status(200).json({
      message: 'Topic updated successfully',
      topic: updatedTopic
    });
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({
      message: 'Error updating topic',
      error: error.message
    });
  }
};

export const getTopicById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const topic = await ForumModel.getTopicById(id);
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    // Increment view count
    await ForumModel.incrementTopicViewCount(id);
    
    // Get author details
    const author = await UserModel.findById(topic.authorId);
    
    let authorData = null;
    if (author) {
      // Remove sensitive information
      const { password, ...authorWithoutPassword } = author;
      authorData = authorWithoutPassword;
    }
    
    // Get replies
    const replies = await ForumModel.getRepliesByTopic(id);
    
    // Get authors for replies
    const repliesWithAuthors = await Promise.all(
      replies.map(async (reply) => {
        const replyAuthor = await UserModel.findById(reply.authorId);
        
        if (!replyAuthor) return reply;
        
        // Remove sensitive information
        const { password, ...authorWithoutPassword } = replyAuthor;
        
        // Get nested replies if any
        const nestedReplies = await ForumModel.getNestedReplies(reply._id as ObjectId);
        
        // Get authors for nested replies
        const nestedRepliesWithAuthors = await Promise.all(
          nestedReplies.map(async (nestedReply) => {
            const nestedReplyAuthor = await UserModel.findById(nestedReply.authorId);
            
            if (!nestedReplyAuthor) return nestedReply;
            
            // Remove sensitive information
            const { password, ...nestedAuthorWithoutPassword } = nestedReplyAuthor;
            
            return {
              ...nestedReply,
              author: nestedAuthorWithoutPassword
            };
          })
        );
        
        return {
          ...reply,
          author: authorWithoutPassword,
          nestedReplies: nestedRepliesWithAuthors
        };
      })
    );
    
    res.status(200).json({
      topic: {
        ...topic,
        author: authorData
      },
      replies: repliesWithAuthors
    });
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({
      message: 'Error fetching topic',
      error: error.message
    });
  }
};

export const getTopicsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const { limit, skip, sortBy, sortDirection } = req.query;
    
    // Check if category exists
    const category = await ForumModel.getCategoryById(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const options: any = {};
    
    if (limit) {
      options.limit = parseInt(limit as string);
    }
    
    if (skip) {
      options.skip = parseInt(skip as string);
    }
    
    if (sortBy) {
      options.sortBy = sortBy as string;
    }
    
    if (sortDirection) {
      options.sortDirection = sortDirection as 'asc' | 'desc';
    }
    
    const topics = await ForumModel.getTopicsByCategory(categoryId, options);
    
    // Get author details for each topic
    const topicsWithAuthors = await Promise.all(
      topics.map(async (topic) => {
        const author = await UserModel.findById(topic.authorId);
        
        if (!author) return topic;
        
        // Remove sensitive information
        const { password, ...authorWithoutPassword } = author;
        
        return {
          ...topic,
          author: authorWithoutPassword
        };
      })
    );
    
    res.status(200).json({
      category,
      topics: topicsWithAuthors
    });
  } catch (error) {
    console.error('Error fetching topics by category:', error);
    res.status(500).json({
      message: 'Error fetching topics by category',
      error: error.message
    });
  }
};

export const getRecentTopics = async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;
    
    const parsedLimit = limit ? parseInt(limit as string) : 10;
    
    const topics = await ForumModel.getRecentTopics(parsedLimit);
    
    // Get author details for each topic
    const topicsWithAuthors = await Promise.all(
      topics.map(async (topic) => {
        const author = await UserModel.findById(topic.authorId);
        
        if (!author) return topic;
        
        // Remove sensitive information
        const { password, ...authorWithoutPassword } = author;
        
        return {
          ...topic,
          author: authorWithoutPassword
        };
      })
    );
    
    res.status(200).json({ topics: topicsWithAuthors });
  } catch (error) {
    console.error('Error fetching recent topics:', error);
    res.status(500).json({
      message: 'Error fetching recent topics',
      error: error.message
    });
  }
};

// Reply controllers
export const createReply = async (req: Request, res: Response) => {
  try {
    const authorId = req.user._id;
    const { topicId, content, parentReplyId } = req.body;
    
    if (!topicId || !content) {
      return res.status(400).json({ message: 'Topic ID and content are required' });
    }
    
    // Check if topic exists
    const topic = await ForumModel.getTopicById(topicId);
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    // Check if topic is locked
    if (topic.isLocked && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'This topic is locked and cannot be replied to' });
    }
    
    // If this is a nested reply, check if parent reply exists
    if (parentReplyId) {
      const parentReply = await ForumModel.getReplyById(parentReplyId);
      
      if (!parentReply) {
        return res.status(404).json({ message: 'Parent reply not found' });
      }
      
      // Make sure parent reply belongs to the same topic
      if (parentReply.topicId.toString() !== topicId) {
        return res.status(400).json({ message: 'Parent reply does not belong to the specified topic' });
      }
    }
    
    // Create reply
    const replyData: IForumReply = {
      topicId: new ObjectId(topicId),
      authorId: new ObjectId(authorId),
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    if (parentReplyId) {
      replyData.parentReplyId = new ObjectId(parentReplyId);
    }
    
    const reply = await ForumModel.createReply(replyData);
    
    res.status(201).json({
      message: 'Reply created successfully',
      reply
    });
  } catch (error) {
    console.error('Error creating reply:', error);
    res.status(500).json({
      message: 'Error creating reply',
      error: error.message
    });
  }
};

export const updateReply = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    
    // Get reply
    const reply = await ForumModel.getReplyById(id);
    
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }
    
    // Check if user is the author or admin
    if (reply.authorId.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to update this reply' });
    }
    
    // Get topic to check if it's locked
    const topic = await ForumModel.getTopicById(reply.topicId);
    
    if (topic?.isLocked && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'This topic is locked and replies cannot be updated' });
    }
    
    // Update reply
    const updated = await ForumModel.updateReply(id, {
      content,
      updatedAt: new Date()
    });
    
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update reply' });
    }
    
    // Get updated reply
    const updatedReply = await ForumModel.getReplyById(id);
    
    res.status(200).json({
      message: 'Reply updated successfully',
      reply: updatedReply
    });
  } catch (error) {
    console.error('Error updating reply:', error);
    res.status(500).json({
      message: 'Error updating reply',
      error: error.message
    });
  }
};

export const markReplyAsAccepted = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    // Get reply
    const reply = await ForumModel.getReplyById(id);
    
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }
    
    // Get topic
    const topic = await ForumModel.getTopicById(reply.topicId);
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    // Check if user is the topic author or admin
    if (topic.authorId.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the topic author or an admin can mark a reply as accepted' });
    }
    
    // Mark as accepted
    const marked = await ForumModel.markReplyAsAccepted(id, reply.topicId);
    
    if (!marked) {
      return res.status(400).json({ message: 'Failed to mark reply as accepted' });
    }
    
    res.status(200).json({ message: 'Reply marked as accepted' });
  } catch (error) {
    console.error('Error marking reply as accepted:', error);
    res.status(500).json({
      message: 'Error marking reply as accepted',
      error: error.message
    });
  }
};

export const searchTopics = async (req: Request, res: Response) => {
  try {
    const { query, limit, skip } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const options: any = {};
    
    if (limit) {
      options.limit = parseInt(limit as string);
    }
    
    if (skip) {
      options.skip = parseInt(skip as string);
    }
    
    const topics = await ForumModel.searchTopics(query as string, options);
    
    // Get author details for each topic
    const topicsWithAuthors = await Promise.all(
      topics.map(async (topic) => {
        const author = await UserModel.findById(topic.authorId);
        
        if (!author) return topic;
        
        // Remove sensitive information
        const { password, ...authorWithoutPassword } = author;
        
        return {
          ...topic,
          author: authorWithoutPassword
        };
      })
    );
    
    res.status(200).json({ topics: topicsWithAuthors });
  } catch (error) {
    console.error('Error searching topics:', error);
    res.status(500).json({
      message: 'Error searching topics',
      error: error.message
    });
  }
}; 