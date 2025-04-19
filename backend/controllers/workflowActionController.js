const WorkflowAction = require('../models/workflowAction');

class WorkflowActionController {
  // Get all workflow actions
  async getActions(req, res) {
    try {
      const actions = await WorkflowAction.find({ userId: req.user.id });
      res.json(actions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch workflow actions' });
    }
  }

  // Add a new workflow action
  async addAction(req, res) {
    try {
      const { name, category, description, enabled } = req.body;
      
      // Check if action already exists
      const existingAction = await WorkflowAction.findOne({ 
        name, 
        userId: req.user.id 
      });

      if (existingAction) {
        return res.status(400).json({ error: 'Action already exists' });
      }

      const action = new WorkflowAction({
        name,
        category,
        description,
        enabled,
        userId: req.user.id,
        integrationId: req.body.integrationId
      });

      await action.save();
      res.status(201).json(action);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add workflow action' });
    }
  }

  // Update a workflow action
  async updateAction(req, res) {
    try {
      const { id } = req.params;
      const { name, category, description, enabled } = req.body;

      const action = await WorkflowAction.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        { name, category, description, enabled },
        { new: true }
      );

      if (!action) {
        return res.status(404).json({ error: 'Action not found' });
      }

      res.json(action);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update workflow action' });
    }
  }

  // Delete a workflow action
  async deleteAction(req, res) {
    try {
      const { id } = req.params;
      const action = await WorkflowAction.findOneAndDelete({
        _id: id,
        userId: req.user.id
      });

      if (!action) {
        return res.status(404).json({ error: 'Action not found' });
      }

      res.json({ message: 'Action deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete workflow action' });
    }
  }

  // Get actions by integration
  async getActionsByIntegration(req, res) {
    try {
      const { integrationId } = req.params;
      const actions = await WorkflowAction.find({
        userId: req.user.id,
        integrationId,
        enabled: true
      });

      res.json(actions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch integration actions' });
    }
  }

  // Sync actions with GHL
  async syncActionsWithGHL(req, res) {
    try {
      const { ghlService } = req.app.locals;
      const actions = await WorkflowAction.find({
        userId: req.user.id,
        enabled: true
      });

      // Format actions for GHL
      const ghlActions = actions.map(action => ({
        name: action.name,
        key: action._id.toString(),
        description: action.description,
        category: action.category,
        fields: action.fields || [],
        endpoint: `${process.env.API_URL}/api/workflow/execute/${action._id}`
      }));

      // Register actions with GHL
      await ghlService.registerCustomActions(ghlActions);

      res.json({ message: 'Actions synced with GHL successfully' });
    } catch (error) {
      console.error('Failed to sync actions with GHL:', error);
      res.status(500).json({ error: 'Failed to sync actions with GHL' });
    }
  }
}

module.exports = new WorkflowActionController(); 