const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Routes
const authRoutes = require("./routes/authRoutes");
const vaultRoutes = require("./routes/vaultRoutes");
const otpRoutes = require("./routes/otpRoutes");
const securityRoutes = require("./routes/securityRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

// Utils
const sendEmail = require("./utils/sendEmail");


//  MIDDLEWARE 
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());


//  MONGODB 
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:");
    console.error(err);
  });


//  BASIC TEST ROUTE 
app.get("/", (req, res) => {
  res.send("SecurePass Vault API Running");
});


//  ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/vault", vaultRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/security", securityRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/audit-logs", require("./routes/auditRoutes"));

// TEST EMAIL ROUTE 
app.get("/test-email", async (req, res) => {
  await sendEmail(
    process.env.EMAIL_USER,
    "SecurePass Vault Test",
    "Congratulations! Email sending is working."
  );

  res.send("Test email sent.");
});


//START SERVER 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});