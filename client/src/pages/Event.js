const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // The Corporate
  organizerName: { type: String },
  date: { type: Date, required: true },
  link: { type: String, required: true }, // Zoom/Meet Link
  description: { type: String },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of Startups going
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", EventSchema);