// Workflow Configuration Structure
export const workflowConfig = {
  // Workflow metadata
  metadata: {
    name: '',
    description: '',
    version: '1.0.0',
    author: '',
  },
  
  // Trigger configuration
  trigger: {
    type: '', // e.g., 'webhook', 'schedule', 'manual'
    config: {}, // Trigger-specific configuration
  },
  
  // Actions configuration
  actions: [
    {
      id: '',
      name: '',
      type: '', // e.g., 'http', 'database', 'custom'
      config: {}, // Action-specific configuration
      next: [], // Array of next action IDs
    }
  ],
  
  // Variables and state management
  variables: {
    global: {}, // Global variables accessible across actions
    local: {}, // Local variables for specific actions
  },
  
  // Error handling
  errorHandling: {
    retryCount: 3,
    retryDelay: 1000,
    fallbackAction: null,
  }
};

// Workflow execution state
export const workflowState = {
  status: 'idle', // 'idle', 'running', 'completed', 'error'
  currentAction: null,
  history: [],
  variables: {},
  errors: [],
}; 