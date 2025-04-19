const mongoose = require('mongoose');

const workflowActionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Email Marketing', 'Customer Management', 'Card Actions', 'Notifications']
  },
  description: {
    type: String
  },
  enabled: {
    type: Boolean,
    default: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  integrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Integration',
    required: true
  },
  fields: [{
    name: String,
    label: String,
    type: {
      type: String,
      enum: ['text', 'number', 'select', 'boolean', 'date']
    },
    required: Boolean,
    options: [String], // For select type fields
    defaultValue: mongoose.Schema.Types.Mixed
  }],
  endpoint: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
workflowActionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const WorkflowAction = mongoose.model('WorkflowAction', workflowActionSchema);

module.exports = WorkflowAction; 