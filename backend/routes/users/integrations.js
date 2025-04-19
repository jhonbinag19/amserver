const express = require('express');
const router = express.Router();
const integrationsController = require('../../controllers/users/integrationsController');
const { authenticateUser } = require('../../middleware/auth');

// Apply user authentication middleware to all routes
router.use(authenticateUser);

// Integrations management routes
router.get('/', integrationsController.getIntegrations);
router.post('/', integrationsController.createIntegration);
router.get('/:id', integrationsController.getIntegrationById);
router.put('/:id', integrationsController.updateIntegration);
router.delete('/:id', integrationsController.deleteIntegration);
router.post('/:id/sync', integrationsController.syncIntegration);
router.get('/:id/status', integrationsController.getIntegrationStatus);
router.get('/:id/webhooks', integrationsController.getWebhooks);
router.post('/:id/webhooks', integrationsController.createWebhook);
router.delete('/:id/webhooks/:webhookId', integrationsController.deleteWebhook);

module.exports = router; 