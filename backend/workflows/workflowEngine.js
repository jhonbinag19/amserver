import { workflowConfig, workflowState } from './workflowConfig';

export class WorkflowEngine {
  constructor(config) {
    this.config = { ...workflowConfig, ...config };
    this.state = { ...workflowState };
    this.actions = new Map();
  }

  // Register an action handler
  registerAction(type, handler) {
    this.actions.set(type, handler);
  }

  // Start workflow execution
  async start(initialData = {}) {
    this.state.status = 'running';
    this.state.variables = { ...initialData };
    
    try {
      await this.executeTrigger();
      await this.executeActions();
      this.state.status = 'completed';
    } catch (error) {
      this.state.status = 'error';
      this.state.errors.push(error);
      await this.handleError(error);
    }
  }

  // Execute the workflow trigger
  async executeTrigger() {
    const { trigger } = this.config;
    // Implement trigger execution logic
    return Promise.resolve();
  }

  // Execute all actions in sequence
  async executeActions() {
    const { actions } = this.config;
    
    for (const action of actions) {
      this.state.currentAction = action.id;
      await this.executeAction(action);
    }
  }

  // Execute a single action
  async executeAction(action) {
    const handler = this.actions.get(action.type);
    if (!handler) {
      throw new Error(`No handler registered for action type: ${action.type}`);
    }

    try {
      const result = await handler(action.config, this.state.variables);
      this.state.history.push({
        actionId: action.id,
        timestamp: new Date(),
        result
      });
      
      // Update variables with action result
      this.state.variables = {
        ...this.state.variables,
        ...result
      };
    } catch (error) {
      throw new Error(`Action ${action.id} failed: ${error.message}`);
    }
  }

  // Handle errors according to configuration
  async handleError(error) {
    const { errorHandling } = this.config;
    
    if (errorHandling.fallbackAction) {
      const fallbackAction = this.config.actions.find(
        a => a.id === errorHandling.fallbackAction
      );
      if (fallbackAction) {
        await this.executeAction(fallbackAction);
      }
    }
  }

  // Get current workflow state
  getState() {
    return { ...this.state };
  }

  // Reset workflow state
  reset() {
    this.state = { ...workflowState };
  }
} 