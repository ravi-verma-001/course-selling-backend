const express = require("express");
const multer = require("multer");
const path = require("path");
const Course = require("../models/Course");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// ✅ Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Base URL helper (Render / Local)
const getBaseUrl = (req) => {
  const host = req.get("host");
  if (host.includes("onrender.com")) {
    return "https://course-selling-backend-2-rr1n.onrender.com"; // your live backend URL
  }
  return `${req.protocol}://${host}`; // for localhost
};

// ✅ Upload new course
router.post(
  "/upload",
  authMiddleware,
  upload.single("thumbnail"),
  async (req, res) => {
    try {
      const { title, description, price, videos, courseType } = req.body;

      if (!courseType || !["Fellowship", "Certificate"].includes(courseType)) {
        return res.status(400).json({ error: "Invalid or missing course type" });
      }

      const baseUrl = getBaseUrl(req);

      const newCourse = new Course({
        title,
        description,
        price,
        thumbnail: req.file ? `${baseUrl}/uploads/${req.file.filename}` : null,
        videos: JSON.parse(videos || "[]"),
        courseType,
        createdBy: req.user.id,
      });

      await newCourse.save();
      res.json({ message: "✅ Course uploaded successfully", course: newCourse });
    } catch (err) {
      console.error("❌ Upload error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// ✅ Get My Purchased Courses
router.get("/my-courses", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("purchasedCourses");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user.purchasedCourses);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Get all Fellowship Courses
router.get("/fellowship", async (req, res) => {
  try {
    const courses = await Course.find({ courseType: "Fellowship" }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    console.error("Error fetching fellowship courses:", err);
    res.status(500).send("Server error");
  }
});

// ✅ Get all Certificate Courses
router.get("/certificate", async (req, res) => {
  try {
    const courses = await Course.find({ courseType: "Certificate" }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    console.error("Error fetching certificate courses:", err);
    res.status(500).send("Server error");
  }
});

// ✅ Get course by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: "Course not found" });
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ✅ Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
