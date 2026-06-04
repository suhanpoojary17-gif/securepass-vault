const Vault = require("../models/Vault");
const { encrypt, decrypt } = require("../utils/encryption");
const createAuditLog = require("../utils/auditLogger");

// Add Credential
exports.addCredential = async (req, res) => {
  try {
    const {
      platform,
      accountUsername,
      encryptedPassword,
      notes,
    } = req.body;

    if (!platform || !accountUsername || !encryptedPassword) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    // 🔐 ENCRYPT HERE (FIXED)
    const encrypted = encrypt(encryptedPassword);

    const credential = await Vault.create({
      userId: req.user.id,
      platform,
      accountUsername,
      encryptedPassword: encrypted,
      notes,
    });

    res.status(201).json({
      message: "Credential added successfully",
      credential,
    });

  } catch (error) {
    console.error("ADD ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get All Credentials
exports.getCredentials = async (req, res) => {
  try {
    const credentials = await Vault.find({
      userId: req.user.id,
    });

    res.status(200).json({
      count: credentials.length,
      credentials,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Update Credential
exports.updateCredential = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };

    // Encrypt password before updating
    if (updateData.encryptedPassword) {
      updateData.encryptedPassword = encrypt(
        updateData.encryptedPassword
      );
    }

    const updatedCredential = await Vault.findOneAndUpdate(
      {
        _id: id,
        userId: req.user.id,
      },
      updateData,
      {
        new: true,
      }
    );

    if (!updatedCredential) {
      return res.status(404).json({
        message: "Credential not found",
      });
    }

    await createAuditLog(
       req.user.id,
       "UPDATE_CREDENTIAL",
       `Updated ${updatedCredential.platform} credential`
    );

    res.status(200).json({
      message: "Credential updated successfully",
      credential: updatedCredential,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Delete Credential
exports.deleteCredential = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCredential = await Vault.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!deletedCredential) {
      return res.status(404).json({
        message: "Credential not found",
      });
    }

    await createAuditLog(
      req.user.id,
      "DELETE_CREDENTIAL",
      `Deleted ${deletedCredential.platform} credential`
    );

    res.status(200).json({
      message: "Credential deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// View Password
exports.viewPassword = async (req, res) => {
  try {
    const { id } = req.params;

    const credential = await Vault.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!credential) {
      return res.status(404).json({
        message: "Credential not found",
      });
    }

    const decryptedPassword = decrypt(
      credential.encryptedPassword
    );
    
    await createAuditLog(
      req.user.id,
     "VIEW_PASSWORD",
    `Viewed ${credential.platform} password`
    );

    res.status(200).json({
      platform: credential.platform,
      accountUsername: credential.accountUsername,
      password: decryptedPassword,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};