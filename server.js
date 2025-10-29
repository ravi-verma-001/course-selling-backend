const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const cors = require("cors");
const helmet = require("helmet"); // ✅ add this line


dotenv.config();
connectDB();


const app = express();
app.use(express.json());

// ✅ Allow frontend (3000) to access backend (5000)
app.use(cors({
  origin: ["http://localhost:3000", "https://medbyacademy.com" ,"https://gorgeous-tartufo-3c219f.netlify.app"],    // allow only your frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Step 2: Add helmet policy for images
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin", // 👈 this line fixes ORB blocking
  })
);

app.get("/", (req, res) => {
  res.send("🚀 Backend Live on Render");
});


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
