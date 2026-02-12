const cron = require('node-cron');
const { Order, User, WalletTransaction } = require('../models');
const smmProvider = require('../services/smmProvider');

/**
 * Update order status from SMM provider
 * Runs every 5 minutes
 */
const orderStatusCron = cron.schedule(
  '*/5 * * * *',
  async () => {
    console.log('Running order status check cron job...');

    try {
      // Get all orders that need status check
      const orders = await Order.find({
        status: { $in: ['pending', 'processing', 'in_progress'] },
        providerOrderId: { $ne: null },
      }).limit(100);

      if (orders.length === 0) {
        console.log('No orders to check');
        return;
      }

      console.log(`Checking ${orders.length} orders...`);

      // Check status for each order
      for (const order of orders) {
        try {
          const status = await smmProvider.checkOrderStatus(order.providerOrderId);

          // Map provider status to our status
          let newStatus = order.status;
          switch (status.status?.toLowerCase()) {
            case 'pending':
              newStatus = 'pending';
              break;
            case 'processing':
            case 'in progress':
              newStatus = 'in_progress';
              break;
            case 'completed':
              newStatus = 'completed';
              break;
            case 'partial':
              newStatus = 'partial';
              break;
            case 'cancelled':
            case 'canceled':
              newStatus = 'cancelled';
              break;
            case 'refunded':
              newStatus = 'refunded';
              break;
          }

          // Update order
          order.status = newStatus;
          if (status.start_count !== undefined) {
            order.startCount = status.start_count;
          }
          if (status.remains !== undefined) {
            order.remains = status.remains;
          }
          await order.save();

          // Handle partial/cancelled/refunded orders - credit back the user
          if (
            (newStatus === 'partial' || newStatus === 'cancelled' || newStatus === 'refunded') &&
            order.remains > 0
          ) {
            const service = await order.populate('service');
            const refundAmount = (service.rate / 1000) * order.remains;

            if (refundAmount > 0) {
              const user = await User.findById(order.user);
              user.walletBalance += refundAmount;
              await user.save();

              await WalletTransaction.create({
                user: user._id,
                type: 'credit',
                amount: refundAmount,
                description: `Partial refund for order #${order._id}`,
                balanceAfter: user.walletBalance,
                paymentMethod: 'refund',
                orderId: order._id,
              });
            }
          }

          console.log(`Order ${order._id} updated to ${newStatus}`);
        } catch (err) {
          console.error(`Error checking order ${order._id}:`, err.message);
        }
      }

      console.log('Order status check completed');
    } catch (err) {
      console.error('Cron job error:', err.message);
    }
  },
  {
    scheduled: false, // Don't start automatically
  }
);

/**
 * Retry failed orders (orders without provider order ID)
 * Runs every 10 minutes
 */
const retryFailedOrdersCron = cron.schedule(
  '*/10 * * * *',
  async () => {
    console.log('Running retry failed orders cron job...');

    try {
      const orders = await Order.find({
        status: 'pending',
        providerOrderId: null,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
      })
        .populate('service')
        .limit(50);

      if (orders.length === 0) {
        console.log('No failed orders to retry');
        return;
      }

      console.log(`Retrying ${orders.length} failed orders...`);

      for (const order of orders) {
        try {
          const response = await smmProvider.createOrder(
            order.service.providerServiceId,
            order.link,
            order.quantity
          );

          if (response && response.order) {
            order.providerOrderId = response.order.toString();
            order.status = 'processing';
            await order.save();
            console.log(`Order ${order._id} successfully sent to provider`);
          }
        } catch (err) {
          console.error(`Error retrying order ${order._id}:`, err.message);
        }
      }

      console.log('Retry failed orders completed');
    } catch (err) {
      console.error('Retry cron job error:', err.message);
    }
  },
  {
    scheduled: false,
  }
);

// Start cron jobs
const startCronJobs = () => {
  orderStatusCron.start();
  retryFailedOrdersCron.start();
  console.log('Cron jobs started');
};

// Stop cron jobs
const stopCronJobs = () => {
  orderStatusCron.stop();
  retryFailedOrdersCron.stop();
  console.log('Cron jobs stopped');
};

module.exports = {
  startCronJobs,
  stopCronJobs,
};
