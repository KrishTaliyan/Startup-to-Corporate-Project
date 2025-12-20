const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  opportunityId: { type: mongoose.Schema.Types.ObjectId, ref: "Opportunity", required: true },
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  corporateId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startupName: { type: String },
  startupEmail: { type: String },
  status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Application", ApplicationSchema);