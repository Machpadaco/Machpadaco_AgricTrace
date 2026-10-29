const express = require('express');
const router = express.Router();
const Farmer = require('../models/Farmer');

// POST /api/farmers - Register farmer with duplicate safeguard
router.post('/', async (req, res) => {
  try {
    const { farmerId, name, community, contact, crop, farmSize, eligibilityStatus, eligibilityReason, createdBy } = req.body;

    if (!farmerId) {
      return res.status(400).json({ message: 'farmerId is required - Machpadaco AgriTrace' });
    }

    // Check existing farmer by farmerId - fair selection & accountability
    const existing = await Farmer.findOne({ farmerId: farmerId.trim() });

    if (existing) {
      // Flag duplicate - does NOT auto-accuse, just safeguards
      existing.isDuplicate = true;
      existing.auditTrail.push({
        action: 'DUPLICATE_ATTEMPT',
        by: createdBy || 'SYSTEM',
        at: new Date(),
        reason: `Duplicate Farmer ID attempt for ${farmerId} - flagged, not auto-rejected as fraud`
      });
      await existing.save();

      return res.status(400).json({
        message: 'Duplicate Farmer ID flagged - Machpadaco AgriTrace safeguard',
        farmerId,
        isDuplicate: true,
        note: 'Flagged for review only - does not auto-accuse fraud (fictional pilot)'
      });
    }

    const newFarmer = new Farmer({
      farmerId: farmerId.trim(),
      name,
      community,
      contact,
      crop,
      farmSize,
      eligibilityStatus: eligibilityStatus || 'Pending',
      eligibilityReason,
      createdBy: createdBy || 'admin',
      auditTrail: [
        {
          action: 'Created',
          by: createdBy || 'admin',
          at: new Date(),
          reason: 'Initial registration - Machpadaco AgriTrace Fertilizer Pilot (fictional)'
        }
      ]
    });

    await newFarmer.save();

    res.status(201).json({
      message: 'Farmer registered successfully - Machpadaco AgriTrace',
      farmer: newFarmer
    });

  } catch (err) {
    console.error('POST /api/farmers error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/farmers - List all farmers
router.get('/', async (req, res) => {
  try {
    const farmers = await Farmer.find().sort({ createdAt: -1 });
    res.json({
      count: farmers.length,
      brand: 'Machpadaco Global Services',
      module: 'Fertilizer Pilot - Fictional Data',
      data: farmers
    });
  } catch (err) {
    console.error('GET /api/farmers error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
