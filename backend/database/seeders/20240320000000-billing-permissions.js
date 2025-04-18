'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        name: 'View Billing',
        description: 'Permission to view billing information',
        resource: 'billing',
        action: 'read',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Create Billing',
        description: 'Permission to create new billing records',
        resource: 'billing',
        action: 'create',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Update Billing',
        description: 'Permission to update billing information',
        resource: 'billing',
        action: 'update',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Delete Billing',
        description: 'Permission to delete billing records',
        resource: 'billing',
        action: 'delete',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Manage Billing',
        description: 'Full permission to manage all billing operations',
        resource: 'billing',
        action: 'manage',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('permissions', permissions, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('permissions', {
      resource: 'billing'
    }, {});
  }
}; 