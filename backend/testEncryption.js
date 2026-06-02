require("dotenv").config();

const {
  encrypt,
  decrypt,
} = require("./utils/encryption");

const password = "Password123";

const encrypted = encrypt(password);

const decrypted = decrypt(encrypted);

console.log("Original:", password);
console.log("Encrypted:", encrypted);
console.log("Decrypted:", decrypted);