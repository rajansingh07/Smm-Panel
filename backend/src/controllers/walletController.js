const { User, WalletTransaction } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const config = require('../config');

// Initialize Razorpay lazily
let razorpay = null;

const getRazorpay = () => {
  if (!razorpay) {
    if (!config.razorpay.keyId || !config.razorpay.keySecret) {
      throw new Error('Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
    }
    razorpay = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    });
  }
  return razorpay;
};

// @desc    Get wallet balance
// @route   GET /api/wallet/balance
// @access  Private
exports.getBalance = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        balance: user.walletBalance,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get wallet transaction history
// @route   GET /api/wallet/history
// @access  Private
exports.getTransactionHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const query = { user: req.user.id };

    if (type) {
      query.type = type;
    }

    const skip = (page - 1) * limit;

    const transactions = await WalletTransaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await WalletTransaction.countDocuments(query);

    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: transactions,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create Razorpay order for adding funds
// @route   POST /api/wallet/add-funds
// @access  Private
exports.createPaymentOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || amount < 10) {
      return next(new ErrorResponse('Minimum amount is ₹10', 400));
    }

    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency: 'INR',
      receipt: `wallet_${req.user.id}_${Date.now()}`,
      notes: {
        userId: req.user.id,
        type: 'wallet_recharge',
      },
    };

    const order = await getRazorpay().orders.create(options);

    // Create pending transaction
    await WalletTransaction.create({
      user: req.user.id,
      type: 'credit',
      amount,
      description: 'Wallet recharge',
      balanceAfter: req.user.walletBalance, // Will be updated on success
      paymentId: order.id,
      paymentMethod: 'razorpay',
      status: 'pending',
    });

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: config.razorpay.keyId,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify Razorpay payment and add funds
// @route   POST /api/wallet/verify-payment
// @access  Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return next(new ErrorResponse('Invalid payment signature', 400));
    }

    // Find the pending transaction
    const transaction = await WalletTransaction.findOne({
      paymentId: razorpay_order_id,
      status: 'pending',
    });

    if (!transaction) {
      return next(new ErrorResponse('Transaction not found', 404));
    }

    // Update user wallet
    const user = await User.findById(transaction.user);
    user.walletBalance += transaction.amount;
    await user.save();

    // Update transaction
    transaction.status = 'completed';
    transaction.balanceAfter = user.walletBalance;
    transaction.paymentId = razorpay_payment_id;
    await transaction.save();

    res.status(200).json({
      success: true,
      data: {
        message: 'Payment successful',
        newBalance: user.walletBalance,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Razorpay webhook handler
// @route   POST /api/wallet/webhook
// @access  Public
exports.paymentWebhook = async (req, res, next) => {
  try {
    const webhookSecret = config.razorpay.keySecret;
    const signature = req.headers['x-razorpay-signature'];

    const shasum = crypto.createHmac('sha256', webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (signature !== digest) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body.event;
    const payment = req.body.payload.payment?.entity;

    if (event === 'payment.captured') {
      const orderId = payment.order_id;

      // Find and update transaction
      const transaction = await WalletTransaction.findOne({
        paymentId: orderId,
        status: 'pending',
      });

      if (transaction) {
        const user = await User.findById(transaction.user);
        user.walletBalance += transaction.amount;
        await user.save();

        transaction.status = 'completed';
        transaction.balanceAfter = user.walletBalance;
        transaction.paymentId = payment.id;
        await transaction.save();
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook Error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// @desc    Admin: Add funds manually to user wallet
// @route   POST /api/wallet/admin/add-funds
// @access  Private/Admin
exports.adminAddFunds = async (req, res, next) => {
  try {
    const { userId, amount, description } = req.body;

    if (!userId || !amount || amount <= 0) {
      return next(new ErrorResponse('Please provide valid userId and amount', 400));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    user.walletBalance += amount;
    await user.save();

    await WalletTransaction.create({
      user: userId,
      type: 'credit',
      amount,
      description: description || 'Manual addition by admin',
      balanceAfter: user.walletBalance,
      paymentMethod: 'manual',
      status: 'completed',
    });

    res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        name: user.name,
        newBalance: user.walletBalance,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Get all transactions
// @route   GET /api/wallet/admin/transactions
// @access  Private/Admin
exports.getAllTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, userId, type, status } = req.query;
    const query = {};

    if (userId) query.user = userId;
    if (type) query.type = type;
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const transactions = await WalletTransaction.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await WalletTransaction.countDocuments(query);

    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: transactions,
    });
  } catch (err) {
    next(err);
  }
};
