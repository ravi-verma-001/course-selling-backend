const User = require("../models/User");

// ✅ Middleware to verify if user is admin
const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied, admin only" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Export as named function
module.exports = { verifyAdmin };


