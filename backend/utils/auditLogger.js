const AuditLog = require("../models/AuditLog");

const createAuditLog = async (
  userId,
  action,
  details = ""
) => {
  try {
    await AuditLog.create({
      userId,
      action,
      details,
    });
  } catch (error) {
    console.error(
      "Audit Log Error:",
      error.message
    );
  }
};

module.exports = createAuditLog;