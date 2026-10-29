const mongoose = require('mongoose');

const allocationSchema = new mongoose.Schema({
  programmeName: {
    type: String,
    required: [true, 'programmeName is required'],
    trim: true,
    default: 'Fertilizer Pilot Programme - Fictional'
  },
  fertilizerType: {
    type: String,
    required: [true, 'fertilizerType is required'],
    trim: true,
    // e.g., NPK, Urea, etc. - fictional pilot data
  },
  inputType: {
    type: String,
    default: 'Fertilizer',
    trim: true
  },
  community: {
    type: String,
    required: [true, 'Community is required'],
    trim: true,
    index: true
  },
  bagsAllocated: {
    type: Number,
    required: [true, 'bagsAllocated is required'],
    min: [0, 'bagsAllocated cannot be negative']
  },
  batchRef: {
    type: String,
    trim: true,
    index: true,
    // e.g., BATCH-RIV-2026-001
  },
  bagsDispatched: {
    type: Number,
    default: 0,
    min: [0, 'bagsDispatched cannot be negative']
  },
  bagsReceivedAtCentre: {
    type: Number,
    default: 0,
    min: [0, 'bagsReceivedAtCentre cannot be negative']
  },
  distributionCentre: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false,
  collection: 'allocations'
});

// Tracking index: community + batch
allocationSchema.index({ community: 1, batchRef: 1 });

// Virtual for tracking discrepancy at allocation level
allocationSchema.virtual('dispatchVariance').get(function() {
  return this.bagsAllocated - (this.bagsDispatched || 0);
});

allocationSchema.virtual('centreVariance').get(function() {
  return (this.bagsDispatched || 0) - (this.bagsReceivedAtCentre || 0);
});

module.exports = mongoose.model('Allocation', allocationSchema);
