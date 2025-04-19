const express = require('express');
const router = express.Router();
const accountController = require('../../controllers/admin/accountController');
const { authenticateAdmin } = require('../../middleware/auth');

// Apply admin authentication middleware to all routes
router.use(authenticateAdmin);

// Account management routes
router.get('/', accountController.getAllAccounts);
router.post('/', accountController.createAccount);
router.get('/:id', accountController.getAccountById);
router.put('/:id', accountController.updateAccount);
router.delete('/:id', accountController.deleteAccount);
router.put('/:id/status', accountController.updateAccountStatus);
router.put('/:id/plan', accountController.updateAccountPlan);
router.get('/:id/billing', accountController.getAccountBilling);
router.put('/:id/billing', accountController.updateAccountBilling);

module.exports = router; 