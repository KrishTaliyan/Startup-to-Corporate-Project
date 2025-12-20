const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/auth");

// Get my profile
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

// Update my profile
router.post("/me", protect, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profile: req.body },
    { new: true }
  ).select("-password");

  res.json(user);
});

module.exports = router;
