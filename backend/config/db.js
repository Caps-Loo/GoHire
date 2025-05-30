/**
 * Modul Koneksi Database
 * 
 * Membuat dan mengekspor koneksi pool MySQL untuk aplikasi
 * menggunakan variabel lingkungan untuk konfigurasi.
 */
const mysql = require("mysql2/promise");
require("dotenv").config();

/**
 * Konfigurasi koneksi pool database dengan parameter:
 * - DB_HOST: Nama host server database
 * - DB_USER: Username database
 * - DB_PASS: Password database
 * - DB_NAME: Nama database
 * 
 * Menggunakan pool memungkinkan aplikasi untuk:
 * - Menggunakan kembali koneksi yang sudah ada
 * - Menangani kegagalan koneksi dengan baik
 * - Membatasi jumlah maksimum koneksi
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  // Pengaturan tambahan default
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verifikasi koneksi database
pool.getConnection()
  .then(conn => {
    console.log("✅ Database berhasil terhubung");
    conn.release(); // Lepaskan koneksi kembali ke pool
  })
  .catch(err => {
    console.error("❌ Koneksi database gagal:", err);
  });

module.exports = pool;