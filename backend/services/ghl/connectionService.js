const db = require('../../database/models');
const { Connection } = db;
const axios = require('axios');

const INTEGRATION_CONFIGS = {
  flodesk: {
    authType: 'api_key',
    validateUrl: 'https://api.flodesk.com/v1/contacts',
    headers: (apiKey) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    })
  },
  gohighlevel: {
    authType: 'oauth',
    clientId: process.env.GHL_CLIENT_ID,
    clientSecret: process.env.GHL_CLIENT_SECRET,
    redirectUri: process.env.GHL_REDIRECT_URI,
    authorizationUrl: 'https://marketplace.gohighlevel.com/oauth/chooselocation',
    tokenUrl: 'https://services.leadconnectorhq.com/oauth/token',
    validateUrl: 'https://services.leadconnectorhq.com/contacts'
  },
  stripe: {
    authType: 'api_key_secret',
    validateUrl: 'https://api.stripe.com/v1/charges',
    headers: (apiKey) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  }
};

const connectionService = {
  async getConnectionStatus(organizationId) {
    const connection = await Connection.findOne({
      where: { organization_id: organizationId }
    });

    if (!connection) {
      return null;
    }

    return {
      integration_name: connection.integration_type,
      type: connection.type,
      status: connection.status,
      last_sync: connection.last_sync
    };
  },

  async connect(data) {
    const { organization_id, integration_type, auth_type, ...credentials } = data;
    const config = INTEGRATION_CONFIGS[integration_type];

    if (!config) {
      throw new Error('Invalid integration type');
    }

    if (config.authType !== auth_type) {
      throw new Error('Invalid authentication type for this integration');
    }

    // Validate credentials based on integration type
    switch (auth_type) {
      case 'api_key':
        await this.validateApiKey(integration_type, credentials.api_key);
        break;
      case 'api_key_secret':
        await this.validateApiKeySecret(integration_type, credentials.api_key, credentials.api_secret);
        break;
      case 'oauth':
        // OAuth validation happens in the callback
        break;
      default:
        throw new Error('Invalid authentication type');
    }

    // Create or update connection
    const [connection] = await Connection.upsert({
      organization_id,
      integration_type,
      type: auth_type,
      ...credentials,
      status: 'connected',
      last_sync: new Date()
    });

    return connection;
  },

  async validateApiKey(integration, apiKey) {
    const config = INTEGRATION_CONFIGS[integration];
    try {
      await axios.get(config.validateUrl, {
        headers: config.headers(apiKey)
      });
    } catch (error) {
      throw new Error('Invalid API credentials');
    }
  },

  async validateApiKeySecret(integration, apiKey, apiSecret) {
    const config = INTEGRATION_CONFIGS[integration];
    try {
      // For Stripe, we validate by making a test request
      if (integration === 'stripe') {
        await axios.get(config.validateUrl, {
          headers: config.headers(apiKey)
        });
      }
      // Add other integrations' validation logic here
    } catch (error) {
      throw new Error('Invalid API credentials');
    }
  },

  getOAuthAuthorizationUrl(integration) {
    const config = INTEGRATION_CONFIGS[integration];
    if (!config || config.authType !== 'oauth') {
      throw new Error('OAuth not supported for this integration');
    }

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: 'contacts.readonly contacts.write',
      state: Math.random().toString(36).substring(7)
    });

    return `${config.authorizationUrl}?${params.toString()}`;
  },

  async handleOAuthCallback(integration, code, state) {
    const config = INTEGRATION_CONFIGS[integration];
    if (!config || config.authType !== 'oauth') {
      throw new Error('OAuth not supported for this integration');
    }

    // Exchange code for access token
    const tokenResponse = await axios.post(config.tokenUrl, {
      grant_type: 'authorization_code',
      code,
      redirect_uri: config.redirectUri,
      client_id: config.clientId,
      client_secret: config.clientSecret
    });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // Get organization details
    const orgResponse = await axios.get('https://services.leadconnectorhq.com/organizations', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Version': '2021-07-28'
      }
    });

    const organizationId = orgResponse.data.organizations[0].id;

    // Create or update connection
    const [connection] = await Connection.upsert({
      organization_id: organizationId,
      integration_type: integration,
      type: 'oauth',
      access_token,
      refresh_token,
      token_expires_at: new Date(Date.now() + expires_in * 1000),
      status: 'connected',
      last_sync: new Date()
    });

    return connection;
  },

  async disconnect(organizationId) {
    await Connection.destroy({
      where: { organization_id: organizationId }
    });
  }
};

module.exports = connectionService; 