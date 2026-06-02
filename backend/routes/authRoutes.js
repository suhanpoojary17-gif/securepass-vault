const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  register,
  login,
} = require("../controllers/authController");

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

// PROTECTED TEST ROUTE
router.get(
  "/profile",
  authMiddleware,
  (req, res) => {
    res.status(200).json({
      message: "Protected route accessed successfully",
      user: req.user,
    });
  }
);

module.exports = router;