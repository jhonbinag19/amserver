const express = require('express');
const router = express.Router();

// Import user route modules
const profileRoutes = require('./profile');
const billingRoutes = require('./billing');
const integrationsRoutes = require('./integrations');
const dashboardRoutes = require('./dashboard');
const workflowActionRoutes = require('./workflowActions');

// Mount user routes
router.use('/profile', profileRoutes);
router.use('/billing', billingRoutes);
router.use('/integrations', integrationsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/workflow-actions', workflowActionRoutes);

module.exports = router; 