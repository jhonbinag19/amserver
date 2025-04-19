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

  const getGHLSubAccounts = async (req, res) => {
    try {
      const { ghlService } = req.app.locals;
      const subAccounts = await ghlService.getSubAccounts();
      
      res.json(subAccounts);
    } catch (error) {
      console.error('Failed to fetch GHL sub-accounts:', error);
      res.status(500).json({ error: 'Failed to fetch sub-accounts' });
    }
  };

  const installToolForSubAccounts = async (req, res) => {
    try {
      const { toolId } = req.params;
      const { subAccounts } = req.body;
      const { ghlService, integrationService } = req.app.locals;

      // Verify tool exists
      const tool = await integrationService.getTool(toolId);
      if (!tool) {
        return res.status(404).json({ error: 'Tool not found' });
      }

      // Install tool for each sub-account
      const installations = await Promise.all(
        subAccounts.map(async (subAccountId) => {
          try {
            // Get sub-account details
            const subAccount = await ghlService.getSubAccount(subAccountId);
            
            // Install tool for sub-account
            const installation = await integrationService.installTool({
              toolId,
              subAccountId,
              subAccountName: subAccount.name,
              userId: req.user.id
            });

            return {
              subAccountId,
              status: 'success',
              installation
            };
          } catch (error) {
            return {
              subAccountId,
              status: 'failed',
              error: error.message
            };
          }
        })
      );

      // Check if any installations failed
      const failedInstallations = installations.filter(i => i.status === 'failed');
      if (failedInstallations.length > 0) {
        return res.status(207).json({
          message: 'Some installations failed',
          installations
        });
      }

      res.json({
        message: 'Tool installed successfully for all sub-accounts',
        installations
      });

    } catch (error) {
      console.error('Failed to install tool:', error);
      res.status(500).json({ error: 'Failed to install tool' });
    }
  };
}

module.exports = new IntegrationController(); 