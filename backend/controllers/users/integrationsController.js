const supabase = require('../../config/supabase');

const integrationsController = {
  // Get all integrations for the organization
  getIntegrations: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('organization_id', req.user.organization_id);

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create a new integration
  createIntegration: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .insert({
          ...req.body,
          organization_id: req.user.organization_id
        })
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get a specific integration by ID
  getIntegrationById: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('id', req.params.id)
        .eq('organization_id', req.user.organization_id)
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update an integration
  updateIntegration: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .update(req.body)
        .eq('id', req.params.id)
        .eq('organization_id', req.user.organization_id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete an integration
  deleteIntegration: async (req, res) => {
    try {
      const { error } = await supabase
        .from('integrations')
        .delete()
        .eq('id', req.params.id)
        .eq('organization_id', req.user.organization_id);

      if (error) throw error;
      res.json({ message: 'Integration deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Sync integration data
  syncIntegration: async (req, res) => {
    try {
      // Implementation for syncing integration data
      res.json({ message: 'Integration synced successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get integration status
  getIntegrationStatus: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('status')
        .eq('id', req.params.id)
        .eq('organization_id', req.user.organization_id)
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get webhooks for an integration
  getWebhooks: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('webhooks')
        .select('*')
        .eq('integration_id', req.params.id)
        .eq('organization_id', req.user.organization_id);

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create a webhook
  createWebhook: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('webhooks')
        .insert({
          ...req.body,
          integration_id: req.params.id,
          organization_id: req.user.organization_id
        })
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete a webhook
  deleteWebhook: async (req, res) => {
    try {
      const { error } = await supabase
        .from('webhooks')
        .delete()
        .eq('id', req.params.webhookId)
        .eq('integration_id', req.params.id)
        .eq('organization_id', req.user.organization_id);

      if (error) throw error;
      res.json({ message: 'Webhook deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = integrationsController; 