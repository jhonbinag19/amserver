const mongoose = require('mongoose');
const Integration = require('../database/models/integration');
const dotenv = require('dotenv');

dotenv.config();

const integrations = [
  // CRM & Sales
  {
    name: 'gohighlevel',
    displayName: 'GoHighLevel',
    category: 'CRM & Sales',
    subcategory: 'CRM',
    authType: 'oauth',
    fields: [],
    oauthConfig: {
      clientId: process.env.GHL_CLIENT_ID,
      clientSecret: process.env.GHL_CLIENT_SECRET,
      authUrl: 'https://marketplace.gohighlevel.com/oauth/chooselocation',
      tokenUrl: 'https://services.leadconnectorhq.com/oauth/token',
      scope: 'contacts.readonly contacts.write',
      redirectUri: process.env.GHL_REDIRECT_URI
    }
  },
  {
    name: 'hubspot',
    displayName: 'HubSpot',
    category: 'CRM & Sales',
    subcategory: 'CRM',
    authType: 'oauth',
    fields: [],
    oauthConfig: {
      clientId: process.env.HUBSPOT_CLIENT_ID,
      clientSecret: process.env.HUBSPOT_CLIENT_SECRET,
      authUrl: 'https://app.hubspot.com/oauth/authorize',
      tokenUrl: 'https://api.hubapi.com/oauth/v1/token',
      scope: 'crm.objects.contacts.read crm.objects.contacts.write',
      redirectUri: process.env.HUBSPOT_REDIRECT_URI
    }
  },
  // Add more integrations here...
];

async function seedIntegrations() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing integrations
    await Integration.deleteMany({});
    console.log('Cleared existing integrations');

    // Insert new integrations
    await Integration.insertMany(integrations);
    console.log('Seeded integrations successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding integrations:', error);
    process.exit(1);
  }
}

seedIntegrations(); 