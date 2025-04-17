const express = require('express');
const router = express.Router();
const paymentService = require('../../services/ghl/paymentService');

// Get subscription details
router.get('/organizations/:organizationId/subscription', async (req, res) => {
  try {
    const subscription = await paymentService.getSubscription(req.params.organizationId);
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment history
router.get('/organizations/:organizationId/payments', async (req, res) => {
  try {
    const payments = await paymentService.getPayments(req.params.organizationId);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Process payment
router.post('/organizations/:organizationId/payments', async (req, res) => {
  try {
    const payment = await paymentService.processPayment({
      ...req.body,
      organization_id: req.params.organizationId
    });
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update subscription plan
router.put('/organizations/:organizationId/subscription', async (req, res) => {
  try {
    const subscription = await paymentService.updateSubscription({
      ...req.body,
      organization_id: req.params.organizationId
    });
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel subscription
router.post('/organizations/:organizationId/subscription/cancel', async (req, res) => {
  try {
    await paymentService.cancelSubscription(req.params.organizationId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 