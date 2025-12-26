const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// 1. Import the Model
// Note: Ensure your model file is named 'StartupPost.js' in the models folder
const Post = require("../models/StartupPost"); 

// 2. Import Middleware
const { protect } = require("../middleware/authMiddleware");

// -------------------------
// GET ALL POSTS
// -------------------------
router.get("/", protect, async (req, res) => {
  try {
    // Get posts and sort by newest first
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// -------------------------
// CREATE NEW POST
// -------------------------
router.post("/", protect, async (req, res) => {
  try {
    const { content, image } = req.body;

    const newPost = new Post({
      user: req.user.id, // Comes from the token (protect middleware)
      content,
      image: image || "", // Optional image
      likes: [],
      comments: []
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;