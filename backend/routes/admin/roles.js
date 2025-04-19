const express = require('express');
const router = express.Router();
const roleController = require('../../controllers/admin/roleController');
const { authenticateAdmin } = require('../../middleware/auth');

// Apply admin authentication middleware to all routes
router.use(authenticateAdmin);

// Role management routes
router.get('/', roleController.getAllRoles);
router.post('/', roleController.createRole);
router.get('/:id', roleController.getRoleById);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);
router.get('/:id/permissions', roleController.getRolePermissions);
router.put('/:id/permissions', roleController.updateRolePermissions);

module.exports = router; 