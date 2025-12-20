const express = require("express");
const router = express.Router();
const Opportunity = require("../models/Opportunity");

// ✅ FIX: Changed to 'authMiddleware'
const { protect } = require("../middleware/authMiddleware"); 

// @route   GET /api/opportunities
// @desc    Get all opportunities
router.get("/", protect, async (req, res) => {
  try {
    const opportunities = await Opportunity.find().sort({ createdAt: -1 });
    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/opportunities
// @desc    Create an opportunity
router.post("/", protect, async (req, res) => {
  try {
    const newOpportunity = new Opportunity({
      postedBy: req.user.id,
      companyName: req.user.companyName,
      title: req.body.title,
      industry: req.body.industry,
      budget: req.body.budget,
      description: req.body.description
    });
    await newOpportunity.save();
    res.json(newOpportunity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;