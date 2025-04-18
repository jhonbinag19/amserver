'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      // User permissions
      {
        name: 'View Users',
        description: 'Permission to view user information',
        resource: 'users',
        action: 'read',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Create Users',
        description: 'Permission to create new users',
        resource: 'users',
        action: 'create',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Update Users',
        description: 'Permission to update user information',
        resource: 'users',
        action: 'update',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Delete Users',
        description: 'Permission to delete users',
        resource: 'users',
        action: 'delete',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Role permissions
      {
        name: 'View Roles',
        description: 'Permission to view role information',
        resource: 'roles',
        action: 'read',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Create Roles',
        description: 'Permission to create new roles',
        resource: 'roles',
        action: 'create',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Update Roles',
        description: 'Permission to update role information',
        resource: 'roles',
        action: 'update',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Delete Roles',
        description: 'Permission to delete roles',
        resource: 'roles',
        action: 'delete',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Permission permissions
      {
        name: 'View Permissions',
        description: 'Permission to view permission information',
        resource: 'permissions',
        action: 'read',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Create Permissions',
        description: 'Permission to create new permissions',
        resource: 'permissions',
        action: 'create',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Update Permissions',
        description: 'Permission to update permission information',
        resource: 'permissions',
        action: 'update',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Delete Permissions',
        description: 'Permission to delete permissions',
        resource: 'permissions',
        action: 'delete',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Subscription type permissions
      {
        name: 'View Subscription Types',
        description: 'Permission to view subscription type information',
        resource: 'subscription-types',
        action: 'read',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Create Subscription Types',
        description: 'Permission to create new subscription types',
        resource: 'subscription-types',
        action: 'create',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Update Subscription Types',
        description: 'Permission to update subscription type information',
        resource: 'subscription-types',
        action: 'update',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Delete Subscription Types',
        description: 'Permission to delete subscription types',
        resource: 'subscription-types',
        action: 'delete',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Billing permissions
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
      }
    ];

    await queryInterface.bulkInsert('permissions', permissions, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('permissions', null, {});
  }
}; 