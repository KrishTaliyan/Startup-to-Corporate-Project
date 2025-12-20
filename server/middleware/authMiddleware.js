const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.user.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else if (req.header("x-auth-token")) {
    try {
      token = req.header("x-auth-token");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.user.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

const isStartup = (req, res, next) => {
  if (req.user && req.user.role === "startup") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Startups only." });
  }
};

const isCorporate = (req, res, next) => {
  if (req.user && req.user.role === "corporate") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Corporates only." });
  }
};

module.exports = { protect, isStartup, isCorporate };