const { Service } = require('../models');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res, next) => {
  try {
    const { category, search, status } = req.query;
    const query = {};

    // For public access, only show active services
    // Admin can filter by status if authenticated
    if (req.user && req.user.role === 'admin' && status !== undefined) {
      query.isActive = status === 'active';
    } else {
      // Public access - only active services
      query.isActive = true;
    }

    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const services = await Service.find(query).sort({ category: 1, title: 1 });

    // Group services by category
    const groupedServices = services.reduce((acc, service) => {
      if (!acc[service.category]) {
        acc[service.category] = [];
      }
      acc[service.category].push(service);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
      grouped: groupedServices,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
exports.getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return next(new ErrorResponse('Service not found', 404));
    }

    // Only return active services for public access
    if (!req.user && !service.isActive) {
      return next(new ErrorResponse('Service not found', 404));
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private/Admin
exports.createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
exports.updateService = async (req, res, next) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return next(new ErrorResponse('Service not found', 404));
    }

    service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return next(new ErrorResponse('Service not found', 404));
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all categories
// @route   GET /api/services/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Service.distinct('category', { isActive: true });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};
