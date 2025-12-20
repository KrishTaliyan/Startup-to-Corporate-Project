const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Opportunity = require("../models/Opportunity");
const Notification = require("../models/Notification");

// ✅ FIX: Changed to 'authMiddleware'
const { protect } = require("../middleware/authMiddleware");

// Apply to a job
router.post("/apply/:id", protect, async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ message: "Job not found" });

    // Check if already applied
    const existing = await Application.findOne({ opportunityId: req.params.id, startupId: req.user.id });
    if (existing) return res.status(400).json({ message: "Already applied" });

    const newApp = new Application({
      opportunityId: req.params.id,
      startupId: req.user.id,
      corporateId: opp.postedBy,
      startupName: req.user.companyName,
      startupEmail: req.user.email
    });
    await newApp.save();

    // Notify Corporate
    await new Notification({
      userId: opp.postedBy,
      type: "info",
      message: `🚀 New Proposal received from ${req.user.companyName}`
    }).save();

    res.json({ message: "Applied!" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get Startup's Applications
router.get("/startup", protect, async (req, res) => {
    const apps = await Application.find({ startupId: req.user.id }).populate("opportunityId").sort({ appliedAt: -1 });
    res.json(apps);
});

// Get Corporate's Applicants
router.get("/corporate", protect, async (req, res) => {
    const apps = await Application.find({ corporateId: req.user.id }).populate("opportunityId").sort({ appliedAt: -1 });
    res.json(apps);
});

// Accept/Reject
router.put("/status/:id", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const app = await Application.findById(req.params.id).populate('opportunityId');
    app.status = status;
    await app.save();

    // Notify Startup
    await new Notification({
      userId: app.startupId,
      type: status === 'Accepted' ? "success" : "error",
      message: `Your proposal for ${app.opportunityId.title} was ${status}`
    }).save();

    res.json(app);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;