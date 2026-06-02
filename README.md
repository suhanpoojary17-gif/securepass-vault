# SecurePass Vault 🔐

SecurePass Vault is a simple password manager where users can safely store their login credentials like usernames and passwords for different platforms. The main idea behind this project is to keep sensitive data encrypted and protected instead of storing it in plain text.

---

## What this project does

When a user logs in, they can add their account details (like Facebook, Gmail, etc.) into the vault. The password is not stored directly. Instead, it is encrypted before saving it in the database, so even if someone accesses the database, they cannot read the actual password.

Users can also:
- Add new credentials
- View saved credentials
- Update existing entries
- Delete credentials when not needed

---

## Why I built this

I wanted to understand how real password managers work behind the scenes. This project helped me learn how authentication, encryption, and database handling work together in a real-world application.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- React
- JWT (Authentication)
- AES Encryption

---

## How to run this project

### Backend
```bash
npm install
npm start
