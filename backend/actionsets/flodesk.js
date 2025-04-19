const FLODESK_ACTIONS = {
  'Flodesk': [
    {
      name: 'Add Subscriber',
      description: 'Add a new subscriber to a Flodesk list',
      type: 'action',
      fields: ['email', 'firstName', 'lastName', 'listId'],
      tool: 'flodesk',
      endpoint: '/v1/subscribers',
      method: 'POST'
    },
    {
      name: 'Update Subscriber',
      description: 'Update subscriber information',
      type: 'action',
      fields: ['email', 'updateFields'],
      tool: 'flodesk',
      endpoint: '/v1/subscribers/{email}',
      method: 'PUT'
    },
    {
      name: 'Remove Subscriber',
      description: 'Remove a subscriber from a list',
      type: 'action',
      fields: ['email', 'listId'],
      tool: 'flodesk',
      endpoint: '/v1/subscribers/{email}/segments',
      method: 'DELETE'
    },
    {
      name: 'Add to Segment',
      description: 'Add a subscriber to a segment',
      type: 'action',
      fields: ['email', 'segmentId'],
      tool: 'flodesk',
      endpoint: '/v1/subscribers/{email}/segments',
      method: 'POST'
    },
    {
      name: 'Remove from Segment',
      description: 'Remove a subscriber from a segment',
      type: 'action',
      fields: ['email', 'segmentId'],
      tool: 'flodesk',
      endpoint: '/v1/subscribers/{email}/segments',
      method: 'DELETE'
    }
  ]
};

const FLODESK_TRIGGERS = {
  'Flodesk': [
    {
      name: 'New Subscriber',
      description: 'Triggers when a new subscriber is added',
      type: 'trigger',
      fields: ['listId'],
      tool: 'flodesk',
      webhookEvent: 'subscriber.created'
    },
    {
      name: 'Subscriber Added to Segment',
      description: 'Triggers when a subscriber is added to a segment',
      type: 'trigger',
      fields: ['segmentId'],
      tool: 'flodesk',
      webhookEvent: 'subscriber.added_to_segment'
    },
    {
      name: 'Subscriber Unsubscribed',
      description: 'Triggers when a subscriber unsubscribes',
      type: 'trigger',
      fields: [],
      tool: 'flodesk',
      webhookEvent: 'subscriber.unsubscribed'
    }
  ]
};

module.exports = {
  FLODESK_ACTIONS,
  FLODESK_TRIGGERS
}; 