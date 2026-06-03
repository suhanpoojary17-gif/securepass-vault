// Random Password Generator

exports.generatePassword = async (req, res) => {
  try {
    const length = parseInt(req.query.length) || 16;

    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

    let password = "";

    for (let i = 0; i < length; i++) {
      password += chars.charAt(
        Math.floor(Math.random() * chars.length)
      );
    }

    res.status(200).json({
      password,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Personalized Password Generator

exports.generatePersonalizedPassword = async (req, res) => {
  try {
    const { keyword, length } = req.body;

    if (!keyword) {
      return res.status(400).json({
        message: "Keyword is required",
      });
    }

    const passwordLength = parseInt(length) || 12;

    if (passwordLength < 8) {
      return res.status(400).json({
        message: "Minimum length is 8",
      });
    }

    const symbols = "!@#$%^&*";
    const numbers = "0123456789";
    const letters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    let password = keyword;

    while (password.length < passwordLength) {
      const allChars =
        symbols + numbers + letters;

      password += allChars.charAt(
        Math.floor(Math.random() * allChars.length)
      );
    }

    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    res.status(200).json({
      password,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Password Strength Analyzer

exports.checkPasswordStrength = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    let score = 0;

    // Length check
    if (password.length >= 8) score++;

    // Uppercase check
    if (/[A-Z]/.test(password)) score++;

    // Lowercase check
    if (/[a-z]/.test(password)) score++;

    // Number check
    if (/[0-9]/.test(password)) score++;

    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let strength = "";

    if (score <= 2) {
      strength = "Weak";
    } else if (score <= 4) {
      strength = "Medium";
    } else {
      strength = "Strong";
    }

    res.status(200).json({
      password,
      strength,
      score: `${score}/5`,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

const Vault = require("../models/Vault");

// Password Expiry Reminder
exports.checkPasswordExpiry = async (req, res) => {
  try {
    const { id } = req.params;

    const credential = await Vault.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!credential) {
      return res.status(404).json({
        message: "Credential not found",
      });
    }

    const createdDate = new Date(
      credential.createdAt
    );

    const currentDate = new Date();

    const differenceInTime =
      currentDate - createdDate;

    const ageInDays = Math.floor(
      differenceInTime /
      (1000 * 60 * 60 * 24)
    );

    let recommendation = "Password is fresh";

    if (ageInDays >= 90) {
      recommendation =
        "Consider changing this password";
    }

    res.status(200).json({
      platform: credential.platform,
      passwordAge: `${ageInDays} days`,
      recommendation,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};