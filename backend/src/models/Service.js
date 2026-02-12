const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a service title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    rate: {
      type: Number,
      required: [true, 'Please provide a rate'],
      min: [0, 'Rate cannot be negative'],
    },
    min: {
      type: Number,
      required: [true, 'Please provide minimum order quantity'],
      min: [1, 'Minimum must be at least 1'],
    },
    max: {
      type: Number,
      required: [true, 'Please provide maximum order quantity'],
    },
    providerServiceId: {
      type: String,
      required: [true, 'Please provide provider service ID'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
serviceSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Service', serviceSchema);
