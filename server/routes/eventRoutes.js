const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// ✅ CORRECT IMPORT: Pointing to authMiddleware.js
const { protect } = require("../middleware/authMiddleware");

// Get all events
router.get("/", protect, async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch events" });
    }
});

// Create a new event
router.post("/", protect, async (req, res) => {
    try {
        const newEvent = new Event({
            title: req.body.title,
            organizer: req.user.id,
            organizerName: req.user.companyName,
            date: req.body.date,
            link: req.body.link,
            description: req.body.description
        });
        await newEvent.save();
        res.json(newEvent);
    } catch (err) {
        res.status(500).json({ message: "Failed to create event" });
    }
});

// RSVP to an event
router.put("/rsvp/:id", protect, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Check if user is already attending to avoid duplicates
        if (!event.attendees.includes(req.user.id)) {
            event.attendees.push(req.user.id);
            await event.save();
        }
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: "Failed to RSVP" });
    }
});

module.exports = router;