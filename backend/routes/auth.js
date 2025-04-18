const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login route
router.post('/login', authController.login);

// Token verification route
router.get('/verify', authController.verifyToken);

module.exports = router; 