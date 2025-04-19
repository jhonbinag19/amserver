const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const workflowActionController = require('../controllers/workflowActionController');

// Get all workflow actions
router.get('/', authenticateUser, workflowActionController.getActions);

// Add a new workflow action
router.post('/', authenticateUser, workflowActionController.addAction);

// Update a workflow action
router.put('/:id', authenticateUser, workflowActionController.updateAction);

// Delete a workflow action
router.delete('/:id', authenticateUser, workflowActionController.deleteAction);

// Get actions by integration
router.get('/integration/:integrationId', authenticateUser, workflowActionController.getActionsByIntegration);

// Sync actions with GHL
router.post('/sync-ghl', authenticateUser, workflowActionController.syncActionsWithGHL);

module.exports = router; 