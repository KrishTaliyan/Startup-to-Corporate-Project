const express = require("express");
const {
  protect,
  isStartup,
  isCorporate,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ANY LOGGED-IN USER
router.get("/protected", protect, (req, res) => {
  res.json({
    message: "You are logged in",
    user: req.user,
  });
});

// STARTUP ONLY
router.get("/startup", protect, isStartup, (req, res) => {
  res.json({ message: "Welcome Startup" });
});

// CORPORATE ONLY
router.get("/corporate", protect, isCorporate, (req, res) => {
  res.json({ message: "Welcome Corporate" });
});

module.exports = router;
