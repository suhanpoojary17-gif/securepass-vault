const express = require("express");
const router = express.Router();

const {
  generatePassword,
  generatePersonalizedPassword,
  checkPasswordStrength,
  checkPasswordExpiry,
} = require("../controllers/passwordController");

router.get(
  "/generate",
  generatePassword
);

router.post(
  "/generate-personalized",
  generatePersonalizedPassword
);

router.post(
  "/strength",
  checkPasswordStrength
);

const authMiddleware = require("../middleware/authMiddleware");

router.get(
  "/expiry/:id",
  authMiddleware,
  checkPasswordExpiry
);

module.exports = router;