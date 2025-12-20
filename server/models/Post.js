const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  authorName: { type: String },
  authorCompany: { type: String },
  text: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Stores User IDs of people who liked
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", PostSchema);