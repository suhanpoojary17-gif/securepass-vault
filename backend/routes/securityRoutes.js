const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  verifySecurityAnswer,
  getActivityLogs,
} = require("../controllers/securityController");

// Verify Security Answer
router.post(
  "/verify",
  authMiddleware,
  verifySecurityAnswer
);

//Activity Logs
router.get(
  "/logs",
  authMiddleware,
  getActivityLogs
);

module.exports = router;