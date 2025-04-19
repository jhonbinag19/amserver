const express = require('express');
const router = express.Router();

// Import user route modules
const profileRoutes = require('./profile');
const settingsRoutes = require('./settings');
const billingRoutes = require('./billing');
const integrationsRoutes = require('./integrations');
const dashboardRoutes = require('./dashboard');

// Mount user routes
router.use('/profile', profileRoutes);
router.use('/settings', settingsRoutes);
router.use('/billing', billingRoutes);
router.use('/integrations', integrationsRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router; 