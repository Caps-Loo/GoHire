//  controllers > applicationController
const pool = require("../config/db");
const createPDF = require("../utils/pdfGenerator");
const fs = require("fs");
const path = require("path");

// ✅ Simpan lamaran pekerjaan
const submitApplicationHandler = async (req, res) => {
  try {
      // Ambil data dari request body
      const {
          user_id, job_id, name, email, phone, address, linkedin,
          expectedSalary, education, experience, message
      } = req.body;

      // Validasi bahwa field utama tidak boleh kosong
      if (!user_id || !job_id || !name || !email) {
          return res.status(400).json({ success: false, message: "Data pelamar tidak lengkap." });
      }

      // Pastikan semua nilai undefined diubah menjadi null
      const safeValues = {
          user_id: user_id || null,
          job_id: job_id || null,
          name: name || null,
          email: email || null,
          phone: phone || null,
          address: address || null,
          linkedin: linkedin || null,
          expectedSalary: expectedSalary || null,
          education: education || null,
          experience: experience || null,
          message: message || null,
          resume_path: req.files?.resume?.[0]?.path || null,
          photo_path: req.files?.photo?.[0]?.path || null,
          applied_at: new Date()
      };

      // Cek apakah user sudah melamar pekerjaan yang sama
      const [existingApplication] = await pool.execute(
          `SELECT id FROM applications WHERE user_id = ? AND job_id = ?`,
          [safeValues.user_id, safeValues.job_id]
      );

      if (existingApplication.length > 0) {
          return res.status(400).json({ success: false, message: "Anda sudah melamar pekerjaan ini sebelumnya." });
      }

      // Simpan lamaran ke database
      await pool.execute(
          `INSERT INTO applications 
          (user_id, job_id, name, email, phone, address, linkedin, expected_salary, education, experience, message, resume_path, photo_path, applied_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
              safeValues.user_id, safeValues.job_id, safeValues.name, safeValues.email,
              safeValues.phone, safeValues.address, safeValues.linkedin,
              safeValues.expectedSalary, safeValues.education, safeValues.experience,
              safeValues.message, safeValues.resume_path, safeValues.photo_path,
              safeValues.applied_at
          ]
      );

      // Buat PDF jika perlu
      let pdfBuffer = null;
      try {
          pdfBuffer = await createPDF({ name: safeValues.name, email: safeValues.email, job_id: safeValues.job_id }, "accepted");
      } catch (pdfError) {
          console.error("⚠ Gagal membuat PDF:", pdfError);
      }

      // Kirim respons sukses
      res.status(201).json({ success: true, message: "Lamaran berhasil dikirim!", offerLetter: pdfBuffer });

  } catch (error) {
      console.error("⛔ Error saat mengirim lamaran:", error);
      res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
  }
};

// ✅ Mendapatkan semua lamaran
const getApplicationsHandler = async (req, res) => {
  try {
    const [applications] = await pool.execute("SELECT * FROM applications");
    console.log("📄 Mengambil semua lamaran:", applications.length);
    res.json({ success: true, applications });
  } catch (error) {
    console.error("⛔ Error:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

// ✅ Mengupdate status pelamar
const updateApplicationStatusHandler = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
  
    try {
      // Perbarui status pelamar di database
      const [updateResult] = await pool.execute(
        "UPDATE applications SET status = ?, status_updated_at = NOW() WHERE id = ?",
        [status, id]
      );
  
      if (updateResult.affectedRows === 0) {
        console.warn("⚠️ Gagal memperbarui status, ID tidak ditemukan.");
        return res.status(400).json({ success: false, message: "Gagal memperbarui status." });
      }
  
      console.log(`✅ Status pelamar ID ${id} diperbarui menjadi ${status}`);
  
      // **AMBIL DATA PELAMAR UNTUK NOTIFIKASI**
      const [applicantResult] = await pool.execute(
        "SELECT id, user_id, name, email, job_id FROM applications WHERE id = ?",
        [id]
      );
  
      if (applicantResult.length === 0) {
        console.error("❌ Pelamar tidak ditemukan setelah update.");
        return res.status(404).json({ success: false, message: "Pelamar tidak ditemukan." });
      }
  
      const applicant = applicantResult[0];
      const user_id = applicant.user_id;
  
      console.log(`📩 Menambahkan notifikasi untuk user_id ${user_id}`);
  
      const message =
        status === "accepted" ? "Selamat! Lamaran Anda diterima." : "Maaf, lamaran Anda ditolak.";
      const createdAt = new Date();
  
      let pdfFilePath = null;
  
      // **Jika diterima, buat PDF dan simpan**
      if (status === "accepted") {
        try {
            const pdfBuffer = await createPDF(applicant, status);
            pdfFilePath = `uploads/offer_${applicant.name.replace(/\s+/g, "_")}_${Date.now()}.pdf`; // ✅ Ubah ini agar tersimpan ke database
            fs.writeFileSync(pdfFilePath, pdfBuffer);
            console.log('✅ PDF berhasil disimpan di:', pdfFilePath);
        } catch (error) {
            console.error("❌ Gagal membuat PDF:", error);
            return res.status(500).json({ success: false, message: "Gagal membuat PDF." });
        }
    }

      // **SIMPAN NOTIFIKASI KE DATABASE**
      const [insertNotification] = await pool.execute(
        "INSERT INTO notifications (user_id, message, status, file, created_at) VALUES (?, ?, 'unread', ?, ?)",
        [user_id, message, pdfFilePath, createdAt]
    );
    
  
      if (insertNotification.affectedRows === 0) {
        console.error("❌ Gagal menyimpan notifikasi ke database.");
        return res.status(500).json({ success: false, message: "Gagal menyimpan notifikasi." });
      }
  
      console.log(`✅ Notifikasi berhasil disimpan untuk user_id ${user_id}`);
  
      res.json({ success: true, message: "Status berhasil diperbarui & notifikasi dikirim." });
    } catch (error) {
      console.error("⛔ Error update status & simpan notifikasi:", error);
      res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
    }
  };
   

// ✅ Mendapatkan jumlah pelamar untuk setiap pekerjaan
const getJumlahPelamar = async (req, res) => {
  try {
    const [results] = await pool.execute(`SELECT job_id, COUNT(*) as jumlah_pelamar FROM applications GROUP BY job_id`);
    console.log("📊 Jumlah pelamar:", results);
    res.json({ success: true, jobs: results });
  } catch (error) {
    console.error("⛔ Error mendapatkan jumlah pelamar:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

// ✅ Mendapatkan riwayat pelamar berdasarkan pekerjaan
const getRiwayatPelamar = async (req, res) => {
  try {
    const [history] = await pool.execute(`
      SELECT a.job_id,
             j.title AS job_title,  -- Ambil job title dari tabel jobs
             SUM(CASE WHEN a.status = 'accepted' THEN 1 ELSE 0 END) AS accepted_count,
             SUM(CASE WHEN a.status = 'rejected' THEN 1 ELSE 0 END) AS rejected_count,
             MAX(a.status_updated_at) AS last_updated
      FROM applications a
      JOIN jobs j ON a.job_id = j.id  -- Gabungkan tabel applications dengan jobs
      WHERE a.status IN ('accepted', 'rejected')
      GROUP BY a.job_id, j.title
    `);

    console.log("📄 Riwayat pelamar ditemukan:", history.length);
    res.json({ success: true, history });
  } catch (error) {
    console.error("⛔ Error mendapatkan riwayat pelamar:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};


// ✅ Mendapatkan daftar pelamar berdasarkan pekerjaan
const getDaftarPelamar = async (req, res) => {
  const { job_id } = req.params;
  try {
    const [result] = await pool.execute("SELECT id, name, status FROM applications WHERE job_id = ?", [job_id]);
    console.log(`📄 Daftar pelamar untuk job_id ${job_id}:`, result);
    res.json({ success: true, applicants: result });
  } catch (error) {
    console.error("⛔ Error mendapatkan daftar pelamar:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
  }
};

// ✅ Mendapatkan detail pelamar berdasarkan ID aplikasi
const getDetailPelamar = async (req, res) => {
    const { application_id } = req.params;
    try {
      const [result] = await pool.execute(
        `SELECT a.*, u.email AS accountEmail FROM applications a
         JOIN users u ON a.user_id = u.id WHERE a.id = ?`,
        [application_id]
      );
  
      if (result.length === 0) {
        return res.status(404).json({ success: false, message: "Pelamar tidak ditemukan." });
      }
  
      console.log(`📄 Detail pelamar ID ${application_id} ditemukan.`);
      res.json({ success: true, applicant: result[0] });
    } catch (error) {
      console.error("⛔ Error mendapatkan detail pelamar:", error);
      res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
    }
  };
  
  // ✅ Mendapatkan semua notifikasi untuk user yang sedang login
  const getUserNotifications = async (req, res) => {
    try {
      const user_id = req.user.id;
      const [notifications] = await pool.execute(
        "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
        [user_id]
      );
  
      console.log("📩 Notifikasi yang dikirim ke frontend:", notifications); // ✅ Tambahkan log ini

      res.json({ success: true, notifications });
    } catch (error) {
      console.error("⛔ Error mendapatkan notifikasi:", error);
      res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
    }
  };
  
  // ✅ Menghapus notifikasi berdasarkan ID
  const deleteNotification = async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await pool.execute("DELETE FROM notifications WHERE id = ?", [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Notifikasi tidak ditemukan." });
      }
  
      res.json({ success: true, message: "Notifikasi berhasil dihapus." });
    } catch (error) {
      console.error("⛔ Error menghapus notifikasi:", error);
      res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
    }
  };
  

// ✅ Menandai notifikasi sebagai "dibaca"
const markNotificationAsRead = async (req, res) => {
    const { id } = req.params;
    try {
      await pool.execute("UPDATE notifications SET status = 'read' WHERE id = ?", [id]);
  
      res.json({ success: true, message: "Notifikasi ditandai sebagai dibaca." });
    } catch (error) {
      console.error("⛔ Error menandai notifikasi:", error);
      res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
    }
  };
  

// ✅ Menandai notifikasi sebagai "belum dibaca"
const markNotificationAsUnread = async (req, res) => {
    const { id } = req.params;
    try {
      await pool.execute("UPDATE notifications SET status = 'unread' WHERE id = ?", [id]);
  
      res.json({ success: true, message: "Notifikasi ditandai sebagai belum dibaca." });
    } catch (error) {
      console.error("⛔ Error menandai notifikasi:", error);
      res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
    }
  };

const getApplicantsByStatus = async (req, res) => {
    const { job_id, status } = req.params;
  
    try {
      // Pastikan status hanya "accepted" atau "rejected"
      if (status !== "accepted" && status !== "rejected") {
        return res.status(400).json({ success: false, message: "Status tidak valid." });
      }
  
      const [applicants] = await pool.execute(
        `SELECT id, name, status, status_updated_at 
         FROM applications 
         WHERE job_id = ? AND status = ?
         ORDER BY status_updated_at DESC`,
        [job_id, status]
      );
  
      if (applicants.length === 0) {
        console.log(`⚠️ Tidak ada pelamar dengan status ${status} untuk job_id ${job_id}.`);
        return res.status(404).json({ success: false, message: "Tidak ada pelamar untuk status ini." });
      }
  
      console.log(`✅ ${applicants.length} pelamar ditemukan untuk job_id ${job_id} dengan status ${status}.`);
      res.json({ success: true, applicants });
    } catch (error) {
      console.error("⛔ Error mendapatkan detail riwayat pelamar:", error);
      res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
    }
  };

  const deleteApplicant = async (req, res) => {
    const { id } = req.params;
  
    try {
      const [result] = await pool.execute("DELETE FROM applications WHERE id = ?", [id]);
  
      if (result.affectedRows === 0) {
        console.log(`⚠️ Pelamar dengan ID ${id} tidak ditemukan.`);
        return res.status(404).json({ success: false, message: "Pelamar tidak ditemukan." });
      }
  
      console.log(`🗑️ Pelamar ID ${id} berhasil dihapus.`);
      res.json({ success: true, message: "Pelamar berhasil dihapus." });
    } catch (error) {
      console.error("⛔ Error menghapus pelamar:", error);
      res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
    }
  };


// ✅ Ekspor semua fungsi agar tetap tersedia
module.exports = { 
    submitApplicationHandler, 
    getApplicationsHandler, 
    updateApplicationStatusHandler, 
    getJumlahPelamar, 
    getRiwayatPelamar, 
    getDaftarPelamar, 
    getDetailPelamar, 
    getUserNotifications, 
    deleteNotification, 
    markNotificationAsRead, 
    markNotificationAsUnread,
    getApplicantsByStatus,
    deleteApplicant
  };