const CONVERTKIT_ACTIONS = {
  'ConvertKit': [
    {
      name: 'Create Subscriber',
      description: 'Create a new subscriber in ConvertKit',
      type: 'action',
      fields: ['email', 'firstName', 'lastName', 'tags'],
      tool: 'convertkit',
      endpoint: '/v4/subscribers',
      method: 'POST'
    },
    {
      name: 'Update Subscriber',
      description: 'Update an existing subscriber',
      type: 'action',
      fields: ['id', 'updateFields'],
      tool: 'convertkit',
      endpoint: '/v4/subscribers/{id}',
      method: 'PUT'
    },
    {
      name: 'Add Subscriber to Form',
      description: 'Add a subscriber to a form',
      type: 'action',
      fields: ['email', 'formId'],
      tool: 'convertkit',
      endpoint: '/v4/forms/{formId}/subscribe',
      method: 'POST'
    },
    {
      name: 'Add Subscriber to Sequence',
      description: 'Add a subscriber to a sequence',
      type: 'action',
      fields: ['email', 'sequenceId'],
      tool: 'convertkit',
      endpoint: '/v4/sequences/{sequenceId}/subscribe',
      method: 'POST'
    },
    {
      name: 'Add Tag to Subscriber',
      description: 'Add a tag to a subscriber',
      type: 'action',
      fields: ['email', 'tagId'],
      tool: 'convertkit',
      endpoint: '/v4/tags/{tagId}/subscribe',
      method: 'POST'
    },
    {
      name: 'Remove Tag from Subscriber',
      description: 'Remove a tag from a subscriber',
      type: 'action',
      fields: ['email', 'tagId'],
      tool: 'convertkit',
      endpoint: '/v4/subscribers/{email}/tags/{tagId}',
      method: 'DELETE'
    },
    {
      name: 'Create Custom Field',
      description: 'Create a new custom field',
      type: 'action',
      fields: ['label', 'key'],
      tool: 'convertkit',
      endpoint: '/v4/custom_fields',
      method: 'POST'
    },
    {
      name: 'Create Broadcast',
      description: 'Create and send a broadcast',
      type: 'action',
      fields: ['subject', 'content', 'templateId', 'segmentId'],
      tool: 'convertkit',
      endpoint: '/v4/broadcasts',
      method: 'POST'
    },
    {
      name: 'Create Purchase',
      description: 'Create a purchase record',
      type: 'action',
      fields: ['email', 'productName', 'amount', 'currency'],
      tool: 'convertkit',
      endpoint: '/v4/purchases',
      method: 'POST'
    }
  ]
};

const CONVERTKIT_TRIGGERS = {
  'ConvertKit': [
    {
      name: 'New Subscriber',
      description: 'Triggers when a new subscriber is created',
      type: 'trigger',
      fields: [],
      tool: 'convertkit',
      webhookEvent: 'subscriber.subscriber_activate'
    },
    {
      name: 'Subscriber Unsubscribed',
      description: 'Triggers when a subscriber unsubscribes',
      type: 'trigger',
      fields: [],
      tool: 'convertkit',
      webhookEvent: 'subscriber.subscriber_unsubscribe'
    },
    {
      name: 'Form Subscribe',
      description: 'Triggers when someone subscribes to a form',
      type: 'trigger',
      fields: ['formId'],
      tool: 'convertkit',
      webhookEvent: 'subscriber.form_subscribe'
    },
    {
      name: 'Tag Added',
      description: 'Triggers when a tag is added to a subscriber',
      type: 'trigger',
      fields: ['tagId'],
      tool: 'convertkit',
      webhookEvent: 'subscriber.tag_add'
    },
    {
      name: 'Tag Removed',
      description: 'Triggers when a tag is removed from a subscriber',
      type: 'trigger',
      fields: ['tagId'],
      tool: 'convertkit',
      webhookEvent: 'subscriber.tag_remove'
    },
    {
      name: 'Course Subscribe',
      description: 'Triggers when someone subscribes to a course',
      type: 'trigger',
      fields: ['sequenceId'],
      tool: 'convertkit',
      webhookEvent: 'subscriber.course_subscribe'
    },
    {
      name: 'Course Complete',
      description: 'Triggers when someone completes a course',
      type: 'trigger',
      fields: ['sequenceId'],
      tool: 'convertkit',
      webhookEvent: 'subscriber.course_complete'
    },
    {
      name: 'Link Clicked',
      description: 'Triggers when a link is clicked',
      type: 'trigger',
      fields: ['initiatorValue'],
      tool: 'convertkit',
      webhookEvent: 'subscriber.link_click'
    },
    {
      name: 'Product Purchase',
      description: 'Triggers when a product is purchased',
      type: 'trigger',
      fields: ['productId'],
      tool: 'convertkit',
      webhookEvent: 'subscriber.product_purchase'
    },
    {
      name: 'Purchase Created',
      description: 'Triggers when a purchase is created',
      type: 'trigger',
      fields: [],
      tool: 'convertkit',
      webhookEvent: 'purchase.purchase_create'
    }
  ]
};

module.exports = {
  CONVERTKIT_ACTIONS,
  CONVERTKIT_TRIGGERS
}; 