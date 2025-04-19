const INSTANTLY_ACTIONS = {
  'Instantly.ai': [
    {
      name: 'Create Lead',
      description: 'Create a new lead in Instantly.ai',
      type: 'action',
      fields: ['email', 'firstName', 'lastName', 'companyName', 'website', 'phone', 'personalization'],
      tool: 'instantly',
      endpoint: '/api/v2/leads',
      method: 'POST'
    },
    {
      name: 'Update Lead',
      description: 'Update an existing lead',
      type: 'action',
      fields: ['id', 'updateFields'],
      tool: 'instantly',
      endpoint: '/api/v2/leads/{id}',
      method: 'PATCH'
    },
    {
      name: 'Add Lead to List',
      description: 'Add a lead to a specific list',
      type: 'action',
      fields: ['id', 'listId'],
      tool: 'instantly',
      endpoint: '/api/v2/leads/{id}',
      method: 'PATCH'
    },
    {
      name: 'Add Lead to Campaign',
      description: 'Add a lead to a campaign',
      type: 'action',
      fields: ['id', 'campaignId'],
      tool: 'instantly',
      endpoint: '/api/v2/leads/{id}',
      method: 'PATCH'
    },
    {
      name: 'Add Custom Tag',
      description: 'Add a custom tag to a lead',
      type: 'action',
      fields: ['id', 'tagId'],
      tool: 'instantly',
      endpoint: '/api/v2/custom-tags/toggle-resource',
      method: 'POST'
    },
    {
      name: 'Add Lead Label',
      description: 'Add a label to a lead',
      type: 'action',
      fields: ['id', 'labelId'],
      tool: 'instantly',
      endpoint: '/api/v2/lead-labels/{id}',
      method: 'POST'
    },
    {
      name: 'Pause Campaign',
      description: 'Pause a running campaign',
      type: 'action',
      fields: ['id'],
      tool: 'instantly',
      endpoint: '/api/v2/campaigns/{id}/pause',
      method: 'POST'
    },
    {
      name: 'Resume Campaign',
      description: 'Resume a paused campaign',
      type: 'action',
      fields: ['id'],
      tool: 'instantly',
      endpoint: '/api/v2/campaigns/{id}/activate',
      method: 'POST'
    }
  ]
};

const INSTANTLY_TRIGGERS = {
  'Instantly.ai': [
    {
      name: 'New Lead',
      description: 'Triggers when a new lead is created',
      type: 'trigger',
      fields: ['listId'],
      tool: 'instantly',
      webhookEvent: 'lead.created'
    },
    {
      name: 'Lead Updated',
      description: 'Triggers when a lead is updated',
      type: 'trigger',
      fields: ['id'],
      tool: 'instantly',
      webhookEvent: 'lead.updated'
    },
    {
      name: 'Email Opened',
      description: 'Triggers when an email is opened',
      type: 'trigger',
      fields: ['campaignId'],
      tool: 'instantly',
      webhookEvent: 'email.opened'
    },
    {
      name: 'Email Replied',
      description: 'Triggers when an email receives a reply',
      type: 'trigger',
      fields: ['campaignId'],
      tool: 'instantly',
      webhookEvent: 'email.replied'
    },
    {
      name: 'Email Clicked',
      description: 'Triggers when an email link is clicked',
      type: 'trigger',
      fields: ['campaignId'],
      tool: 'instantly',
      webhookEvent: 'email.clicked'
    }
  ]
};

module.exports = {
  INSTANTLY_ACTIONS,
  INSTANTLY_TRIGGERS
}; 