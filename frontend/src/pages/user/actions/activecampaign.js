export const ACTIVECAMPAIGN_ACTIONS = {
  'ActiveCampaign': [
    {
      name: 'Create Contact',
      description: 'Create a new contact in ActiveCampaign',
      type: 'action',
      fields: ['email', 'firstName', 'lastName', 'phone', 'tags'],
      tool: 'activecampaign'
    },
    {
      name: 'Update Contact',
      description: 'Update an existing contact',
      type: 'action',
      fields: ['email', 'updateFields'],
      tool: 'activecampaign'
    },
    {
      name: 'Add Contact to List',
      description: 'Add a contact to a specific list',
      type: 'action',
      fields: ['email', 'listId'],
      tool: 'activecampaign'
    },
    {
      name: 'Add Contact to Automation',
      description: 'Add a contact to an automation',
      type: 'action',
      fields: ['email', 'automationId'],
      tool: 'activecampaign'
    },
    {
      name: 'Add Tag to Contact',
      description: 'Add a tag to a contact',
      type: 'action',
      fields: ['email', 'tag'],
      tool: 'activecampaign'
    }
  ]
};

export const ACTIVECAMPAIGN_TRIGGERS = {
  'ActiveCampaign': [
    {
      name: 'New Contact',
      description: 'Triggers when a new contact is created',
      type: 'trigger',
      fields: ['listId'],
      tool: 'activecampaign'
    },
    {
      name: 'Contact Tagged',
      description: 'Triggers when a contact is tagged',
      type: 'trigger',
      fields: ['tag'],
      tool: 'activecampaign'
    },
    {
      name: 'Automation Started',
      description: 'Triggers when an automation starts',
      type: 'trigger',
      fields: ['automationId'],
      tool: 'activecampaign'
    }
  ]
}; 