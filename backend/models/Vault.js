const mongoose = require("mongoose");

const vaultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    platform: {
      type: String,
      required: true,
      trim: true,
    },

    accountUsername: {
      type: String,
      required: true,
      trim: true,
    },

    encryptedPassword: {
      type: String,
      required: true,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vault", vaultSchema);