const { User, Role, Permission, RolePermission } = require('../database/models');

const checkPermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id, {
        include: [{
          model: Role,
          include: [{
            model: Permission,
            through: RolePermission
          }]
        }]
      });

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Check if user has admin role
      const isAdmin = user.Roles.some(role => role.isAdmin);
      if (isAdmin) {
        return next();
      }

      // Check if user has the required permission
      const hasPermission = user.Roles.some(role => 
        role.Permissions.some(permission => 
          permission.resource === resource && 
          (permission.action === action || permission.action === 'manage')
        )
      );

      if (!hasPermission) {
        return res.status(403).json({ 
          message: `You don't have permission to ${action} ${resource}` 
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = checkPermission; 