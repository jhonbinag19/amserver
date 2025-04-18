const { Permission } = require('../database/models');

const permissionController = {
  async createPermission(req, res) {
    try {
      const { name, description, resource, action } = req.body;

      const permission = await Permission.create({
        name,
        description,
        resource,
        action
      });

      res.status(201).json({
        message: 'Permission created successfully',
        permission
      });
    } catch (error) {
      console.error('Create permission error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getPermissions(req, res) {
    try {
      const permissions = await Permission.findAll();
      res.json(permissions);
    } catch (error) {
      console.error('Get permissions error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async updatePermission(req, res) {
    try {
      const { id } = req.params;
      const { name, description, resource, action } = req.body;

      const permission = await Permission.findByPk(id);
      if (!permission) {
        return res.status(404).json({ message: 'Permission not found' });
      }

      await permission.update({
        name: name || permission.name,
        description: description || permission.description,
        resource: resource || permission.resource,
        action: action || permission.action
      });

      res.json({
        message: 'Permission updated successfully',
        permission
      });
    } catch (error) {
      console.error('Update permission error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async deletePermission(req, res) {
    try {
      const { id } = req.params;

      const permission = await Permission.findByPk(id);
      if (!permission) {
        return res.status(404).json({ message: 'Permission not found' });
      }

      await permission.destroy();
      res.json({ message: 'Permission deleted successfully' });
    } catch (error) {
      console.error('Delete permission error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = permissionController; 