const mongoose = require('mongoose');

const integrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  authType: {
    type: String,
    enum: ['oauth', 'api_key', 'api_key_secret', 'basic_auth', 'webhook', 'custom', 'bot_token'],
    required: true
  },
  fields: [{
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['text', 'password', 'number', 'email', 'url'],
      default: 'text'
    },
    required: {
      type: Boolean,
      default: true
    }
  }],
  oauthConfig: {
    clientId: String,
    clientSecret: String,
    authUrl: String,
    tokenUrl: String,
    scope: String,
    redirectUri: String
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

// Update the updatedAt timestamp on save
integrationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Integration = mongoose.model('Integration', integrationSchema);

module.exports = Integration; 