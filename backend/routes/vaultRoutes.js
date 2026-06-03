const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addCredential,
  getCredentials,
  updateCredential,
  deleteCredential,
  viewPassword,
} = require("../controllers/vaultController");

// Add Credential
router.post(
  "/add",
  authMiddleware,
  addCredential
);

// Get All Credentials
router.get(
  "/",
  authMiddleware,
  getCredentials
);

// Update Credential
router.put(
  "/:id",
  authMiddleware,
  updateCredential
);

// Delete Credential
router.delete(
  "/:id",
  authMiddleware,
  deleteCredential
);

//View Credential
router.get(
  "/view/:id",
  authMiddleware,
  viewPassword
);

module.exports = router;