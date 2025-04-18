'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const subscriptionTypes = [
      {
        name: 'Basic',
        description: 'Basic subscription plan with essential features',
        price: 29.99,
        billingCycle: 'monthly',
        features: {
          maxUsers: 1,
          storage: '5GB',
          support: 'Email only',
          integrations: ['Basic API access']
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Professional',
        description: 'Professional plan with advanced features and priority support',
        price: 79.99,
        billingCycle: 'monthly',
        features: {
          maxUsers: 5,
          storage: '50GB',
          support: 'Priority email and chat',
          integrations: ['Full API access', 'Custom integrations']
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Enterprise',
        description: 'Enterprise plan with unlimited features and dedicated support',
        price: 199.99,
        billingCycle: 'monthly',
        features: {
          maxUsers: 'Unlimited',
          storage: 'Unlimited',
          support: '24/7 dedicated support',
          integrations: ['Full API access', 'Custom integrations', 'Dedicated integration support']
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Basic Annual',
        description: 'Basic plan with annual billing and 2 months free',
        price: 299.99,
        billingCycle: 'yearly',
        features: {
          maxUsers: 1,
          storage: '5GB',
          support: 'Email only',
          integrations: ['Basic API access']
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Professional Annual',
        description: 'Professional plan with annual billing and 2 months free',
        price: 799.99,
        billingCycle: 'yearly',
        features: {
          maxUsers: 5,
          storage: '50GB',
          support: 'Priority email and chat',
          integrations: ['Full API access', 'Custom integrations']
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('subscription_types', subscriptionTypes, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('subscription_types', null, {});
  }
}; 