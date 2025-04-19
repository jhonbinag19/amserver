const Integration = require('../database/models/integration');
const IntegrationConnection = require('../database/models/integrationConnection');

class IntegrationService {
  // Get all available integrations
  async getAllIntegrations() {
    return await Integration.find({ isActive: true });
  }

  // Get integration by ID
  async getIntegrationById(id) {
    return await Integration.findById(id);
  }

  // Get integration by name
  async getIntegrationByName(name) {
    return await Integration.findOne({ name, isActive: true });
  }

  // Get integrations by category
  async getIntegrationsByCategory(category) {
    return await Integration.find({ category, isActive: true });
  }

  // Get integrations by subcategory
  async getIntegrationsBySubcategory(subcategory) {
    return await Integration.find({ subcategory, isActive: true });
  }

  // Create a new integration
  async createIntegration(integrationData) {
    const integration = new Integration(integrationData);
    return await integration.save();
  }

  // Update an existing integration
  async updateIntegration(id, integrationData) {
    return await Integration.findByIdAndUpdate(
      id,
      { $set: integrationData },
      { new: true }
    );
  }

  // Delete an integration (soft delete)
  async deleteIntegration(id) {
    return await Integration.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    );
  }

  // Get organization's integration connections
  async getOrganizationConnections(organizationId) {
    return await IntegrationConnection.find({
      organizationId,
      isActive: true
    }).populate('integrationId');
  }

  // Get specific organization integration connection
  async getOrganizationConnection(organizationId, integrationId) {
    return await IntegrationConnection.findOne({
      organizationId,
      integrationId,
      isActive: true
    }).populate('integrationId');
  }

  // Create or update organization integration connection
  async saveOrganizationConnection(organizationId, integrationId, connectionData) {
    return await IntegrationConnection.findOneAndUpdate(
      { organizationId, integrationId },
      {
        $set: {
          ...connectionData,
          status: 'connected',
          lastSync: new Date()
        }
      },
      { upsert: true, new: true }
    );
  }

  // Disconnect organization integration
  async disconnectOrganizationIntegration(organizationId, integrationId) {
    return await IntegrationConnection.findOneAndUpdate(
      { organizationId, integrationId },
      {
        $set: {
          status: 'disconnected',
          credentials: {},
          oauthTokens: {},
          lastSync: null
        }
      },
      { new: true }
    );
  }

  // Update integration connection status
  async updateConnectionStatus(organizationId, integrationId, status, error = null) {
    const updateData = {
      status,
      lastSync: new Date()
    };

    if (error) {
      updateData.error = {
        message: error.message,
        code: error.code,
        timestamp: new Date()
      };
    }

    return await IntegrationConnection.findOneAndUpdate(
      { organizationId, integrationId },
      { $set: updateData },
      { new: true }
    );
  }

  // Get integration connection status
  async getConnectionStatus(organizationId, integrationId) {
    const connection = await IntegrationConnection.findOne({
      organizationId,
      integrationId,
      isActive: true
    }).populate('integrationId');

    if (!connection) {
      return null;
    }

    return {
      integration_name: connection.integrationId.displayName,
      type: connection.integrationId.authType,
      status: connection.status,
      last_sync: connection.lastSync
    };
  }
}

module.exports = new IntegrationService(); 