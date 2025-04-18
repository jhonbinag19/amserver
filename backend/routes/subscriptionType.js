const express = require('express');
const router = express.Router();
const subscriptionTypeController = require('../controllers/subscriptionTypeController');
const authMiddleware = require('../middleware/auth');
const checkPermission = require('../middleware/permission');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Subscription type routes with permission checks
router.post('/', 
  checkPermission('subscription-types', 'create'),
  subscriptionTypeController.createSubscriptionType
);

router.get('/', 
  checkPermission('subscription-types', 'read'),
  subscriptionTypeController.getSubscriptionTypes
);

router.put('/:id', 
  checkPermission('subscription-types', 'update'),
  subscriptionTypeController.updateSubscriptionType
);

router.delete('/:id', 
  checkPermission('subscription-types', 'delete'),
  subscriptionTypeController.deleteSubscriptionType
);

module.exports = router; 