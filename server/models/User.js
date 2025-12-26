const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  // REQUIRED ACCOUNT FIELDS
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // ROLES
  role: {
    type: String,
    enum: ["startup", "corporate", "admin"],
    required: true,
    default: "startup",
  },

  // STARTUP INFO
  companyName: { type: String },
  industry: { type: String },
  fundingStage: { type: String }, // Seed / Pre-seed / Series A etc
  techStack: [String],            // ["React","Node","AI"]

  // CORPORATE INFO
  department: { type: String },
  pilotBudget: { type: String },
  innovationFocus: { type: String },

  // PROFILE EXTRAS
  website: { type: String },
  location: { type: String },
  bio: { type: String },
  avatar: { type: String },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
