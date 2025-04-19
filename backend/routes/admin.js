const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateAdmin } = require('../middleware/auth');

// Apply auth middleware to all admin routes
router.use(authenticateAdmin);

// User management routes
router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);
router.put('/users/:id/status', userController.updateUserStatus);
router.put('/users/:id/role', userController.updateUserRole);
router.patch('/users/:id/toggle-admin', userController.toggleAdminStatus);

module.exports = router; 