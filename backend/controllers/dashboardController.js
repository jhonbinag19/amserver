const { User, Connection } = require('../database/models');
const { Op } = require('sequelize');

const dashboardController = {
  async getStats(req, res) {
    try {
      // Get total users count
      const totalUsers = await User.count({
        where: { status: 'active' }
      });

      // Get active integrations count
      const activeIntegrations = await Connection.count({
        where: { status: 'connected' }
      });

      // Get monthly revenue (this would typically come from a billing service)
      const monthlyRevenue = 0; // Placeholder - implement actual revenue calculation

      // Get pending tasks count
      const pendingTasks = 0; // Placeholder - implement actual task counting

      res.json({
        totalUsers,
        activeIntegrations,
        monthlyRevenue,
        pendingTasks
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getRecentActivity(req, res) {
    try {
      // Get recent user logins
      const recentLogins = await User.findAll({
        attributes: ['id', 'name', 'email', 'lastLogin'],
        where: {
          lastLogin: { [Op.ne]: null }
        },
        order: [['lastLogin', 'DESC']],
        limit: 10
      });

      // Get recent integration activities
      const recentIntegrations = await Connection.findAll({
        attributes: ['id', 'integration_type', 'status', 'last_sync'],
        where: {
          last_sync: { [Op.ne]: null }
        },
        order: [['last_sync', 'DESC']],
        limit: 10
      });

      res.json({
        recentLogins,
        recentIntegrations
      });
    } catch (error) {
      console.error('Get recent activity error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = dashboardController; 