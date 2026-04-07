const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Opportunity = require("../models/Opportunity");
const User = require("../models/User");

// @route   POST /api/opportunities
// @desc    Create a new RFP (Corporate Only)
router.post("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'corporate') {
      return res.status(403).json({ message: "Access denied. Corporates only." });
    }

    const newOpp = new Opportunity({
      title: req.body.title,
      description: req.body.description,
      industry: req.body.industry,
      budget: req.body.budget,
      postedBy: req.user.id,
      companyName: user.companyName || user.name
    });

    const savedOpp = await newOpp.save();
    res.json(savedOpp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/opportunities
// @desc    Get all RFPs (For Startups)
router.get("/", auth, async (req, res) => {
  try {
    const opps = await Opportunity.find().sort({ createdAt: -1 });
    res.json(opps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;