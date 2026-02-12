const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    link: {
      type: String,
      required: [true, 'Please provide a link'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'],
      min: [1, 'Quantity must be at least 1'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide amount'],
      min: [0, 'Amount cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'in_progress', 'completed', 'partial', 'cancelled', 'refunded'],
      default: 'pending',
    },
    providerOrderId: {
      type: String,
      default: null,
    },
    startCount: {
      type: Number,
      default: 0,
    },
    remains: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ providerOrderId: 1 });

module.exports = mongoose.model('Order', orderSchema);
