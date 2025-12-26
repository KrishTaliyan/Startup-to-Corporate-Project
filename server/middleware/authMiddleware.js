const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🔐 PROTECT ROUTES
const protect = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization) {
      token = req.headers.authorization.replace("Bearer ", "").trim();
    } else if (req.header("x-auth-token")) {
      token = req.header("x-auth-token");
    }

    if (!token) return res.status(401).json({ message: "No token. Access denied." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.user.id).select("-password");

    if (!req.user) return res.status(401).json({ message: "User not found." });

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    res.status(401).json({ message: "Token expired or invalid." });
  }
};

// ROLE CHECKS
const isStartup = (req, res, next) =>
  req.user?.role === "startup"
    ? next()
    : res.status(403).json({ message: "Startup access only" });

const isCorporate = (req, res, next) =>
  req.user?.role === "corporate"
    ? next()
    : res.status(403).json({ message: "Corporate access only" });

const isAdmin = (req, res, next) =>
  req.user?.role === "admin"
    ? next()
    : res.status(403).json({ message: "Admin only" });

module.exports = { protect, isStartup, isCorporate, isAdmin };
