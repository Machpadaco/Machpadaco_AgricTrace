const mongoose = require('mongoose');

const auditTrailSchema = new mongoose.Schema({
  action: { type: String, required: true },
  by: { type: String, required: true },
  at: { type: Date, default: Date.now },
  reason: { type: String }
}, { _id: false });

const farmerSchema = new mongoose.Schema({
  farmerId: {
    type: String,
    unique: true,
    required: [true, 'farmerId is required'],
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Farmer name is required'],
    trim: true
  },
  community: {
    type: String,
    required: [true, 'Community is required'],
    trim: true
  },
  contact: {
    type: String,
    trim: true,
    // Privacy: stored but never exposed publicly without consent
  },
  crop: {
    type: String,
    trim: true
  },
  farmSize: {
    type: String,
    trim: true
  },
  eligibilityStatus: {
    type: String,
    enum: {
      values: ['Pending', 'Approved', 'Rejected'],
      message: '{VALUE} is not a valid eligibility status'
    },
    default: 'Pending',
    index: true
  },
  eligibilityReason: {
    type: String,
    trim: true
  },
  isDuplicate: {
    type: Boolean,
    default: false,
    index: true
  },
  createdBy: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  auditTrail: {
    type: [auditTrailSchema],
    default: []
  }
}, {
  timestamps: false,
  collection: 'farmers'
});

// No silent editing: pre-save audit helper
farmerSchema.pre('save', function(next) {
  if (this.isNew) {
    this.auditTrail.push({
      action: 'CREATE_FARMER',
      by: this.createdBy || 'SYSTEM',
      at: new Date(),
      reason: 'Initial farmer record creation - fictional data'
    });
  }
  next();
});

// Index for fair selection queries
farmerSchema.index({ community: 1, eligibilityStatus: 1, isDuplicate: 1 });

module.exports = mongoose.model('Farmer', farmerSchema);
