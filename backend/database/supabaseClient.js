import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions for common operations
export const database = {
  // User operations
  users: {
    async create(userData) {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async getById(id) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },

    async update(id, updates) {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  // Organization operations
  organizations: {
    async create(orgData) {
      const { data, error } = await supabase
        .from('organizations')
        .insert([orgData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async getById(id) {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },

    async getMembers(orgId) {
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          *,
          users:user_id (*)
        `)
        .eq('organization_id', orgId);
      
      if (error) throw error;
      return data;
    }
  },

  // Workflow operations
  workflows: {
    async create(workflowData) {
      const { data, error } = await supabase
        .from('workflows')
        .insert([workflowData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async getByOrganization(orgId) {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('organization_id', orgId);
      
      if (error) throw error;
      return data;
    },

    async update(id, updates) {
      const { data, error } = await supabase
        .from('workflows')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  // App operations
  apps: {
    async getAll() {
      const { data, error } = await supabase
        .from('available_apps')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },

    async getConfigurations(orgId) {
      const { data, error } = await supabase
        .from('app_configurations')
        .select(`
          *,
          app:app_id (*)
        `)
        .eq('organization_id', orgId)
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    }
  },

  // Payment operations
  payments: {
    async getMethods(orgId) {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('organization_id', orgId);
      
      if (error) throw error;
      return data;
    },

    async getSubscription(orgId) {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('organization_id', orgId)
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  // Admin operations
  admin: {
    async getSettings() {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*');
      
      if (error) throw error;
      return data;
    },

    async updateSetting(key, value) {
      const { data, error } = await supabase
        .from('admin_settings')
        .update({ value })
        .eq('key', key)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  }
}; 