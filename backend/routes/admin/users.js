const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');
const { authenticateAdmin } = require('../../middleware/auth');

// Apply admin authentication middleware to all routes
router.use(authenticateAdmin);

// User management routes
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.put('/:id/status', userController.updateUserStatus);
router.put('/:id/role', userController.updateUserRole);

module.exports = router; 