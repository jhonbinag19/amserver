const mongoose = require('mongoose');

const workflowHistorySchema = new mongoose.Schema({
  workflowId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workflow',
    required: true
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'error', 'pending'],
    required: true
  },
  trigger: {
    type: {
      type: String,
      required: true
    },
    data: mongoose.Schema.Types.Mixed
  },
  sourceData: mongoose.Schema.Types.Mixed,
  targetData: mongoose.Schema.Types.Mixed,
  transformations: [{
    field: String,
    type: String,
    originalValue: mongoose.Schema.Types.Mixed,
    transformedValue: mongoose.Schema.Types.Mixed
  }],
  error: {
    message: String,
    code: String,
    stack: String
  },
  duration: {
    type: Number, // Duration in milliseconds
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
workflowHistorySchema.index({ workflowId: 1, timestamp: -1 });
workflowHistorySchema.index({ organizationId: 1, timestamp: -1 });

const WorkflowHistory = mongoose.model('WorkflowHistory', workflowHistorySchema);

module.exports = WorkflowHistory; 