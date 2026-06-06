const AuditLog = require("../models/AuditLog");

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({ logs });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};