const { SubscriptionType } = require('../database/models');

const subscriptionTypeController = {
  async createSubscriptionType(req, res) {
    try {
      const { name, description, price, billingCycle, features } = req.body;

      const subscriptionType = await SubscriptionType.create({
        name,
        description,
        price,
        billingCycle,
        features
      });

      res.status(201).json({
        message: 'Subscription type created successfully',
        subscriptionType
      });
    } catch (error) {
      console.error('Create subscription type error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getSubscriptionTypes(req, res) {
    try {
      const subscriptionTypes = await SubscriptionType.findAll({
        where: { isActive: true }
      });
      res.json(subscriptionTypes);
    } catch (error) {
      console.error('Get subscription types error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async updateSubscriptionType(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price, billingCycle, features, isActive } = req.body;

      const subscriptionType = await SubscriptionType.findByPk(id);
      if (!subscriptionType) {
        return res.status(404).json({ message: 'Subscription type not found' });
      }

      await subscriptionType.update({
        name: name || subscriptionType.name,
        description: description || subscriptionType.description,
        price: price || subscriptionType.price,
        billingCycle: billingCycle || subscriptionType.billingCycle,
        features: features || subscriptionType.features,
        isActive: isActive !== undefined ? isActive : subscriptionType.isActive
      });

      res.json({
        message: 'Subscription type updated successfully',
        subscriptionType
      });
    } catch (error) {
      console.error('Update subscription type error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async deleteSubscriptionType(req, res) {
    try {
      const { id } = req.params;

      const subscriptionType = await SubscriptionType.findByPk(id);
      if (!subscriptionType) {
        return res.status(404).json({ message: 'Subscription type not found' });
      }

      await subscriptionType.update({ isActive: false });
      res.json({ message: 'Subscription type deactivated successfully' });
    } catch (error) {
      console.error('Delete subscription type error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = subscriptionTypeController; 