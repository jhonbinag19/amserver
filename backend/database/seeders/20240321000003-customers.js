'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get subscription type IDs
    const subscriptionTypes = await queryInterface.sequelize.query(
      'SELECT id, name FROM subscription_types',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const subscriptionTypeMap = {};
    subscriptionTypes.forEach(type => {
      subscriptionTypeMap[type.name] = type.id;
    });

    // Create sample customers
    const customers = [
      {
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '+1-555-123-4567',
        subscriptionTypeId: subscriptionTypeMap['Professional'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'TechStart Inc',
        email: 'info@techstart.com',
        phone: '+1-555-987-6543',
        subscriptionTypeId: subscriptionTypeMap['Enterprise'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Small Business Solutions',
        email: 'support@sbs.com',
        phone: '+1-555-456-7890',
        subscriptionTypeId: subscriptionTypeMap['Basic'],
        status: 'trial',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Global Enterprises',
        email: 'contact@globalent.com',
        phone: '+1-555-789-0123',
        subscriptionTypeId: subscriptionTypeMap['Enterprise'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Startup Ventures',
        email: 'hello@startupventures.com',
        phone: '+1-555-234-5678',
        subscriptionTypeId: subscriptionTypeMap['Basic'],
        status: 'trial',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('customers', customers, {});

    // Get customer IDs
    const createdCustomers = await queryInterface.sequelize.query(
      'SELECT id, name FROM customers',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Create billing records
    const billingRecords = [];
    const today = new Date();
    
    createdCustomers.forEach(customer => {
      // Create 3 months of billing records for each customer
      for (let i = 0; i < 3; i++) {
        const billingDate = new Date(today);
        billingDate.setMonth(today.getMonth() - i);
        
        billingRecords.push({
          customerId: customer.id,
          amount: Math.floor(Math.random() * 1000) + 100, // Random amount between 100 and 1100
          status: 'paid',
          billingDate: billingDate,
          dueDate: new Date(billingDate.setDate(billingDate.getDate() + 30)),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    });

    await queryInterface.bulkInsert('billing_records', billingRecords, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('billing_records', null, {});
    await queryInterface.bulkDelete('customers', null, {});
  }
}; 