const express = require('express');
const router = express.Router();
const Receipt = require('../models/Receipt');

// Helper: Generate 6-digit simulated OTP (not real SMS)
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/receipts/generate-otp - Simulated OTP for farmer independent confirmation
router.post('/generate-otp', (req, res) => {
  try {
    const otp = generateOTP();
    res.json({
      otp,
      message: 'Simulated OTP for Machpadaco AgriTrace prototype - not real SMS',
      brand: 'Machpadaco Global Services',
      note: 'Fictional prototype - 3MTT x Meta Capstone - farmer confirms receipt independently',
      expiresIn: '5 minutes (simulated)'
    });
  } catch (err) {
    console.error('POST /generate-otp error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/receipts - Create receipt (farmer confirms quantity received)
router.post('/', async (req, res) => {
  try {
    const {
      farmerId,
      approvedAllocation,
      quantityIssued,
      quantityReceived,
      distributionPoint,
      confirmationMethod,
      otpCode,
      complaint
    } = req.body;

    const newReceipt = new Receipt({
      farmerId,
      approvedAllocation,
      quantityIssued,
      quantityReceived,
      distributionPoint,
      confirmationMethod: confirmationMethod || 'Simulated OTP',
      otpCode,
      complaint
    });

    await newReceipt.save();

    res.status(201).json({
      message: 'Receipt confirmed - independent farmer confirmation recorded',
      receipt: newReceipt,
      accountability: newReceipt.shortage > 0
        ? `Flagged: shortage of ${newReceipt.shortage} bag(s) - requires review, not auto fraud`
        : 'Confirmed: quantity matches - accountability maintained',
      pilotNote: 'Fictional data - e.g., 1000 bag pilot: 760 confirmed vs 240 flagged'
    });

  } catch (err) {
    console.error('POST /api/receipts error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/receipts - List all receipts sorted by confirmationDate
router.get('/', async (req, res) => {
  try {
    const receipts = await Receipt.find().sort({ confirmationDate: -1, createdAt: -1 });
    res.json({
      count: receipts.length,
      brand: 'Machpadaco Global Services',
      module: 'Independent Receipt Confirmation - Simulated OTP',
      data: receipts
    });
  } catch (err) {
    console.error('GET /api/receipts error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
