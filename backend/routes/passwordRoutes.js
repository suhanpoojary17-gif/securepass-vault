const express = require("express");
const router = express.Router();

const {
  generatePassword,
  generatePersonalizedPassword,
  checkPasswordStrength,
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

module.exports = router;