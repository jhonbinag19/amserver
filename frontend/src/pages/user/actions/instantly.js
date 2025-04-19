export const INSTANTLY_ACTIONS = {
  'Instantly.ai': [
    {
      name: 'Send Email',
      description: 'Send an email through Instantly.ai',
      type: 'action',
      fields: ['to', 'subject', 'body', 'templateId'],
      tool: 'instantly'
    },
    {
      name: 'Add to Campaign',
      description: 'Add a contact to a campaign',
      type: 'action',
      fields: ['email', 'campaignId'],
      tool: 'instantly'
    },
    {
      name: 'Pause Campaign',
      description: 'Pause a running campaign',
      type: 'action',
      fields: ['campaignId'],
      tool: 'instantly'
    },
    {
      name: 'Resume Campaign',
      description: 'Resume a paused campaign',
      type: 'action',
      fields: ['campaignId'],
      tool: 'instantly'
    }
  ]
};

export const INSTANTLY_TRIGGERS = {
  'Instantly.ai': [
    {
      name: 'Email Sent',
      description: 'Triggers when an email is sent',
      type: 'trigger',
      fields: ['campaignId'],
      tool: 'instantly'
    },
    {
      name: 'Email Opened',
      description: 'Triggers when an email is opened',
      type: 'trigger',
      fields: ['campaignId'],
      tool: 'instantly'
    },
    {
      name: 'Email Replied',
      description: 'Triggers when an email receives a reply',
      type: 'trigger',
      fields: ['campaignId'],
      tool: 'instantly'
    }
  ]
}; 