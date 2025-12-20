const mongoose = require("mongoose");

const OpportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  industry: { type: String, required: true },
  budget: { type: String, required: true },
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  companyName: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Opportunity", OpportunitySchema);