const express = require('express');
const router = express.Router();

// Import admin route modules
const usersRoutes = require('./users');
const rolesRoutes = require('./roles');
const toolsRoutes = require('./tools');
const apiRoutes = require('./api');
const schemaRoutes = require('./schema');
const paymentsRoutes = require('./payments');
const accountsRoutes = require('./accounts');

// Mount admin routes
router.use('/users', usersRoutes);
router.use('/roles', rolesRoutes);
router.use('/tools', toolsRoutes);
router.use('/api', apiRoutes);
router.use('/schema', schemaRoutes);
router.use('/payments', paymentsRoutes);
router.use('/accounts', accountsRoutes);

module.exports = router; 