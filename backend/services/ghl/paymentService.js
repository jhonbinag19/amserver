const db = require('../../database/models');
const { Payment, Subscription } = db;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const paymentService = {
  async getSubscription(organizationId) {
    const subscription = await Subscription.findOne({
      where: { organization_id: organizationId }
    });

    if (!subscription) {
      return null;
    }

    return {
      plan_name: subscription.plan_name,
      monthly_cost: subscription.monthly_cost,
      next_billing_date: subscription.next_billing_date,
      status: subscription.status
    };
  },

  async getPayments(organizationId) {
    return await Payment.findAll({
      where: { organization_id: organizationId },
      order: [['created_at', 'DESC']]
    });
  },

  async processPayment(data) {
    const { organization_id, amount, type, description, payment_method } = data;

    // Process payment with Stripe
    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        payment_method,
        confirm: true,
        description
      });
    } catch (error) {
      throw new Error('Payment processing failed');
    }

    // Create payment record
    const payment = await Payment.create({
      organization_id,
      amount,
      type,
      description,
      status: paymentIntent.status === 'succeeded' ? 'success' : 'failed',
      payment_method,
      stripe_payment_id: paymentIntent.id
    });

    // If it's a subscription payment, update subscription
    if (type === 'subscription') {
      await this.updateSubscription({
        organization_id,
        plan_name: description,
        monthly_cost: amount,
        next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'active'
      });
    }

    return payment;
  },

  async updateSubscription(data) {
    const { organization_id, plan_name, monthly_cost, next_billing_date, status } = data;

    const [subscription] = await Subscription.upsert({
      organization_id,
      plan_name,
      monthly_cost,
      next_billing_date,
      status
    });

    return subscription;
  },

  async cancelSubscription(organizationId) {
    const subscription = await Subscription.findOne({
      where: { organization_id: organizationId }
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // Cancel subscription in Stripe
    try {
      await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
    } catch (error) {
      throw new Error('Failed to cancel subscription');
    }

    // Update subscription status
    await subscription.update({
      status: 'cancelled',
      cancelled_at: new Date()
    });
  }
};

module.exports = paymentService; 