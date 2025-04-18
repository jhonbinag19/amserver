const { Billing, Customer, SubscriptionType } = require('../database/models');

const billingController = {
  async createBilling(req, res) {
    try {
      const { customerId, subscriptionTypeId, amount, dueDate, status, description } = req.body;

      const billing = await Billing.create({
        customerId,
        subscriptionTypeId,
        amount,
        dueDate,
        status,
        description
      });

      const billingWithDetails = await Billing.findByPk(billing.id, {
        include: [
          {
            model: Customer,
            attributes: ['id', 'name', 'email']
          },
          {
            model: SubscriptionType,
            attributes: ['id', 'name', 'description', 'price', 'billingCycle']
          }
        ]
      });

      res.status(201).json({
        message: 'Billing record created successfully',
        billing: billingWithDetails
      });
    } catch (error) {
      console.error('Create billing error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getBillings(req, res) {
    try {
      const billings = await Billing.findAll({
        include: [
          {
            model: Customer,
            attributes: ['id', 'name', 'email']
          },
          {
            model: SubscriptionType,
            attributes: ['id', 'name', 'description', 'price', 'billingCycle']
          }
        ],
        order: [['dueDate', 'ASC']]
      });
      res.json(billings);
    } catch (error) {
      console.error('Get billings error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async updateBilling(req, res) {
    try {
      const { id } = req.params;
      const { customerId, subscriptionTypeId, amount, dueDate, status, description } = req.body;

      const billing = await Billing.findByPk(id);
      if (!billing) {
        return res.status(404).json({ message: 'Billing record not found' });
      }

      await billing.update({
        customerId: customerId || billing.customerId,
        subscriptionTypeId: subscriptionTypeId || billing.subscriptionTypeId,
        amount: amount || billing.amount,
        dueDate: dueDate || billing.dueDate,
        status: status || billing.status,
        description: description || billing.description
      });

      const updatedBilling = await Billing.findByPk(id, {
        include: [
          {
            model: Customer,
            attributes: ['id', 'name', 'email']
          },
          {
            model: SubscriptionType,
            attributes: ['id', 'name', 'description', 'price', 'billingCycle']
          }
        ]
      });

      res.json({
        message: 'Billing record updated successfully',
        billing: updatedBilling
      });
    } catch (error) {
      console.error('Update billing error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async deleteBilling(req, res) {
    try {
      const { id } = req.params;

      const billing = await Billing.findByPk(id);
      if (!billing) {
        return res.status(404).json({ message: 'Billing record not found' });
      }

      await billing.destroy();
      res.json({ message: 'Billing record deleted successfully' });
    } catch (error) {
      console.error('Delete billing error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = billingController; 