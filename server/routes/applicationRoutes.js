const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");

// 1. SEND REQUEST (Startup -> Corporate)
router.post("/send", protect, async (req, res) => {
  try {
    const { receiverId, message, targetCompanyName } = req.body;

    // Check if request already exists
    const existing = await ConnectionRequest.findOne({
      sender: req.user.id,
      receiver: receiverId,
      status: "Pending"
    });

    if (existing) {
      return res.status(400).json({ message: "Request already sent to this company" });
    }

    const newRequest = await ConnectionRequest.create({
      sender: req.user.id,
      receiver: receiverId,
      senderName: req.user.name,
      senderEmail: req.user.email,
      targetCompanyName: targetCompanyName,
      message
    });

    res.status(201).json(newRequest);
  } catch (err) {
    console.error("Error sending request:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// 2. GET REQUESTS FOR ME (Corporate View)
// This fetches all requests where the logged-in user is the RECEIVER
router.get("/received", protect, async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({ receiver: req.user.id })
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// 3. GET REQUESTS SENT BY ME (Startup View)
router.get("/sent", protect, async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({ sender: req.user.id })
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// 4. UPDATE REQUEST STATUS (Accept/Reject)
router.put("/status/:id", protect, async (req, res) => {
  try {
    const { status } = req.body; // "Accepted" or "Rejected"
    const request = await ConnectionRequest.findById(req.params.id);

    if (!request) return res.status(404).json({ message: "Request not found" });

    // Ensure only the receiver can update status
    if (request.receiver.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    request.status = status;
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;