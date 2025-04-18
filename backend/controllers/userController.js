const { User } = require('../database/models');
const { Op } = require('sequelize');

const userController = {
  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async updateProfile(req, res) {
    try {
      const { name, email, phone } = req.body;
      
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if email is being changed and if it's already taken
      if (email && email !== user.email) {
        const existingUser = await User.findOne({
          where: {
            email,
            id: { [Op.ne]: req.user.id }
          }
        });

        if (existingUser) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }

      await user.update({
        name: name || user.name,
        email: email || user.email,
        phone: phone || user.phone
      });

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async updateAvatar(req, res) {
    try {
      const { avatar } = req.body;
      
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await user.update({ avatar });
      res.json({ message: 'Avatar updated successfully' });
    } catch (error) {
      console.error('Update avatar error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async updateSettings(req, res) {
    try {
      const { 
        emailNotifications,
        notificationTypes,
        twoFactorAuth,
        sessionTimeout,
        timezone,
        language
      } = req.body;

      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update settings
      await user.update({
        emailNotifications,
        notificationTypes,
        twoFactorEnabled: twoFactorAuth,
        sessionTimeout,
        timezone,
        language
      });

      res.json({ message: 'Settings updated successfully' });
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = userController; 