const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authMiddleware = require('../middleware/auth');
const checkPermission = require('../middleware/permission');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Role routes with permission checks
router.post('/', 
  checkPermission('roles', 'create'),
  roleController.createRole
);

router.get('/', 
  checkPermission('roles', 'read'),
  roleController.getRoles
);

router.put('/:id', 
  checkPermission('roles', 'update'),
  roleController.updateRole
);

router.delete('/:id', 
  checkPermission('roles', 'delete'),
  roleController.deleteRole
);

module.exports = router; 