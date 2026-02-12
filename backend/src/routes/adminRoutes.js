const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getDashboardStats,
} = require('../controllers/adminController');
const { protect, authorize, validate } = require('../middleware');

// All routes require admin role
router.use(protect, authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
