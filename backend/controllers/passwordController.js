// Random Password Generator

exports.generatePassword = async (req, res) => {
  try {
    const length = parseInt(req.query.length) || 16;

    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

    let password = "";

    for (let i = 0; i < length; i++) {
      password += chars.charAt(
        Math.floor(Math.random() * chars.length)
      );
    }

    res.status(200).json({
      password,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Personalized Password Generator

exports.generatePersonalizedPassword = async (req, res) => {
  try {
    const { keyword, length } = req.body;

    if (!keyword) {
      return res.status(400).json({
        message: "Keyword is required",
      });
    }

    const passwordLength = parseInt(length) || 12;

    if (passwordLength < 8) {
      return res.status(400).json({
        message: "Minimum length is 8",
      });
    }

    const symbols = "!@#$%^&*";
    const numbers = "0123456789";
    const letters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    let password = keyword;

    while (password.length < passwordLength) {
      const allChars =
        symbols + numbers + letters;

      password += allChars.charAt(
        Math.floor(Math.random() * allChars.length)
      );
    }

    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    res.status(200).json({
      password,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};