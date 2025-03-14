import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { 
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
  addComment,
  rateResource
} from '../controllers/resource.controller';

const router = express.Router();

// Create a new resource
router.post('/', authenticateToken, createResource);

// Get all resources
router.get('/', getResources);

// Get a specific resource by ID
router.get('/:id', getResourceById);

// Update a resource
router.put('/:id', authenticateToken, updateResource);

// Delete a resource
router.delete('/:id', authenticateToken, deleteResource);

// Add a comment to a resource
router.post('/:id/comments', authenticateToken, addComment);

// Rate a resource
router.post('/:id/rate', authenticateToken, rateResource);

export default router; 