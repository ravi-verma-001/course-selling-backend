const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  purchasedCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",  // Course model ka reference
    },
  ],
  role: {
    type: String,
    enum: ["user", "admin"], // sirf ye 2 role
    default: "user", // by default sab user honge
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
