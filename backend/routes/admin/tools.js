const express = require('express');
const router = express.Router();
const toolController = require('../../controllers/admin/toolController');
const { authenticateAdmin } = require('../../middleware/auth');

// Apply admin authentication middleware to all routes
router.use(authenticateAdmin);

// Tool management routes
router.get('/', toolController.getAllTools);
router.post('/', toolController.createTool);
router.get('/:id', toolController.getToolById);
router.put('/:id', toolController.updateTool);
router.delete('/:id', toolController.deleteTool);
router.put('/:id/status', toolController.updateToolStatus);
router.post('/:id/sync', toolController.syncTool);
router.get('/:id/status', toolController.getToolStatus);

module.exports = router; 