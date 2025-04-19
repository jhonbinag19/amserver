const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/users/profileController');
const { authenticateUser } = require('../../middleware/auth');

// Apply user authentication middleware to all routes
router.use(authenticateUser);

// Profile management routes
router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);
router.put('/password', profileController.updatePassword);
router.put('/avatar', profileController.updateAvatar);
router.get('/preferences', profileController.getPreferences);
router.put('/preferences', profileController.updatePreferences);

module.exports = router; 