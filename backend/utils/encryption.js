const crypto = require("crypto");

const algorithm = "aes-256-cbc";

const key = crypto
  .createHash("sha256")
  .update(process.env.AES_SECRET_KEY)
  .digest();

const iv = Buffer.alloc(16, 0);

// Encrypt
const encrypt = (text) => {
  const cipher = crypto.createCipheriv(
    algorithm,
    key,
    iv
  );

  let encrypted = cipher.update(
    text,
    "utf8",
    "hex"
  );

  encrypted += cipher.final("hex");

  return encrypted;
};

// Decrypt
const decrypt = (encryptedText) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    iv
  );

  let decrypted = decipher.update(
    encryptedText,
    "hex",
    "utf8"
  );

  decrypted += decipher.final("utf8");

  return decrypted;
};

module.exports = {
  encrypt,
  decrypt,
};