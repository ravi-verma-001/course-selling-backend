const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    thumbnail: {
      type: String, // store uploaded thumbnail URL or path
      required: true,
    },
    videos: [
      {
        type: String, // each element = video URL
      },
    ],

    // 🧩 Extra Fields Added (from your new upload form)
    level: {
      type: String,
      enum: ["Fellowship", "Certificate"],
      required: true,
    },
    expertise: {
      type: String,
      enum: ["General Practitioner", "Physician", "Nursing", "Healthcare Provider"],
      required: true,
    },
    duration: {
      type: String, // e.g., "3 Months"
      required: true,
    },
    mode: {
      type: String,
      enum: ["Online", "Hybrid", "Offline"],
      required: true,
    },
    eligibility: {
      type: String,
      required: true,
    },
    certificate: {
      type: Boolean,
      default: false,
    },
    enrollmentLink: {
      type: String,
    },
    logoPlacement: {
      type: String,
      enum: ["Top Left", "Center", "Custom"],
      default: "Top Left",
    },
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },

    // 👇 existing fields preserved
    purchasedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
