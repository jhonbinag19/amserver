const supabase = require('../../config/supabase');

const billingController = {
  // Get billing information for the authenticated user's organization
  getBillingInfo: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('billing')
        .select('*')
        .eq('organization_id', req.user.organization_id)
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update billing information
  updateBillingInfo: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('billing')
        .update(req.body)
        .eq('organization_id', req.user.organization_id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all invoices for the organization
  getInvoices: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('organization_id', req.user.organization_id);

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get a specific invoice by ID
  getInvoiceById: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
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

  // Get payment methods
  getPaymentMethods: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('organization_id', req.user.organization_id);

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Add a new payment method
  addPaymentMethod: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
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

  // Remove a payment method
  removePaymentMethod: async (req, res) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', req.params.id)
        .eq('organization_id', req.user.organization_id);

      if (error) throw error;
      res.json({ message: 'Payment method removed successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get subscription information
  getSubscription: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('organization_id', req.user.organization_id)
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update subscription
  updateSubscription: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update(req.body)
        .eq('organization_id', req.user.organization_id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cancel subscription
  cancelSubscription: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('organization_id', req.user.organization_id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Resume subscription
  resumeSubscription: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({ status: 'active' })
        .eq('organization_id', req.user.organization_id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = billingController; 