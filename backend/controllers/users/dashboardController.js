const supabase = require('../../config/supabase');

const dashboardController = {
  // Get dashboard statistics
  getStats: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('dashboard_stats')
        .select('*')
        .eq('organization_id', req.user.organization_id)
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get recent activity
  getRecentActivity: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('organization_id', req.user.organization_id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get integration statistics
  getIntegrationStats: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('integration_stats')
        .select('*')
        .eq('organization_id', req.user.organization_id)
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get billing statistics
  getBillingStats: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('billing_stats')
        .select('*')
        .eq('organization_id', req.user.organization_id)
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = dashboardController; 