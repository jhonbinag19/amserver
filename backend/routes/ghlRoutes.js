import express from 'express';
import { ghlService } from '../services/ghlService';

const router = express.Router();

// Middleware to verify organization access
const verifyOrganizationAccess = async (req, res, next) => {
  const { organizationId } = req.params;
  const userId = req.user.id;

  try {
    const member = await database.supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', userId)
      .single();

    if (!member) {
      return res.status(403).json({ error: 'Access denied' });
    }

    req.memberRole = member.role;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Agency Account Routes
router.post('/organizations/:organizationId/agency-accounts', verifyOrganizationAccess, async (req, res) => {
  try {
    const agencyAccount = await ghlService.createAgencyAccount(
      req.params.organizationId,
      req.body
    );
    res.json(agencyAccount);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/organizations/:organizationId/agency-accounts', verifyOrganizationAccess, async (req, res) => {
  try {
    const agencyAccounts = await ghlService.getAgencyAccounts(req.params.organizationId);
    res.json(agencyAccounts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sub Account Routes
router.post('/agency-accounts/:agencyAccountId/sub-accounts', verifyOrganizationAccess, async (req, res) => {
  try {
    const subAccount = await ghlService.createSubAccount(
      req.params.agencyAccountId,
      req.body
    );
    res.json(subAccount);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/agency-accounts/:agencyAccountId/sub-accounts', verifyOrganizationAccess, async (req, res) => {
  try {
    const subAccounts = await ghlService.getSubAccounts(req.params.agencyAccountId);
    res.json(subAccounts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Integration Settings Routes
router.put('/organizations/:organizationId/integration-settings', verifyOrganizationAccess, async (req, res) => {
  try {
    const settings = await ghlService.updateIntegrationSettings(
      req.params.organizationId,
      req.body
    );
    res.json(settings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Webhook Routes
router.post('/organizations/:organizationId/webhooks', verifyOrganizationAccess, async (req, res) => {
  try {
    const webhook = await ghlService.subscribeToWebhook(
      req.params.organizationId,
      req.body
    );
    res.json(webhook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Webhook Handler
router.post('/webhooks/:organizationId', async (req, res) => {
  try {
    const { organizationId } = req.params;
    const eventData = req.body;

    // Verify webhook signature if provided
    // Process the webhook event
    // Update workflow state or trigger actions

    res.status(200).json({ received: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router; 