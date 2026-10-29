const express = require('express');
const router = express.Router();
const Allocation = require('../models/Allocation');
const Receipt = require('../models/Receipt');

// GET /api/dashboard - Accountability dashboard (flags discrepancies, does NOT auto-accuse)
router.get('/', async (req, res) => {
  try {
    const allocations = await Allocation.find();
    const receipts = await Receipt.find();

    // Sums from Allocation tracking
    const totalAllocated = allocations.reduce((sum, a) => sum + (a.bagsAllocated || 0), 0);
    const totalDispatched = allocations.reduce((sum, a) => sum + (a.bagsDispatched || 0), 0);
    const totalReceivedCentre = allocations.reduce((sum, a) => sum + (a.bagsReceivedAtCentre || 0), 0);

    // Sums from Receipts - independent farmer confirmation
    const totalIssued = receipts.reduce((sum, r) => sum + (r.quantityIssued || 0), 0);
    const totalConfirmed = receipts.reduce((sum, r) => sum + (r.quantityReceived || 0), 0);

    const flaggedDifference = totalDispatched - totalConfirmed;

    const unconfirmedCount = receipts.filter(r => !r.confirmationDate).length;
    const disputes = receipts.filter(r => r.isDisputed);

    res.json({
      brand: 'Machpadaco Global Services',
      system: 'Machpadaco AgriTrace',
      module: 'Fertilizer',
      totalAllocated,
      totalDispatched,
      totalReceivedCentre,
      totalIssued,
      totalConfirmed,
      flaggedDifference,
      unconfirmedCount,
      disputes,
      allocations,
      receipts,
      example: 'If 1000 dispatched but 760 confirmed, 240 flagged - distinguishes confirmed shortages, awaiting confirmation, genuine losses (fictional pilot)',
      future: 'This architecture expands to seeds, pesticides, produce traceability with same audit trail',
      note: 'Fictional data - flags for authorized reviewers, does not auto-accuse - 3MTT x Meta Capstone',
      accountability: {
        principle1: 'Every movement recorded',
        principle2: 'Farmers confirm receipt independently via simulated OTP',
        principle3: 'Dashboard flags discrepancies - no auto fraud accusation',
        principle4: 'No silent editing - audit trail enforced',
        principle5: 'Separation of duties and privacy'
      }
    });

  } catch (err) {
    console.error('GET /api/dashboard error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
