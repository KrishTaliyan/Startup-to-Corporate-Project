const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
// ✅ FIX: Destructure protect
const { protect } = require("../middleware/auth");

router.get("/", protect, async (req, res) => {
  try {
    const notifs = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/read", protect, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id }, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;