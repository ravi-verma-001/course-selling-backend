const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // if (req.user.role !== "admin") {
        //   return res.status(403).json({ message: "Access denied. Admins only." });
        //}

        next();
    } catch (err) {
        console.error("Admin verify error:", err);
        res.status(401).json({ message: "Invalid or expired token." });
    }
};
