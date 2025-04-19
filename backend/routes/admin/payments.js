const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/admin/paymentController');
const { authenticateAdmin } = require('../../middleware/auth');

// Apply admin authentication middleware to all routes
router.use(authenticateAdmin);

// Payment management routes
router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);
router.post('/refund/:id', paymentController.refundPayment);
router.get('/history/:userId', paymentController.getUserPaymentHistory);
router.get('/stats', paymentController.getPaymentStats);
router.post('/webhook', paymentController.handleWebhook);

module.exports = router; 