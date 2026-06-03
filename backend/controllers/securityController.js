const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.verifySecurityAnswer = async (req, res) => {
  try {
    const { answer } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      answer,
      user.securityAnswer
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect security answer",
      });
    }

    res.status(200).json({
      message: "Security answer verified",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};