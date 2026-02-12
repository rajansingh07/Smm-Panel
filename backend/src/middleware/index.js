const { protect, authorize } = require('./auth');
const errorHandler = require('./errorHandler');
const validate = require('./validate');

module.exports = {
  protect,
  authorize,
  errorHandler,
  validate,
};
