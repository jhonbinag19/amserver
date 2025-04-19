const integrationService = require('../services/integrationService');

class IntegrationController {
  // Get all available integrations
  async getAllIntegrations(req, res) {
    try {
      const integrations = await integrationService.getAllIntegrations();
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get integration by ID
  async getIntegrationById(req, res) {
    try {
      const integration = await integrationService.getIntegrationById(req.params.id);
      if (!integration) {
        return res.status(404).json({ error: 'Integration not found' });
      }
      res.json(integration);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get organization's integration connections
  async getOrganizationConnections(req, res) {
    try {
      const connections = await integrationService.getOrganizationConnections(req.params.organizationId);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Connect an integration to an organization
  async connectIntegration(req, res) {
    try {
      const { organizationId, integrationId } = req.params;
      const { credentials, oauthTokens } = req.body;

      const connection = await integrationService.saveOrganizationConnection(
        organizationId,
        integrationId,
        { credentials, oauthTokens }
      );

      res.json(connection);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Disconnect an integration from an organization
  async disconnectIntegration(req, res) {
    try {
      const { organizationId, integrationId } = req.params;
      const connection = await integrationService.disconnectOrganizationIntegration(
        organizationId,
        integrationId
      );

      res.json(connection);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get integration connection status
  async getConnectionStatus(req, res) {
    try {
      const { organizationId, integrationId } = req.params;
      const status = await integrationService.getConnectionStatus(organizationId, integrationId);

      if (!status) {
        return res.status(404).json({ error: 'Connection not found' });
      }

      res.json(status);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update integration connection status
  async updateConnectionStatus(req, res) {
    try {
      const { organizationId, integrationId } = req.params;
      const { status, error } = req.body;

      const connection = await integrationService.updateConnectionStatus(
        organizationId,
        integrationId,
        status,
        error
      );

      res.json(connection);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new IntegrationController(); 