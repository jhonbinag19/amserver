const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./user');
const dashboardRoutes = require('./dashboard');
const ghlRoutes = require('./ghl');
const roleRoutes = require('./role');
const permissionRoutes = require('./permission');
const subscriptionTypeRoutes = require('./subscriptionType');
const billingRoutes = require('./billing');

// Auth routes
router.use('/auth', authRoutes);

// User routes
router.use('/user', userRoutes);

// Dashboard routes
router.use('/dashboard', dashboardRoutes);

// GHL routes
router.use('/ghl', ghlRoutes);

// Role and permission routes
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);

// Subscription and billing routes
router.use('/subscription-types', subscriptionTypeRoutes);
router.use('/billings', billingRoutes);

module.exports = router; 