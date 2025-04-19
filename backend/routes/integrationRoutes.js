const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integrationController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all available integrations
router.get('/', integrationController.getAllIntegrations);

// Get integration by ID
router.get('/:id', integrationController.getIntegrationById);

// Get organization's integration connections
router.get('/organizations/:organizationId/connections', integrationController.getOrganizationConnections);

// Connect an integration to an organization
router.post('/organizations/:organizationId/connect/:integrationId', integrationController.connectIntegration);

// Disconnect an integration from an organization
router.post('/organizations/:organizationId/disconnect/:integrationId', integrationController.disconnectIntegration);

// Get integration connection status
router.get('/organizations/:organizationId/connection-status/:integrationId', integrationController.getConnectionStatus);

// Update integration connection status
router.put('/organizations/:organizationId/connection-status/:integrationId', integrationController.updateConnectionStatus);

module.exports = router; 