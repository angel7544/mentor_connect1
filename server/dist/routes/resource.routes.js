"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const resource_controller_1 = require("../controllers/resource.controller");
const router = express_1.default.Router();
// Create a new resource
router.post('/', auth_middleware_1.authenticateToken, resource_controller_1.createResource);
// Get all resources
router.get('/', resource_controller_1.getResources);
// Get a specific resource by ID
router.get('/:id', resource_controller_1.getResourceById);
// Update a resource
router.put('/:id', auth_middleware_1.authenticateToken, resource_controller_1.updateResource);
// Delete a resource
router.delete('/:id', auth_middleware_1.authenticateToken, resource_controller_1.deleteResource);
// Add a comment to a resource
router.post('/:id/comments', auth_middleware_1.authenticateToken, resource_controller_1.addComment);
// Rate a resource
router.post('/:id/rate', auth_middleware_1.authenticateToken, resource_controller_1.rateResource);
exports.default = router;
