const mongoose = require("mongoose");
const EventSchema = new mongoose.Schema({
  title: String, organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, organizerName: String, date: Date, link: String, description: String, attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});
module.exports = mongoose.model("Event", EventSchema);