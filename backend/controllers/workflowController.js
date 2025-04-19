const workflowService = require('../services/workflowService');

class WorkflowController {
  // Get all workflows for an organization
  async getOrganizationWorkflows(req, res) {
    try {
      const workflows = await workflowService.getOrganizationWorkflows(req.params.organizationId);
      res.json(workflows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get workflow by ID
  async getWorkflowById(req, res) {
    try {
      const workflow = await workflowService.getWorkflowById(req.params.id);
      if (!workflow) {
        return res.status(404).json({ error: 'Workflow not found' });
      }
      res.json(workflow);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Create a new workflow
  async createWorkflow(req, res) {
    try {
      const workflowData = {
        ...req.body,
        organizationId: req.params.organizationId,
        createdBy: req.user.id
      };
      const workflow = await workflowService.createWorkflow(workflowData);
      res.status(201).json(workflow);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update a workflow
  async updateWorkflow(req, res) {
    try {
      const workflow = await workflowService.updateWorkflow(req.params.id, req.body);
      if (!workflow) {
        return res.status(404).json({ error: 'Workflow not found' });
      }
      res.json(workflow);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete a workflow
  async deleteWorkflow(req, res) {
    try {
      await workflowService.deleteWorkflow(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Toggle workflow active status
  async toggleWorkflow(req, res) {
    try {
      const workflow = await workflowService.toggleWorkflow(req.params.id, req.body.active);
      res.json(workflow);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get workflow execution history
  async getWorkflowHistory(req, res) {
    try {
      const history = await workflowService.getWorkflowHistory(req.params.id);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Handle webhook trigger
  async handleWebhook(req, res) {
    try {
      const { workflowId } = req.params;
      const result = await workflowService.executeWorkflow(workflowId, {
        type: 'webhook',
        payload: req.body,
        headers: req.headers
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Execute workflow manually
  async executeWorkflow(req, res) {
    try {
      const { workflowId } = req.params;
      const result = await workflowService.executeWorkflow(workflowId, {
        type: 'manual',
        payload: req.body,
        user: req.user.id
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new WorkflowController(); 