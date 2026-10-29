const mongoose = require('mongoose');

const auditTrailSchema = new mongoose.Schema({
  action: { type: String, required: true },
  by: { type: String, required: true },
  at: { type: Date, default: Date.now },
  reason: { type: String }
}, { _id: false });

const receiptSchema = new mongoose.Schema({
  farmerId: {
    type: String,
    required: [true, 'farmerId is required'],
    trim: true,
    index: true,
    ref: 'Farmer'
  },
  approvedAllocation: {
    type: Number,
    required: [true, 'approvedAllocation is required'],
    min: [0, 'approvedAllocation cannot be negative']
  },
  quantityIssued: {
    type: Number,
    required: [true, 'quantityIssued is required'],
    min: [0, 'quantityIssued cannot be negative']
  },
  quantityReceived: {
    type: Number,
    required: [true, 'quantityReceived is required'],
    min: [0, 'quantityReceived cannot be negative']
  },
  confirmationDate: {
    type: Date,
    default: Date.now
  },
  distributionPoint: {
    type: String,
    trim: true
  },
  confirmationMethod: {
    type: String,
    enum: {
      values: ['Simulated OTP', 'Assisted Paper'],
      message: '{VALUE} is not a valid confirmation method'
    },
    default: 'Simulated OTP'
  },
  otpCode: {
    type: String,
    trim: true
    // Simulated OTP only - not real SMS - for 3MTT x Meta capstone
  },
  shortage: {
    type: Number,
    default: 0
  },
  isDisputed: {
    type: Boolean,
    default: false,
    index: true
  },
  complaint: {
    type: String,
    trim: true
  },
  complaintStatus: {
    type: String,
    enum: ['Open', 'Investigating', 'Resolved'],
    default: 'Open',
    index: true
  },
  auditTrail: {
    type: [auditTrailSchema],
    default: []
  }
}, {
  timestamps: true,
  collection: 'receipts'
});

// Pre-save hook: calculate shortage and flag dispute (DOES NOT auto-accuse fraud)
receiptSchema.pre('save', function(next) {
  const issued = Number(this.quantityIssued) || 0;
  const received = Number(this.quantityReceived) || 0;
  this.shortage = issued - received;

  if (this.shortage > 0) {
    this.isDisputed = true;
    if (!this.complaint) {
      this.complaint = `Shortage of ${this.shortage} bag(s) - flagged for review (fictional pilot)`;
    }
  } else {
    this.shortage = 0;
    this.isDisputed = false;
  }

  // Audit trail for accountability
  if (this.isNew) {
    this.auditTrail.push({
      action: 'CREATE_RECEIPT',
      by: this.farmerId,
      at: new Date(),
      reason: `Farmer independent confirmation via ${this.confirmationMethod} - fictional`
    });
  }

  next();
});

// Indexes for dashboard analytics
receiptSchema.index({ farmerId: 1, confirmationDate: -1 });
receiptSchema.index({ isDisputed: 1, complaintStatus: 1 });

module.exports = mongoose.model('Receipt', receiptSchema);
