const express = require('express');
const router = express.Router();
const workflowService = require('../../services/ghl/workflowService');

// Get all workflows for an organization
router.get('/organizations/:organizationId/workflows', async (req, res) => {
  try {
    const workflows = await workflowService.getWorkflows(req.params.organizationId);
    res.json(workflows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new workflow
router.post('/organizations/:organizationId/workflows', async (req, res) => {
  try {
    const workflow = await workflowService.createWorkflow({
      ...req.body,
      organization_id: req.params.organizationId
    });
    res.status(201).json(workflow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a workflow
router.delete('/workflows/:id', async (req, res) => {
  try {
    await workflowService.deleteWorkflow(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available triggers
router.get('/triggers', async (req, res) => {
  try {
    const triggers = await workflowService.getTriggers();
    res.json(triggers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available actions
router.get('/actions', async (req, res) => {
  try {
    const actions = await workflowService.getActions();
    res.json(actions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 