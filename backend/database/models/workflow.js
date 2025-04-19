const mongoose = require('mongoose');

const workflowSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  trigger: {
    type: {
      type: String,
      enum: ['webhook', 'schedule', 'event'],
      required: true
    },
    config: {
      schedule: String, // Cron expression for schedule triggers
      webhookUrl: String, // Generated webhook URL
      event: String, // Event name for event triggers
    }
  },
  source: {
    integration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Integration',
      required: true
    },
    config: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  },
  target: {
    integration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Integration',
      required: true
    },
    config: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  },
  transformations: [{
    field: String,
    type: String,
    value: mongoose.Schema.Types.Mixed
  }],
  conditions: [{
    field: String,
    operator: String,
    value: mongoose.Schema.Types.Mixed
  }],
  active: {
    type: Boolean,
    default: true
  },
  lastRun: {
    type: Date
  },
  lastStatus: {
    type: String,
    enum: ['success', 'error', 'pending', null],
    default: null
  },
  errorCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Update the updatedAt timestamp on save
workflowSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate webhook URL if trigger type is webhook
workflowSchema.pre('save', function(next) {
  if (this.trigger.type === 'webhook' && !this.trigger.config.webhookUrl) {
    this.trigger.config.webhookUrl = `/api/workflows/webhook/${this._id}`;
  }
  next();
});

const Workflow = mongoose.model('Workflow', workflowSchema);

module.exports = Workflow; 