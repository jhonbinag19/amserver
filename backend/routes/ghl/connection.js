const express = require('express');
const router = express.Router();
const connectionService = require('../../services/ghl/connectionService');

// Check connection status
router.get('/organizations/:organizationId/connection-status', async (req, res) => {
  try {
    const status = await connectionService.getConnectionStatus(req.params.organizationId);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Connect with API key
router.post('/organizations/:organizationId/connect-api', async (req, res) => {
  try {
    const connection = await connectionService.connectWithApiKey({
      ...req.body,
      organization_id: req.params.organizationId
    });
    res.status(201).json(connection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initiate OAuth connection
router.get('/oauth/authorize', async (req, res) => {
  try {
    const authUrl = await connectionService.getOAuthAuthorizationUrl();
    res.json({ authorizationUrl: authUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// OAuth callback
router.get('/oauth/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    const connection = await connectionService.handleOAuthCallback(code, state);
    res.redirect('/dashboard/ghl-integration?connected=true');
  } catch (error) {
    res.redirect('/dashboard/ghl-integration?error=connection_failed');
  }
});

// Disconnect
router.post('/organizations/:organizationId/disconnect', async (req, res) => {
  try {
    await connectionService.disconnect(req.params.organizationId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 