const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  verifySecurityAnswer,
} = require("../controllers/securityController");

router.post(
  "/verify",
  authMiddleware,
  verifySecurityAnswer
);

module.exports = router;