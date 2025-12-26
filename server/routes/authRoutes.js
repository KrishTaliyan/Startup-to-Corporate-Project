const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// 📌 1. REGISTER ROUTE
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, companyName } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // Create User
    user = await User.create({
      name,
      email,
      password: hashedPass,
      role: role || "startup",
      companyName: companyName || "New Company"
    });

    // Generate Token
    const token = jwt.sign(
      { user: { id: user.id, role: user.role } },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      isNewUser: true, // ⭐ FLAG: Always true for manual registration
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName
      }
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server Error during Registration" });
  }
});

// 📌 2. LOGIN ROUTE (Magic Login / Auto-Register fallback)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    let isNewUser = false; // Default to false (Returning User)

    // IF USER DOES NOT EXIST -> AUTO REGISTER (Fallback)
    if (!user) {
      isNewUser = true; // ⭐ FLAG: Mark as New User
      
      // Determine Role based on email text
      let role = "startup";
      if (email.toLowerCase().includes("admin")) role = "admin";
      if (email.toLowerCase().includes("sony") || email.toLowerCase().includes("corp")) role = "corporate";

      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);

      user = await User.create({
        name: email.split("@")[0],
        email,
        password: hashedPass,
        role,
        companyName: role === 'corporate' ? "New Corp" : "New Startup"
      });
    } else {
      // IF USER EXISTS -> CHECK PASSWORD
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ message: "Invalid password" });
    }

    // GENERATE TOKEN
    const token = jwt.sign(
      { user: { id: user.id, role: user.role } },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login Successful",
      token,
      isNewUser, // ⭐ SEND FLAG TO FRONTEND
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// 📌 3. UPDATE PROFILE
router.put("/update", protect, async (req, res) => {
  try {
    const fields = req.body;
    const updated = await User.findByIdAndUpdate(req.user.id, fields, { new: true }).select("-password");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 4. GET ME
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

// 📌 5. GET ALL CORPORATES (For Startup Dashboard)
router.get("/corporates", protect, async (req, res) => {
  try {
    // Fetch all users who have the role 'corporate'
    const corporates = await User.find({ role: "corporate" }).select("-password");
    res.json(corporates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;