const express = require('express');
const router = express.Router();
const workflowActionController = require('../../controllers/users/workflowActionController');
const { authenticateUser } = require('../../middleware/auth');

// Apply user authentication middleware to all routes
router.use(authenticateUser);

// Workflow actions management routes
router.get('/', workflowActionController.getWorkflowActions);
router.post('/', workflowActionController.createWorkflowAction);
router.get('/:id', workflowActionController.getWorkflowActionById);
router.put('/:id', workflowActionController.updateWorkflowAction);
router.delete('/:id', workflowActionController.deleteWorkflowAction);
router.post('/:id/execute', workflowActionController.executeWorkflowAction);

module.exports = router; 