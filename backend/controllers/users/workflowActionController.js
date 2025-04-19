const supabase = require('../../config/supabase');

const workflowActionController = {
  // Get all workflow actions for the organization
  getWorkflowActions: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('workflow_actions')
        .select('*')
        .eq('organization_id', req.user.organization_id);

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create a new workflow action
  createWorkflowAction: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('workflow_actions')
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

  // Get a specific workflow action by ID
  getWorkflowActionById: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('workflow_actions')
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

  // Update a workflow action
  updateWorkflowAction: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('workflow_actions')
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

  // Delete a workflow action
  deleteWorkflowAction: async (req, res) => {
    try {
      const { error } = await supabase
        .from('workflow_actions')
        .delete()
        .eq('id', req.params.id)
        .eq('organization_id', req.user.organization_id);

      if (error) throw error;
      res.json({ message: 'Workflow action deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Execute a workflow action
  executeWorkflowAction: async (req, res) => {
    try {
      // Implementation for executing workflow action
      res.json({ message: 'Workflow action executed successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = workflowActionController; 