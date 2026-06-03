const Otp = require("../models/Otp");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// Send OTP
exports.sendOtp = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 🔥 RESEND COOLDOWN (60 seconds)
    const existingOtp = await Otp.findOne({
      email: user.email,
    });

    if (existingOtp) {
      const timeDiff =
        (Date.now() - existingOtp.createdAt) / 1000;

      if (timeDiff < 60) {
        return res.status(429).json({
          message:
            "Please wait 60 seconds before requesting a new OTP",
        });
      }
    }

    // Generate OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Remove old OTPs
    await Otp.deleteMany({
      email: user.email,
    });

    // Save new OTP
    await Otp.create({
      email: user.email,
      otp,
    });

    // Send Email
    await sendEmail(
      user.email,
      "SecurePass Vault OTP",
      `Your OTP is: ${otp}. It is valid for 5 minutes.`
    );

    res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        message: "OTP is required",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otpRecord = await Otp.findOne({
      email: user.email,
      otp,
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // Delete OTP after successful verification
    await Otp.deleteOne({
      _id: otpRecord._id,
    });

    res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};