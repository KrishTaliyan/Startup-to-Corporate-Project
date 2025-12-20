const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// ✅ FIX: Ensure this points to 'authMiddleware'
const { protect, isStartup, isCorporate } = require("../middleware/authMiddleware");

// CREATE POST (STARTUP)
router.post("/", protect, isStartup, async (req, res) => {
  try {
    const post = await Post.create({
      text: req.body.text, 
      author: req.user.id,
      authorName: req.user.name,
      authorCompany: req.user.companyName
    });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Post creation failed" });
  }
});

// GET ALL POSTS (EVERYONE)
router.get("/", protect, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

// LIKE / INTEREST (CORPORATE)
router.put("/like/:id", protect, isCorporate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if already liked
    if (post.likes.includes(req.user.id)) {
      return res.json({ message: "Already interested" }); // Return early to avoid error
    }

    post.likes.push(req.user.id);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;