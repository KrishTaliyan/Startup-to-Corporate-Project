const express = require("express");
const router = express.Router();

// ✅ FIX: Destructure 'protect' so it is a function, not an object
const { protect } = require("../middleware/authMiddleware"); 

const User = require("../models/User");
const StartupProfile = require("../models/StartupProfile");
const CorporateProfile = require("../models/CorporateProfile");

// @route   GET /api/profile/me
// @desc    Get current user's profile
// @access  Private
// ✅ FIX: Use 'protect' here
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    let profileData = null;

    if (user.role === 'startup') {
        profileData = await StartupProfile.findOne({ user: req.user.id });
    } else if (user.role === 'corporate') {
        profileData = await CorporateProfile.findOne({ user: req.user.id });
    }

    res.json({
        user: user,
        profile: profileData || {} 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/profile/update
// @desc    Update profile
// @access  Private
// ✅ FIX: Use 'protect' here
router.put("/update", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let updatedProfile = null;

    if (user.role === 'startup') {
        const { 
            companyName, website, industry, fundingStage, 
            shortDescription, detailedPitch, techStack, compliance 
        } = req.body;

        const updateFields = {};
        if (companyName) updateFields.companyName = companyName;
        if (website) updateFields.website = website;
        if (industry) updateFields.industry = industry;
        if (fundingStage) updateFields.fundingStage = fundingStage;
        if (shortDescription) updateFields.shortDescription = shortDescription;
        if (detailedPitch) updateFields.detailedPitch = detailedPitch;
        if (techStack) updateFields.techStack = techStack;
        if (compliance) updateFields.compliance = compliance;

        updatedProfile = await StartupProfile.findOneAndUpdate(
            { user: req.user.id },
            { $set: updateFields },
            { new: true, upsert: true }
        );

    } else if (user.role === 'corporate') {
        const { 
            companyName, website, targetIndustries, 
            innovationFocus, pilotBudget, preferredStage 
        } = req.body;

        const updateFields = {};
        if (companyName) updateFields.companyName = companyName;
        if (website) updateFields.website = website;
        if (targetIndustries) updateFields.targetIndustries = targetIndustries;
        if (innovationFocus) updateFields.innovationFocus = innovationFocus;
        if (pilotBudget) updateFields.pilotBudget = pilotBudget;
        if (preferredStage) updateFields.preferredStage = preferredStage;

        updatedProfile = await CorporateProfile.findOneAndUpdate(
            { user: req.user.id },
            { $set: updateFields },
            { new: true, upsert: true }
        );
    }

    res.json(updatedProfile);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;