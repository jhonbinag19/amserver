const { Role } = require('../models');

const checkPermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      // Admin has full access
      if (user.role === 'admin') {
        return next();
      }

      // Get user's role with permissions
      const role = await Role.findById(user.roleId).populate('permissions');
      
      if (!role) {
        return res.status(403).json({ error: 'Role not found' });
      }

      // Check if role has the required permission
      const hasPermission = role.permissions.some(permission => 
        permission.resource === resource && 
        permission.actions.includes(action)
      );

      if (!hasPermission) {
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          message: `You don't have permission to ${action} ${resource}`
        });
      }

      next();
    } catch (error) {
      console.error('Permission middleware error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};

const checkUserAccess = (resourceId) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      // Admin has full access
      if (user.role === 'admin') {
        return next();
      }

      // For users, check if they own the resource
      if (req.params[resourceId] && req.params[resourceId] !== user.id) {
        return res.status(403).json({ 
          error: 'Access denied',
          message: 'You can only access your own resources'
        });
      }

      next();
    } catch (error) {
      console.error('User access middleware error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};

module.exports = {
  checkPermission,
  checkUserAccess
}; 