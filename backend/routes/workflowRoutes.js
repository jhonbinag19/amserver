const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflowController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes except webhooks
router.use((req, res, next) => {
  if (req.path.startsWith('/webhook/')) {
    return next();
  }
  authMiddleware(req, res, next);
});

// Get all workflows for an organization
router.get('/organizations/:organizationId', workflowController.getOrganizationWorkflows);

// Get workflow by ID
router.get('/:id', workflowController.getWorkflowById);

// Create a new workflow
router.post('/organizations/:organizationId', workflowController.createWorkflow);

// Update a workflow
router.put('/:id', workflowController.updateWorkflow);

// Delete a workflow
router.delete('/:id', workflowController.deleteWorkflow);

// Toggle workflow active status
router.put('/:id/toggle', workflowController.toggleWorkflow);

// Get workflow execution history
router.get('/:id/history', workflowController.getWorkflowHistory);

// Handle webhook trigger (no auth required)
router.post('/webhook/:workflowId', workflowController.handleWebhook);

// Execute workflow manually
router.post('/:id/execute', workflowController.executeWorkflow);

module.exports = router; 