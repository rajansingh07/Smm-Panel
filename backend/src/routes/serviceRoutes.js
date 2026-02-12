const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getCategories,
} = require('../controllers/serviceController');
const { protect, authorize, validate } = require('../middleware');

// Validation rules
const serviceValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('rate').isNumeric().withMessage('Rate must be a number'),
  body('min').isInt({ min: 1 }).withMessage('Minimum must be at least 1'),
  body('max').isInt({ min: 1 }).withMessage('Maximum must be at least 1'),
  body('providerServiceId')
    .trim()
    .notEmpty()
    .withMessage('Provider service ID is required'),
];

// Public routes (no auth required)
router.get('/', getServices);
router.get('/categories', getCategories);
router.get('/:id', getService);

// Admin routes
router.post(
  '/',
  protect,
  authorize('admin'),
  serviceValidation,
  validate,
  createService
);
router.put(
  '/:id',
  protect,
  authorize('admin'),
  updateService
);
router.delete('/:id', protect, authorize('admin'), deleteService);

module.exports = router;
