const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const integrationController = require('../controllers/integrationController');

// Get all available tools
router.get('/tools', authenticateUser, integrationController.getTools);

// Get GHL sub-accounts
router.get('/ghl/sub-accounts', authenticateUser, integrationController.getGHLSubAccounts);

// Get GHL connection status
router.get('/ghl/status', authenticateUser, integrationController.getGHLStatus);

// Install tool for sub-accounts
router.post('/:toolId/install', authenticateUser, integrationController.installToolForSubAccounts);

// Get installed tools
router.get('/installed', authenticateUser, integrationController.getInstalledTools);

// Disconnect tool
router.post('/:toolId/disconnect', authenticateUser, integrationController.disconnectTool);

module.exports = router; 