import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { ResourceModel, IResource, IResourceRating } from '../models/resource.model';
import { UserModel } from '../models/user.model';

// Create a new resource
export const createResource = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const resourceData = req.body;
    
    // Validate required fields
    if (!resourceData.title || !resourceData.description || !resourceData.resourceType) {
      return res.status(400).json({ message: 'Title, description, and resource type are required' });
    }
    
    // Create resource
    const resource: IResource = {
      ...resourceData,
      authorId: new ObjectId(userId),
      isPublic: resourceData.isPublic !== undefined ? resourceData.isPublic : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const createdResource = await ResourceModel.create(resource);
    
    res.status(201).json({
      message: 'Resource created successfully',
      resource: createdResource
    });
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({
      message: 'Error creating resource',
      error: error.message
    });
  }
};

// Get all resources
export const getResources = async (req: Request, res: Response) => {
  try {
    const { 
      searchQuery, 
      categories, 
      tags, 
      resourceType, 
      limit, 
      skip,
      sortBy,
      sortDirection
    } = req.query;
    
    const filters: any = {};
    
    if (searchQuery) {
      filters.searchQuery = searchQuery as string;
    }
    
    if (categories) {
      filters.categories = Array.isArray(categories) ? categories : [categories as string];
    }
    
    if (tags) {
      filters.tags = Array.isArray(tags) ? tags : [tags as string];
    }
    
    if (resourceType) {
      filters.resourceType = Array.isArray(resourceType) ? resourceType : resourceType as string;
    }
    
    if (limit) {
      filters.limit = parseInt(limit as string);
    }
    
    if (skip) {
      filters.skip = parseInt(skip as string);
    }
    
    if (sortBy) {
      filters.sortBy = sortBy as string;
    }
    
    if (sortDirection) {
      filters.sortDirection = sortDirection as 'asc' | 'desc';
    }
    
    const resources = await ResourceModel.findAll(filters);
    
    // Get author details for each resource
    const resourcesWithAuthors = await Promise.all(
      resources.map(async (resource) => {
        if (!resource.authorId) return resource;
        
        const author = await UserModel.findById(resource.authorId);
        
        if (!author) return resource;
        
        // Remove sensitive information
        const { password, ...authorWithoutPassword } = author;
        
        return {
          ...resource,
          author: authorWithoutPassword
        };
      })
    );
    
    res.status(200).json({ resources: resourcesWithAuthors });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({
      message: 'Error fetching resources',
      error: error.message
    });
  }
};

// Get a specific resource by ID
export const getResourceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const resource = await ResourceModel.findById(id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Increment view count
    await ResourceModel.incrementViewCount(id);
    
    // Get author details
    let author = null;
    if (resource.authorId) {
      const authorData = await UserModel.findById(resource.authorId);
      
      if (authorData) {
        // Remove sensitive information
        const { password, ...authorWithoutPassword } = authorData;
        author = authorWithoutPassword;
      }
    }
    
    res.status(200).json({ 
      resource: {
        ...resource,
        author
      }
    });
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({
      message: 'Error fetching resource',
      error: error.message
    });
  }
};

// Update a resource
export const updateResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updateData = req.body;
    
    // Get resource
    const resource = await ResourceModel.findById(id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Check if user is the author or admin
    if (resource.authorId?.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to update this resource' });
    }
    
    // Update resource
    const updated = await ResourceModel.updateById(id, {
      ...updateData,
      updatedAt: new Date()
    });
    
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update resource' });
    }
    
    // Get updated resource
    const updatedResource = await ResourceModel.findById(id);
    
    res.status(200).json({
      message: 'Resource updated successfully',
      resource: updatedResource
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({
      message: 'Error updating resource',
      error: error.message
    });
  }
};

// Delete a resource
export const deleteResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    // Get resource
    const resource = await ResourceModel.findById(id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Check if user is the author or admin
    if (resource.authorId?.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to delete this resource' });
    }
    
    // Delete resource
    const deleted = await ResourceModel.delete(id);
    
    if (!deleted) {
      return res.status(400).json({ message: 'Failed to delete resource' });
    }
    
    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({
      message: 'Error deleting resource',
      error: error.message
    });
  }
};

// Add a comment to a resource
export const addComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }
    
    // Check if resource exists
    const resource = await ResourceModel.findById(id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Add comment
    const added = await ResourceModel.addComment(id, userId, content);
    
    if (!added) {
      return res.status(400).json({ message: 'Failed to add comment' });
    }
    
    // Get updated resource
    const updatedResource = await ResourceModel.findById(id);
    
    res.status(200).json({
      message: 'Comment added successfully',
      resource: updatedResource
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      message: 'Error adding comment',
      error: error.message
    });
  }
};

// Rate a resource
export const rateResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { rating, review } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Valid rating (1-5) is required' });
    }
    
    // Check if resource exists
    const resource = await ResourceModel.findById(id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Create rating
    const ratingData: IResourceRating = {
      resourceId: new ObjectId(id),
      userId: new ObjectId(userId),
      rating,
      review,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add rating
    const added = await ResourceModel.rateResource(ratingData);
    
    if (!added) {
      return res.status(400).json({ message: 'Failed to rate resource' });
    }
    
    // Get updated resource
    const updatedResource = await ResourceModel.findById(id);
    
    res.status(200).json({
      message: 'Resource rated successfully',
      resource: updatedResource
    });
  } catch (error) {
    console.error('Error rating resource:', error);
    res.status(500).json({
      message: 'Error rating resource',
      error: error.message
    });
  }
}; 