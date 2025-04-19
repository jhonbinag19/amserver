const express = require('express');
const router = express.Router();
const billingController = require('../../controllers/users/billingController');
const { authenticateUser } = require('../../middleware/auth');

// Apply user authentication middleware to all routes
router.use(authenticateUser);

// Billing management routes
router.get('/', billingController.getBillingInfo);
router.put('/', billingController.updateBillingInfo);
router.get('/invoices', billingController.getInvoices);
router.get('/invoices/:id', billingController.getInvoiceById);
router.get('/payment-methods', billingController.getPaymentMethods);
router.post('/payment-methods', billingController.addPaymentMethod);
router.delete('/payment-methods/:id', billingController.removePaymentMethod);
router.get('/subscription', billingController.getSubscription);
router.put('/subscription', billingController.updateSubscription);
router.post('/subscription/cancel', billingController.cancelSubscription);
router.post('/subscription/resume', billingController.resumeSubscription);

module.exports = router; 