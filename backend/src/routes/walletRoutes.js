const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  getBalance,
  getTransactionHistory,
  createPaymentOrder,
  verifyPayment,
  paymentWebhook,
  adminAddFunds,
  getAllTransactions,
} = require('../controllers/walletController');
const { protect, authorize, validate } = require('../middleware');

// Validation rules
const addFundsValidation = [
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number')
    .custom((value) => value >= 10)
    .withMessage('Minimum amount is ₹10'),
];

const verifyPaymentValidation = [
  body('razorpay_order_id').notEmpty().withMessage('Order ID is required'),
  body('razorpay_payment_id').notEmpty().withMessage('Payment ID is required'),
  body('razorpay_signature').notEmpty().withMessage('Signature is required'),
];

const adminAddFundsValidation = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number')
    .custom((value) => value > 0)
    .withMessage('Amount must be greater than 0'),
];

// User routes
router.get('/balance', protect, getBalance);
router.get('/history', protect, getTransactionHistory);
router.post('/add-funds', protect, addFundsValidation, validate, createPaymentOrder);
router.post(
  '/verify-payment',
  protect,
  verifyPaymentValidation,
  validate,
  verifyPayment
);

// Webhook route (no auth required)
router.post('/webhook', paymentWebhook);

// Admin routes
router.post(
  '/admin/add-funds',
  protect,
  authorize('admin'),
  adminAddFundsValidation,
  validate,
  adminAddFunds
);
router.get('/admin/transactions', protect, authorize('admin'), getAllTransactions);

module.exports = router;
