const express = require("express");
const router = express.Router();
// Yahan double dot (..) sahi hai kyunki hum routes folder ke andar hain
const Post = require("../models/Post"); 
const { protect, isStartup, isCorporate } = require("../middleware/authMiddleware");

// ⭐ CREATE POST (Startup)
router.post("/", protect, isStartup, async (req, res) => {
  try {
    const { title, description } = req.body;

    const newPost = await Post.create({
      title,
      description,
      user: req.user.id,
    });

    return res.status(201).json(newPost);
  } catch (error) {
    return res.status(500).json({ error: "❌ Failed to create post", details: error.message });
  }
});

// ⭐ GET ALL POSTS (everyone)
router.get("/", protect, async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name email");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to fetch posts" });
  }
});

// ⭐ CORPORATE SHOW INTEREST
router.post("/interest/:postId", protect, isCorporate, async (req, res) => {
  try {
    const { message } = req.body;
    const post = await Post.findById(req.params.postId);
    
    if (!post) return res.status(404).json({ message: "❌ Post not found" });

    post.interestedCorporates.push({
      corporateId: req.user.id,
      status: "Pending",
      message,
    });

    await post.save();
    return res.json({ message: "📩 Interest sent successfully", post });
  } catch (error) {
    return res.status(500).json({ error: "Failed to send interest" });
  }
});

module.exports = router;