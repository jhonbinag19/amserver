const Workflow = require('../database/models/workflow');
const WorkflowHistory = require('../database/models/workflowHistory');
const Integration = require('../database/models/integration');
const integrationService = require('./integrationService');

class WorkflowService {
  // Get all workflows for an organization
  async getOrganizationWorkflows(organizationId) {
    return await Workflow.find({ organizationId, active: true })
      .populate('source.integration')
      .populate('target.integration')
      .sort('-createdAt');
  }

  // Get workflow by ID
  async getWorkflowById(id) {
    return await Workflow.findById(id)
      .populate('source.integration')
      .populate('target.integration');
  }

  // Create a new workflow
  async createWorkflow(workflowData) {
    const workflow = new Workflow(workflowData);
    return await workflow.save();
  }

  // Update an existing workflow
  async updateWorkflow(id, workflowData) {
    return await Workflow.findByIdAndUpdate(
      id,
      { $set: workflowData },
      { new: true }
    ).populate('source.integration')
     .populate('target.integration');
  }

  // Delete a workflow
  async deleteWorkflow(id) {
    return await Workflow.findByIdAndDelete(id);
  }

  // Toggle workflow active status
  async toggleWorkflow(id, active) {
    return await Workflow.findByIdAndUpdate(
      id,
      { $set: { active } },
      { new: true }
    );
  }

  // Get workflow execution history
  async getWorkflowHistory(workflowId, limit = 10) {
    return await WorkflowHistory.find({ workflowId })
      .sort('-timestamp')
      .limit(limit);
  }

  // Execute a workflow
  async executeWorkflow(workflowId, triggerData) {
    const startTime = Date.now();
    const workflow = await this.getWorkflowById(workflowId);
    
    if (!workflow || !workflow.active) {
      throw new Error('Workflow not found or inactive');
    }

    try {
      // Create history entry
      const history = new WorkflowHistory({
        workflowId: workflow._id,
        organizationId: workflow.organizationId,
        status: 'pending',
        trigger: {
          type: workflow.trigger.type,
          data: triggerData
        },
        timestamp: new Date()
      });

      // Get source data
      const sourceConnection = await integrationService.getOrganizationConnection(
        workflow.organizationId,
        workflow.source.integration._id
      );

      if (!sourceConnection) {
        throw new Error('Source integration not connected');
      }

      // Get target connection
      const targetConnection = await integrationService.getOrganizationConnection(
        workflow.organizationId,
        workflow.target.integration._id
      );

      if (!targetConnection) {
        throw new Error('Target integration not connected');
      }

      // Execute source operation
      const sourceData = await this.executeIntegrationOperation(
        workflow.source.integration,
        sourceConnection,
        workflow.source.config,
        triggerData
      );

      // Apply transformations
      const transformedData = await this.applyTransformations(
        sourceData,
        workflow.transformations
      );

      // Check conditions
      const conditionsMet = await this.checkConditions(
        transformedData,
        workflow.conditions
      );

      if (!conditionsMet) {
        throw new Error('Workflow conditions not met');
      }

      // Execute target operation
      const targetData = await this.executeIntegrationOperation(
        workflow.target.integration,
        targetConnection,
        workflow.target.config,
        transformedData
      );

      // Update history with success
      history.status = 'success';
      history.sourceData = sourceData;
      history.targetData = targetData;
      history.duration = Date.now() - startTime;
      await history.save();

      // Update workflow status
      await Workflow.findByIdAndUpdate(workflowId, {
        $set: {
          lastRun: new Date(),
          lastStatus: 'success',
          errorCount: 0
        }
      });

      return { success: true, data: targetData };
    } catch (error) {
      // Update history with error
      const history = new WorkflowHistory({
        workflowId: workflow._id,
        organizationId: workflow.organizationId,
        status: 'error',
        error: {
          message: error.message,
          code: error.code,
          stack: error.stack
        },
        duration: Date.now() - startTime,
        timestamp: new Date()
      });
      await history.save();

      // Update workflow status
      await Workflow.findByIdAndUpdate(workflowId, {
        $set: {
          lastRun: new Date(),
          lastStatus: 'error'
        },
        $inc: { errorCount: 1 }
      });

      throw error;
    }
  }

  // Execute integration operation
  async executeIntegrationOperation(integration, connection, config, data) {
    // This is a placeholder for the actual integration operation
    // You would implement specific logic for each integration type
    switch (integration.name) {
      case 'gohighlevel':
        return await this.executeGHLOperation(connection, config, data);
      case 'hubspot':
        return await this.executeHubSpotOperation(connection, config, data);
      // Add more integration handlers
      default:
        throw new Error(`Unsupported integration: ${integration.name}`);
    }
  }

  // Apply data transformations
  async applyTransformations(data, transformations) {
    if (!transformations || transformations.length === 0) {
      return data;
    }

    let transformedData = { ...data };

    for (const transformation of transformations) {
      const { field, type, value } = transformation;

      switch (type) {
        case 'map':
          transformedData[field] = value[data[field]] || data[field];
          break;
        case 'template':
          transformedData[field] = this.interpolateTemplate(value, data);
          break;
        case 'concat':
          transformedData[field] = this.concatenateFields(value, data);
          break;
        case 'split':
          transformedData[field] = data[field] ? data[field].split(value) : [];
          break;
        case 'format':
          transformedData[field] = this.formatField(data[field], value);
          break;
        default:
          throw new Error(`Unsupported transformation type: ${type}`);
      }
    }

    return transformedData;
  }

  // Check workflow conditions
  async checkConditions(data, conditions) {
    if (!conditions || conditions.length === 0) {
      return true;
    }

    for (const condition of conditions) {
      const { field, operator, value } = condition;
      const fieldValue = data[field];

      switch (operator) {
        case 'equals':
          if (fieldValue !== value) return false;
          break;
        case 'notEquals':
          if (fieldValue === value) return false;
          break;
        case 'contains':
          if (!fieldValue || !fieldValue.includes(value)) return false;
          break;
        case 'notContains':
          if (fieldValue && fieldValue.includes(value)) return false;
          break;
        case 'greaterThan':
          if (fieldValue <= value) return false;
          break;
        case 'lessThan':
          if (fieldValue >= value) return false;
          break;
        case 'exists':
          if (fieldValue === undefined) return false;
          break;
        case 'notExists':
          if (fieldValue !== undefined) return false;
          break;
        default:
          throw new Error(`Unsupported condition operator: ${operator}`);
      }
    }

    return true;
  }

  // Helper: Interpolate template string
  interpolateTemplate(template, data) {
    return template.replace(/\${(.*?)}/g, (match, key) => {
      return data[key] || match;
    });
  }

  // Helper: Concatenate fields
  concatenateFields(fields, data) {
    return fields.map(field => data[field] || '').join(' ').trim();
  }

  // Helper: Format field
  formatField(value, format) {
    if (!value) return value;

    switch (format) {
      case 'uppercase':
        return value.toUpperCase();
      case 'lowercase':
        return value.toLowerCase();
      case 'capitalize':
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      case 'trim':
        return value.trim();
      default:
        return value;
    }
  }
}

module.exports = new WorkflowService(); 