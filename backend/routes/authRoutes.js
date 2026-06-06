const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  register,
  login,
  changePassword,
} = require("../controllers/authController");

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

// PROTECTED ROUTE (TEST)
router.get("/profile", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

// CHANGE PASSWORD
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;