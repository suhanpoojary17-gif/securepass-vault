const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  sendOtp,
  verifyOtp,
} = require("../controllers/otpController");

router.post("/send", authMiddleware, sendOtp);
router.post("/verify", authMiddleware, verifyOtp);

module.exports = router;