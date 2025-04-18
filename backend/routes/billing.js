const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const authMiddleware = require('../middleware/auth');
const checkPermission = require('../middleware/permission');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Billing routes with permission checks
router.post('/', 
  checkPermission('billing', 'create'),
  billingController.createBilling
);

router.get('/', 
  checkPermission('billing', 'read'),
  billingController.getBillings
);

router.put('/:id', 
  checkPermission('billing', 'update'),
  billingController.updateBilling
);

router.delete('/:id', 
  checkPermission('billing', 'delete'),
  billingController.deleteBilling
);

module.exports = router; 