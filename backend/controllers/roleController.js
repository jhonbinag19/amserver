const { Role, Permission, RolePermission } = require('../database/models');

const roleController = {
  async createRole(req, res) {
    try {
      const { name, description, isAdmin, permissions } = req.body;

      const role = await Role.create({
        name,
        description,
        isAdmin
      });

      if (permissions && permissions.length > 0) {
        await role.addPermissions(permissions);
      }

      res.status(201).json({
        message: 'Role created successfully',
        role
      });
    } catch (error) {
      console.error('Create role error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getRoles(req, res) {
    try {
      const roles = await Role.findAll({
        include: [{
          model: Permission,
          through: RolePermission
        }]
      });

      res.json(roles);
    } catch (error) {
      console.error('Get roles error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async updateRole(req, res) {
    try {
      const { id } = req.params;
      const { name, description, isAdmin, permissions } = req.body;

      const role = await Role.findByPk(id);
      if (!role) {
        return res.status(404).json({ message: 'Role not found' });
      }

      await role.update({
        name: name || role.name,
        description: description || role.description,
        isAdmin: isAdmin !== undefined ? isAdmin : role.isAdmin
      });

      if (permissions) {
        await role.setPermissions(permissions);
      }

      res.json({
        message: 'Role updated successfully',
        role
      });
    } catch (error) {
      console.error('Update role error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async deleteRole(req, res) {
    try {
      const { id } = req.params;

      const role = await Role.findByPk(id);
      if (!role) {
        return res.status(404).json({ message: 'Role not found' });
      }

      await role.destroy();
      res.json({ message: 'Role deleted successfully' });
    } catch (error) {
      console.error('Delete role error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = roleController; 