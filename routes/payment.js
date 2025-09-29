const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const authMiddleware = require("../middleware/auth");
const User = require("../models/User"); // ✅ add this line

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Order
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    console.error("Payment Error:", err);
    res.status(500).json({ success: false, message: "Payment failed" });
  }
});

// ✅ Verify Payment
router.post("/verify", authMiddleware,async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
    const userId = req.user.id; // ✅ from auth middleware

    console.log("Verify Body:", req.body);
    console.log("User from token:", req.user);

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // ✅ Add course to user's purchasedCourses
    await User.findByIdAndUpdate(userId, {
      $addToSet: { purchasedCourses: courseId }
    });

    res.json({ success: true, message: "Payment Verified & Course Added!" });
  } catch (error) {
   console.error("Verify error:", error.message); // ✅ console pe full error
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
