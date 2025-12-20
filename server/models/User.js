const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  // Common Fields
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["startup", "corporate"], required: true },
  
  // Specific to Startup
  companyName: { type: String },
  industry: { type: String },
  fundingStage: { type: String }, // e.g., Seed, Series A
  pitchDeckUrl: { type: String },

  // Specific to Corporate
  department: { type: String },
  pilotBudget: { type: String }, // e.g., $50k, $100k
  innovationFocus: { type: String }, // e.g., AI, Supply Chain

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);