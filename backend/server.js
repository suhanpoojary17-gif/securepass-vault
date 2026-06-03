const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const vaultRoutes = require("./routes/vaultRoutes");
const app = express();
const sendEmail = require("./utils/sendEmail");
const otpRoutes = require("./routes/otpRoutes");
const securityRoutes = require("./routes/securityRoutes");
const passwordRoutes = require("./routes/passwordRoutes");


// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:");
    console.error(err);
  });

// Test Route
app.get("/", (req, res) => {
  res.send("SecurePass Vault API Running");
});

//Password Generator Route
app.use(
  "/api/password",
  passwordRoutes
);

// Routes (IMPORTANT: must be before listen)
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/vault", vaultRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/security", securityRoutes);

// Start Server
const PORT = process.env.PORT || 5000;

// Test Email Function
app.get("/test-email", async (req, res) => {
  await sendEmail(
    process.env.EMAIL_USER,
    "SecurePass Vault Test",
    "Congratulations! Email sending is working."
  );

  res.send("Test email sent.");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});