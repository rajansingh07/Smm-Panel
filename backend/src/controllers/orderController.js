const { Order, Service, User, WalletTransaction } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const smmProvider = require('../services/smmProvider');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { serviceId, link, quantity } = req.body;

    // Get service
    const service = await Service.findById(serviceId);
    if (!service) {
      return next(new ErrorResponse('Service not found', 404));
    }

    if (!service.isActive) {
      return next(new ErrorResponse('Service is not available', 400));
    }

    // Validate quantity
    if (quantity < service.min || quantity > service.max) {
      return next(
        new ErrorResponse(
          `Quantity must be between ${service.min} and ${service.max}`,
          400
        )
      );
    }

    // Calculate amount
    const amount = (service.rate / 1000) * quantity;

    // Check user balance
    const user = await User.findById(req.user.id);
    if (user.walletBalance < amount) {
      return next(new ErrorResponse('Insufficient wallet balance', 400));
    }

    // Deduct from wallet
    user.walletBalance -= amount;
    await user.save();

    // Create wallet transaction
    await WalletTransaction.create({
      user: user._id,
      type: 'debit',
      amount,
      description: `Order for ${service.title}`,
      balanceAfter: user.walletBalance,
      paymentMethod: 'order',
    });

    // Create order
    const order = await Order.create({
      user: user._id,
      service: serviceId,
      link,
      quantity,
      amount,
      status: 'pending',
    });

    // Send order to SMM provider
    try {
      const providerResponse = await smmProvider.createOrder(
        service.providerServiceId,
        link,
        quantity
      );

      if (providerResponse && providerResponse.order) {
        order.providerOrderId = providerResponse.order.toString();
        order.status = 'processing';
        await order.save();
      }
    } catch (providerError) {
      console.error('SMM Provider Error:', providerError.message);
      // Order still created, will be retried by cron job
    }

    // Populate service info
    await order.populate('service', 'title category');

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = { user: req.user.id };

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate('service', 'title category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('service', 'title category rate')
      .populate('user', 'name email');

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Check ownership
    if (
      order.user._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(new ErrorResponse('Not authorized to view this order', 403));
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, userId, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (userId) {
      query.user = userId;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate('service', 'title category')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    let order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // If cancelling or refunding, credit the user
    if (
      (status === 'cancelled' || status === 'refunded') &&
      order.status !== 'cancelled' &&
      order.status !== 'refunded'
    ) {
      const user = await User.findById(order.user);
      user.walletBalance += order.amount;
      await user.save();

      await WalletTransaction.create({
        user: user._id,
        type: 'credit',
        amount: order.amount,
        description: `Refund for order #${order._id}`,
        balanceAfter: user.walletBalance,
        paymentMethod: 'refund',
        orderId: order._id,
      });
    }

    order.status = status;
    await order.save();

    await order.populate('service', 'title category');
    await order.populate('user', 'name email');

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get order statistics (admin)
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
exports.getOrderStats = async (req, res, next) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        byStatus: stats,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (err) {
    next(err);
  }
};
