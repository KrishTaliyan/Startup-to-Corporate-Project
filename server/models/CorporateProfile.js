const mongoose = require("mongoose");

const corporateProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    companyName: { type: String, required: true },
    website: { type: String },
    
    // Scouting Preferences
    targetIndustries: [{ 
        type: String, // e.g., ["FinTech", "AI/ML"]
        required: true 
    }],
    
    innovationFocus: { 
        type: String, 
        required: true,
        maxlength: 300 // Brief description for the algorithm
    },

    // Deal Parameters
    pilotBudget: { 
        type: String, 
        enum: ['$10k - $50k', '$50k - $100k', '$100k+', 'Undisclosed'] 
    },
    preferredStage: {
        type: String,
        enum: ['Seed', 'Series A', 'Series B', 'Any']
    },

    // Platform Features
    fastTrackEnabled: { type: Boolean, default: false }, // Allows "Turbo Pilot" usage
    activeRFPs: { type: Number, default: 0 } // Count of open Request for Proposals
  },
  { timestamps: true }
);

module.exports = mongoose.model("CorporateProfile", corporateProfileSchema);