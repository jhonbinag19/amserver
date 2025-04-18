'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, create the roles
    const roles = [
      {
        name: 'Super Admin',
        description: 'Has full access to all features and settings',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Admin',
        description: 'Can manage users, roles, and permissions',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Manager',
        description: 'Can manage billing and subscriptions',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'User',
        description: 'Basic user with limited access',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('roles', roles, {});

    // Get all permissions
    const permissions = await queryInterface.sequelize.query(
      'SELECT id, resource, action FROM permissions',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Get all roles
    const createdRoles = await queryInterface.sequelize.query(
      'SELECT id, name FROM roles',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Create role-permission associations
    const rolePermissions = [];
    
    createdRoles.forEach(role => {
      permissions.forEach(permission => {
        // Super Admin gets all permissions
        if (role.name === 'Super Admin') {
          rolePermissions.push({
            roleId: role.id,
            permissionId: permission.id,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
        // Admin gets all permissions except super admin features
        else if (role.name === 'Admin' && 
                 !['roles', 'permissions'].includes(permission.resource)) {
          rolePermissions.push({
            roleId: role.id,
            permissionId: permission.id,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
        // Manager gets billing and subscription permissions
        else if (role.name === 'Manager' && 
                 ['billing', 'subscription-types'].includes(permission.resource)) {
          rolePermissions.push({
            roleId: role.id,
            permissionId: permission.id,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
        // User gets read permissions only
        else if (role.name === 'User' && 
                 permission.action === 'read') {
          rolePermissions.push({
            roleId: role.id,
            permissionId: permission.id,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      });
    });

    await queryInterface.bulkInsert('role_permissions', rolePermissions, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('role_permissions', null, {});
    await queryInterface.bulkDelete('roles', null, {});
  }
}; 