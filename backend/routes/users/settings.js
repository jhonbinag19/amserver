const express = require('express');
const router = express.Router();
const settingsController = require('../../controllers/users/settingsController');
const { authenticateUser } = require('../../middleware/auth');

// Apply user authentication middleware to all routes
router.use(authenticateUser);

// Settings management routes
router.get('/', settingsController.getSettings);
router.put('/', settingsController.updateSettings);
router.get('/notifications', settingsController.getNotificationSettings);
router.put('/notifications', settingsController.updateNotificationSettings);
router.get('/security', settingsController.getSecuritySettings);
router.put('/security', settingsController.updateSecuritySettings);
router.get('/api-keys', settingsController.getApiKeys);
router.post('/api-keys', settingsController.createApiKey);
router.delete('/api-keys/:id', settingsController.deleteApiKey);

module.exports = router; 