const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
} = require('../controllers/orderController');
const { protect, authorize, validate } = require('../middleware');

// Validation rules
const createOrderValidation = [
  body('serviceId').notEmpty().withMessage('Service ID is required'),
  body('link').trim().notEmpty().withMessage('Link is required'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
];

const updateStatusValidation = [
  body('status')
    .isIn([
      'pending',
      'processing',
      'in_progress',
      'completed',
      'partial',
      'cancelled',
      'refunded',
    ])
    .withMessage('Invalid status'),
];

// User routes
router.post('/', protect, createOrderValidation, validate, createOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllOrders);
router.get('/admin/stats', protect, authorize('admin'), getOrderStats);
router.put(
  '/:id/status',
  protect,
  authorize('admin'),
  updateStatusValidation,
  validate,
  updateOrderStatus
);

module.exports = router;
