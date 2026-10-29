const express = require('express');
const router = express.Router();
const Allocation = require('../models/Allocation');

// POST /api/allocations - Create allocation (fertilizer tracking)
router.post('/', async (req, res) => {
  try {
    const {
      programmeName,
      fertilizerType,
      inputType,
      community,
      bagsAllocated,
      batchRef,
      bagsDispatched,
      bagsReceivedAtCentre,
      distributionCentre
    } = req.body;

    const newAllocation = new Allocation({
      programmeName: programmeName || 'Fertilizer Pilot Programme - Fictional',
      fertilizerType,
      inputType: inputType || 'Fertilizer',
      community,
      bagsAllocated,
      batchRef,
      bagsDispatched: bagsDispatched || 0,
      bagsReceivedAtCentre: bagsReceivedAtCentre || 0,
      distributionCentre
    });

    await newAllocation.save();

    res.status(201).json({
      message: 'Allocation created - Machpadaco AgriTrace tracking enabled',
      allocation: newAllocation,
      note: 'Fictional pilot data - bags movement recorded for accountability'
    });

  } catch (err) {
    console.error('POST /api/allocations error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/allocations - List all allocations
router.get('/', async (req, res) => {
  try {
    const allocations = await Allocation.find().sort({ createdAt: -1 });
    res.json({
      count: allocations.length,
      brand: 'Machpadaco Global Services',
      module: 'Fertilizer Tracking - Fictional Pilot',
      example: 'Pilot: 1000 bags total - 760 confirmed vs 240 flagged for review',
      data: allocations
    });
  } catch (err) {
    console.error('GET /api/allocations error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
