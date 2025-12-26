const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Corporates that showed interest
    interestedCorporates: [
      {
        corporateId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: {
          type: String,
          enum: ["Pending", "Accepted", "Rejected"],
          default: "Pending",
        },
        message: String,
        meetingLink: String,
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
