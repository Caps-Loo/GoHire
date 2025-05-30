const express = require("express");
const { authenticateUser } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Import semua controller menggunakan object destructuring
const {
  submitApplicationHandler,
  getApplicationsHandler,
  updateApplicationStatusHandler,
  deleteApplicant,
  getJumlahPelamar,
  getRiwayatPelamar,
  getDaftarPelamar,
  getDetailPelamar,
  getUserNotifications,
  deleteNotification,
  markNotificationAsRead,
  markNotificationAsUnread,
  getApplicantsByStatus
} = require("../controllers/applicationController");

const router = express.Router();

// ✅ Konfigurasi Multer untuk file upload (resume & foto)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// 🔥 Rute untuk menangani lamaran pekerjaan (dengan upload file)
router.post("/", authenticateUser, upload.fields([{ name: "resume" }, { name: "photo" }]), submitApplicationHandler);

// 🔥 Rute lainnya
router.get("/", authenticateUser, getApplicationsHandler);
router.put("/:id", authenticateUser, updateApplicationStatusHandler);
router.delete("/:id", authenticateUser, deleteApplicant);
router.get("/jumlah-pelamar", authenticateUser, getJumlahPelamar);
router.get("/history", authenticateUser, getRiwayatPelamar);
router.get("/daftar-pelamar/:job_id", authenticateUser, getDaftarPelamar);
router.get("/detail-pelamar/:application_id", authenticateUser, getDetailPelamar);

// 🔥 Rute untuk notifikasi
router.get("/notifications", authenticateUser, getUserNotifications);
router.delete("/notifications/:id", authenticateUser, deleteNotification);
router.put("/notifications/:id/read", authenticateUser, markNotificationAsRead);
router.put("/notifications/:id/unread", authenticateUser, markNotificationAsUnread);

// 🔥 Rute untuk riwayat pelamar berdasarkan status
router.get("/history/:job_id/:status", authenticateUser, getApplicantsByStatus);

module.exports = router;
