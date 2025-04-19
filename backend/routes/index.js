const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const userRoutes = require('./users');

// Mount routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);

module.exports = router; 