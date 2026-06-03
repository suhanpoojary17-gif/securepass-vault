const express = require("express");
const router = express.Router();

const {
  generatePassword,
  generatePersonalizedPassword,
} = require("../controllers/passwordController");

router.get(
  "/generate",
  generatePassword
);

router.post(
  "/generate-personalized",
  generatePersonalizedPassword
);

module.exports = router;