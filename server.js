const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const cors = require("cors");


dotenv.config();
connectDB();


const app = express();
app.use(express.json());

// ✅ Allow frontend (3000) to access backend (5000)
app.use(cors({
  origin: "http://localhost:3000",   // allow only your frontend
  credentials: true
}));

// ✅ import user routes
const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
const paymentRoutes = require("./routes/payment");

// ✅ mount karo
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
