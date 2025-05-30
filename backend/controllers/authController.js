// controllers > authController
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Semua field harus diisi!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [existingUser] = await db.execute("SELECT id FROM users WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "User berhasil didaftarkan!" });
  } catch (err) {
    console.error("Error register:", err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // 🔍 Cek apakah user ada di database
      const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
  
      if (users.length === 0) {
        return res.status(401).json({ success: false, message: "Email atau password salah!" });
      }
  
      const user = users[0];
  
      // ✅ Pastikan password diambil dari field yang benar
      const hashedPassword = user.PASSWORD || user.password;
  
      // 🔍 Bandingkan password yang diinput dengan yang ada di database
      const passwordMatch = await bcrypt.compare(password, hashedPassword);
  
      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: "Email atau password salah!" });
      }
  
      // ✅ Buat token JWT untuk sesi login
      const token = jwt.sign(
        {
          id: user.id,
          name: user.NAME, // Sesuaikan jika perlu
          email: user.email,
          role: user.role,
        },
        process.env.JWT_KEY, // 🔍 Pastikan JWT_KEY ada di .env
        { expiresIn: "24h" }
      );
  
      res.json({ success: true, token, user: { id: user.id, name: user.NAME, email: user.email, role: user.role } });
    } catch (error) {
      console.error("Error login:", error);
      res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
    }
  };
  
module.exports = { login, register };