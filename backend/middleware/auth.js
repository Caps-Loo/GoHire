// middleware/auth,js
const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.error("⛔ Token tidak ditemukan.");
    return res.status(403).json({ success: false, message: "Token tidak ditemukan." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log("✅ Token berhasil diverifikasi:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("⛔ Token tidak valid:", error.message);
    return res.status(401).json({ success: false, message: "Token tidak valid atau sudah kedaluwarsa!" });
  }
};

module.exports = { authenticateUser };
