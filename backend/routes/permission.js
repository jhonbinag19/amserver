const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const authMiddleware = require('../middleware/auth');
const checkPermission = require('../middleware/permission');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Permission routes with permission checks
router.post('/', 
  checkPermission('permissions', 'create'),
  permissionController.createPermission
);

router.get('/', 
  checkPermission('permissions', 'read'),
  permissionController.getPermissions
);

router.put('/:id', 
  checkPermission('permissions', 'update'),
  permissionController.updatePermission
);

router.delete('/:id', 
  checkPermission('permissions', 'delete'),
  permissionController.deletePermission
);

module.exports = router; 