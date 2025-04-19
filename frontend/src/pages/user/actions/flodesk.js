export const FLODESK_ACTIONS = {
  'Flodesk': [
    { 
      name: 'Add Subscriber',
      description: 'Add a new subscriber to a Flodesk list',
      type: 'action',
      fields: ['email', 'firstName', 'lastName', 'listId'],
      tool: 'flodesk'
    },
    { 
      name: 'Update Subscriber',
      description: 'Update subscriber information',
      type: 'action',
      fields: ['email', 'updateFields'],
      tool: 'flodesk'
    },
    { 
      name: 'Remove Subscriber',
      description: 'Remove a subscriber from a list',
      type: 'action',
      fields: ['email', 'listId'],
      tool: 'flodesk'
    },
    { 
      name: 'Add Tag',
      description: 'Add a tag to a subscriber',
      type: 'action',
      fields: ['email', 'tag'],
      tool: 'flodesk'
    },
    { 
      name: 'Remove Tag',
      description: 'Remove a tag from a subscriber',
      type: 'action',
      fields: ['email', 'tag'],
      tool: 'flodesk'
    }
  ]
};

export const FLODESK_TRIGGERS = {
  'Flodesk': [
    {
      name: 'New Subscriber',
      description: 'Triggers when a new subscriber is added',
      type: 'trigger',
      fields: ['listId'],
      tool: 'flodesk'
    },
    {
      name: 'Subscriber Tagged',
      description: 'Triggers when a subscriber is tagged',
      type: 'trigger',
      fields: ['tag'],
      tool: 'flodesk'
    }
  ]
}; 