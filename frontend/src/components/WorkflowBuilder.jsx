import React, { useState } from 'react';
import { workflowConfig } from '../../backend/workflows/workflowConfig';

const WorkflowBuilder = () => {
  const [workflow, setWorkflow] = useState({ ...workflowConfig });
  const [selectedAction, setSelectedAction] = useState(null);

  const handleMetadataChange = (field, value) => {
    setWorkflow(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value
      }
    }));
  };

  const handleTriggerChange = (field, value) => {
    setWorkflow(prev => ({
      ...prev,
      trigger: {
        ...prev.trigger,
        [field]: value
      }
    }));
  };

  const handleActionChange = (actionId, field, value) => {
    setWorkflow(prev => ({
      ...prev,
      actions: prev.actions.map(action => 
        action.id === actionId 
          ? { ...action, [field]: value }
          : action
      )
    }));
  };

  const addAction = () => {
    const newAction = {
      id: `action-${Date.now()}`,
      name: 'New Action',
      type: '',
      config: {},
      next: []
    };
    
    setWorkflow(prev => ({
      ...prev,
      actions: [...prev.actions, newAction]
    }));
  };

  const removeAction = (actionId) => {
    setWorkflow(prev => ({
      ...prev,
      actions: prev.actions.filter(action => action.id !== actionId)
    }));
  };

  return (
    <div className="workflow-builder">
      <div className="workflow-metadata">
        <h2>Workflow Metadata</h2>
        <input
          type="text"
          placeholder="Workflow Name"
          value={workflow.metadata.name}
          onChange={(e) => handleMetadataChange('name', e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={workflow.metadata.description}
          onChange={(e) => handleMetadataChange('description', e.target.value)}
        />
      </div>

      <div className="workflow-trigger">
        <h2>Trigger</h2>
        <select
          value={workflow.trigger.type}
          onChange={(e) => handleTriggerChange('type', e.target.value)}
        >
          <option value="">Select Trigger Type</option>
          <option value="webhook">Webhook</option>
          <option value="schedule">Schedule</option>
          <option value="manual">Manual</option>
        </select>
      </div>

      <div className="workflow-actions">
        <h2>Actions</h2>
        <button onClick={addAction}>Add Action</button>
        
        {workflow.actions.map(action => (
          <div 
            key={action.id}
            className={`action ${selectedAction === action.id ? 'selected' : ''}`}
            onClick={() => setSelectedAction(action.id)}
          >
            <input
              type="text"
              value={action.name}
              onChange={(e) => handleActionChange(action.id, 'name', e.target.value)}
            />
            <select
              value={action.type}
              onChange={(e) => handleActionChange(action.id, 'type', e.target.value)}
            >
              <option value="">Select Action Type</option>
              <option value="http">HTTP Request</option>
              <option value="database">Database</option>
              <option value="custom">Custom</option>
            </select>
            <button onClick={() => removeAction(action.id)}>Remove</button>
          </div>
        ))}
      </div>

      {selectedAction && (
        <div className="action-config">
          <h3>Action Configuration</h3>
          {/* Add action-specific configuration UI here */}
        </div>
      )}
    </div>
  );
};

export default WorkflowBuilder; 