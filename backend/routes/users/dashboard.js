const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/users/dashboardController');
const { authenticateUser } = require('../../middleware/auth');

// Apply user authentication middleware to all routes
router.use(authenticateUser);

// Dashboard routes
router.get('/stats', dashboardController.getStats);
router.get('/activity', dashboardController.getRecentActivity);
router.get('/integrations', dashboardController.getIntegrationStats);
router.get('/billing', dashboardController.getBillingStats);

module.exports = router; 