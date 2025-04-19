const mongoose = require('mongoose');

const integrationConnectionSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  integrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Integration',
    required: true
  },
  credentials: {
    type: Map,
    of: String
  },
  oauthTokens: {
    accessToken: String,
    refreshToken: String,
    expiresAt: Date
  },
  status: {
    type: String,
    enum: ['connected', 'disconnected', 'error'],
    default: 'disconnected'
  },
  lastSync: {
    type: Date
  },
  error: {
    message: String,
    code: String,
    timestamp: Date
  },
  isActive: {
    type: Boolean,
    default: true
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

// Compound index to ensure unique integration per organization
integrationConnectionSchema.index({ organizationId: 1, integrationId: 1 }, { unique: true });

// Update the updatedAt timestamp on save
integrationConnectionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const IntegrationConnection = mongoose.model('IntegrationConnection', integrationConnectionSchema);

module.exports = IntegrationConnection; 