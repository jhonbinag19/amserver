const db = require('../../database/models');
const { Workflow, Trigger, Action } = db;

const TRIGGERS = [
  {
    id: 'new_contact',
    name: 'New Contact Created',
    fields: [
      {
        id: 'source',
        label: 'Source',
        type: 'select',
        required: true,
        options: [
          { value: 'all', label: 'All Sources' },
          { value: 'web', label: 'Web Form' },
          { value: 'api', label: 'API' },
          { value: 'manual', label: 'Manual Entry' }
        ]
      }
    ]
  },
  {
    id: 'contact_updated',
    name: 'Contact Updated',
    fields: [
      {
        id: 'fields',
        label: 'Fields to Monitor',
        type: 'select',
        required: true,
        options: [
          { value: 'all', label: 'All Fields' },
          { value: 'email', label: 'Email' },
          { value: 'phone', label: 'Phone' },
          { value: 'status', label: 'Status' }
        ]
      }
    ]
  },
  {
    id: 'payment_received',
    name: 'Payment Received',
    fields: [
      {
        id: 'amount',
        label: 'Minimum Amount',
        type: 'input',
        required: false
      }
    ]
  }
];

const ACTIONS = [
  {
    id: 'send_email',
    name: 'Send Email',
    fields: [
      {
        id: 'template',
        label: 'Email Template',
        type: 'select',
        required: true,
        options: [
          { value: 'welcome', label: 'Welcome Email' },
          { value: 'payment', label: 'Payment Confirmation' },
          { value: 'update', label: 'Update Notification' }
        ]
      },
      {
        id: 'recipient',
        label: 'Recipient',
        type: 'select',
        required: true,
        options: [
          { value: 'contact', label: 'Contact' },
          { value: 'admin', label: 'Admin' },
          { value: 'both', label: 'Both' }
        ]
      }
    ]
  },
  {
    id: 'create_task',
    name: 'Create Task',
    fields: [
      {
        id: 'title',
        label: 'Task Title',
        type: 'input',
        required: true
      },
      {
        id: 'priority',
        label: 'Priority',
        type: 'select',
        required: true,
        options: [
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' }
        ]
      }
    ]
  },
  {
    id: 'update_contact',
    name: 'Update Contact',
    fields: [
      {
        id: 'field',
        label: 'Field to Update',
        type: 'select',
        required: true,
        options: [
          { value: 'status', label: 'Status' },
          { value: 'tags', label: 'Tags' },
          { value: 'notes', label: 'Notes' }
        ]
      },
      {
        id: 'value',
        label: 'New Value',
        type: 'input',
        required: true
      }
    ]
  }
];

const workflowService = {
  async getWorkflows(organizationId) {
    return await Workflow.findAll({
      where: { organization_id: organizationId },
      include: [
        { model: Trigger, as: 'trigger' },
        { model: Action, as: 'action' }
      ]
    });
  },

  async createWorkflow(data) {
    return await Workflow.create(data);
  },

  async deleteWorkflow(id) {
    return await Workflow.destroy({ where: { id } });
  },

  getTriggers() {
    return TRIGGERS;
  },

  getActions() {
    return ACTIONS;
  }
};

module.exports = workflowService; 