const express = require('express');
const router = express.Router();
const apiController = require('../../controllers/admin/apiController');
const { authenticateAdmin } = require('../../middleware/auth');

// Apply admin authentication middleware to all routes
router.use(authenticateAdmin);

// API management routes
router.get('/status', apiController.getApiStatus);
router.post('/sync', apiController.syncApi);
router.get('/features', apiController.getAllFeatures);
router.post('/features', apiController.createFeature);
router.delete('/features/:id', apiController.deleteFeature);
router.get('/endpoints', apiController.getAllEndpoints);
router.post('/endpoints', apiController.createEndpoint);
router.put('/endpoints/:id', apiController.updateEndpoint);
router.delete('/endpoints/:id', apiController.deleteEndpoint);

module.exports = router; 