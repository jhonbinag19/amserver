import { database } from '../database/supabaseClient';

class GHLService {
  constructor() {
    this.baseUrl = 'https://rest.gohighlevel.com/v1';
  }

  // Agency Account Operations
  async createAgencyAccount(organizationId, agencyData) {
    const { name, agencyId, apiKey } = agencyData;
    
    // Verify the API key with GoHighLevel
    const isValid = await this.verifyApiKey(apiKey);
    if (!isValid) {
      throw new Error('Invalid GoHighLevel API key');
    }

    const agencyAccount = await database.supabase
      .from('ghl_agency_accounts')
      .insert([{
        organization_id: organizationId,
        name,
        agency_id: agencyId,
        api_key: apiKey,
        metadata: {
          verified_at: new Date().toISOString()
        }
      }])
      .select()
      .single();

    return agencyAccount;
  }

  async getAgencyAccounts(organizationId) {
    return await database.supabase
      .from('ghl_agency_accounts')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_active', true);
  }

  // Sub Account Operations
  async createSubAccount(agencyAccountId, subAccountData) {
    const { name, subAccountId, apiKey } = subAccountData;
    
    // Verify the API key with GoHighLevel
    const isValid = await this.verifyApiKey(apiKey);
    if (!isValid) {
      throw new Error('Invalid GoHighLevel API key');
    }

    const subAccount = await database.supabase
      .from('ghl_sub_accounts')
      .insert([{
        agency_account_id: agencyAccountId,
        name,
        sub_account_id: subAccountId,
        api_key: apiKey,
        metadata: {
          verified_at: new Date().toISOString()
        }
      }])
      .select()
      .single();

    return subAccount;
  }

  async getSubAccounts(agencyAccountId) {
    return await database.supabase
      .from('ghl_sub_accounts')
      .select('*')
      .eq('agency_account_id', agencyAccountId)
      .eq('is_active', true);
  }

  // Integration Settings
  async updateIntegrationSettings(organizationId, settings) {
    const { agencyAccountId, subAccountId, settings: integrationSettings } = settings;

    return await database.supabase
      .from('ghl_integration_settings')
      .upsert({
        organization_id: organizationId,
        agency_account_id: agencyAccountId,
        sub_account_id: subAccountId,
        settings: integrationSettings
      })
      .select()
      .single();
  }

  // Webhook Management
  async subscribeToWebhook(organizationId, webhookData) {
    const { agencyAccountId, subAccountId, eventType, webhookUrl } = webhookData;

    // Register webhook with GoHighLevel
    const webhookRegistered = await this.registerWebhookWithGHL(
      agencyAccountId,
      subAccountId,
      eventType,
      webhookUrl
    );

    if (!webhookRegistered) {
      throw new Error('Failed to register webhook with GoHighLevel');
    }

    return await database.supabase
      .from('ghl_webhook_subscriptions')
      .insert([{
        organization_id: organizationId,
        agency_account_id: agencyAccountId,
        sub_account_id: subAccountId,
        event_type: eventType,
        webhook_url: webhookUrl
      }])
      .select()
      .single();
  }

  // Helper Methods
  async verifyApiKey(apiKey) {
    try {
      const response = await fetch(`${this.baseUrl}/agency`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async registerWebhookWithGHL(agencyAccountId, subAccountId, eventType, webhookUrl) {
    // Get the appropriate API key based on whether it's an agency or sub-account
    const apiKey = subAccountId 
      ? (await database.supabase
          .from('ghl_sub_accounts')
          .select('api_key')
          .eq('id', subAccountId)
          .single()).api_key
      : (await database.supabase
          .from('ghl_agency_accounts')
          .select('api_key')
          .eq('id', agencyAccountId)
          .single()).api_key;

    try {
      const response = await fetch(`${this.baseUrl}/webhooks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event: eventType,
          url: webhookUrl
        })
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // GHL API Methods
  async makeGHLRequest(apiKey, endpoint, method = 'GET', body = null) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      throw new Error(`GoHighLevel API error: ${response.statusText}`);
    }

    return await response.json();
  }
}

export const ghlService = new GHLService(); 