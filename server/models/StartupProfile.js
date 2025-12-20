const mongoose = require("mongoose");

const startupProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true // Ensures one profile per user
    },
    companyName: { type: String, required: true },
    website: { type: String, required: true },
    
    // Core Categorization
    industry: { 
        type: String, 
        required: true,
        enum: ['FinTech', 'HealthTech', 'CleanTech', 'Logistics', 'CyberSecurity', 'AI/ML', 'Other'] 
    },
    fundingStage: { 
        type: String, 
        enum: ['Pre-Seed', 'Seed', 'Series A', 'Series B+', 'Bootstrapped'] 
    },

    // The Pitch
    shortDescription: { type: String, maxlength: 200 }, // For the "Marketplace" card view
    detailedPitch: { type: String }, // Full details for the modal

    // Enterprise Vetting Data (New)
    techStack: [String], // e.g. ['Python', 'AWS', 'Solidity']
    compliance: [String], // e.g. ['SOC2', 'GDPR', 'ISO27001'] - Critical for Corporates
    pilotReady: { type: Boolean, default: false }, // Logic for "Turbo Pilot" availability

    // Dashboard Metrics
    teamSize: { type: Number },
    metrics: {
        activePilots: { type: Number, default: 0 },
        dealVolume: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("StartupProfile", startupProfileSchema);