const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Dashboard stats route
router.get('/stats', dashboardController.getStats);

// Recent activity route
router.get('/activity', dashboardController.getRecentActivity);

module.exports = router; 