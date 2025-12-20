const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// ✅ FIX: Changed '../middleware/auth' to '../middleware/authMiddleware'
const { protect } = require("../middleware/authMiddleware");

router.get("/:userId", protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user.id }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/send", protect, async (req, res) => {
  try {
    const newMessage = new Message({
      senderId: req.user.id,
      receiverId: req.body.receiverId,
      text: req.body.text
    });
    await newMessage.save();
    res.json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;