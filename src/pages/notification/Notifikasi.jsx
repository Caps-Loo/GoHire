import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Footer from "@/components/common/footer";

const Notifikasi = () => {
  const [notifications, setNotifications] = useState([]);

  // Gunakan URL API yang konsisten (sama dengan Navbar)
  const API_URL = "http://localhost:3000/api";

  // Ambil notifikasi saat komponen dimuat
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Tidak perlu menampilkan error popup jika token tidak ada
      return;
    }

    try {
      const response = await fetch(`${API_URL}/applications/notifications`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        // Tidak perlu menampilkan error popup jika ada error fetch
        return;
      }

      const data = await response.json();
      setNotifications(data.notifications); // Set notifikasi yang diterima
    } catch (error) {
      console.error("Error mengambil notifikasi:", error);
    }
  };

  // Fungsi untuk menghapus notifikasi
  const handleDeleteNotification = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Token tidak ditemukan",
        text: "Harap login kembali untuk menghapus notifikasi!",
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/applications/notifications/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setNotifications(notifications.filter((notif) => notif.id !== id)); // Hapus notifikasi dari UI

        // Perbarui penghitung notifikasi di Navbar
        if (window.refreshNotificationCount) {
          window.refreshNotificationCount();
        }

        Swal.fire("Dihapus!", "Notifikasi berhasil dihapus.", "success");
      } else {
        Swal.fire(
          "Gagal!",
          data.message || "Terjadi kesalahan saat menghapus notifikasi.",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Error!", "Gagal menghapus notifikasi.", "error");
    }
  };

  // Fungsi untuk menandai notifikasi sebagai dibaca
  const handleMarkAsRead = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Token tidak ditemukan",
        text: "Harap login kembali untuk menandai notifikasi!",
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/applications/notifications/${id}/read`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update status UI menjadi "read"
        setNotifications(
          notifications.map((notif) =>
            notif.id === id ? { ...notif, status: "read" } : notif
          )
        );

        // Perbarui penghitung notifikasi di Navbar setelah status berubah
        if (window.refreshNotificationCount) {
          window.refreshNotificationCount();
        }

        Swal.fire(
          "Sukses!",
          "Notifikasi berhasil ditandai sebagai dibaca.",
          "success"
        );
      } else {
        Swal.fire("Gagal!", data.message || "Terjadi kesalahan", "error");
      }
    } catch (error) {
      Swal.fire("Error!", "Gagal menandai notifikasi.", "error");
    }
  };

  // Fungsi untuk menandai notifikasi sebagai belum dibaca
  const handleMarkAsUnread = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Token tidak ditemukan",
        text: "Harap login kembali untuk menandai notifikasi!",
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/applications/notifications/${id}/unread`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update status UI menjadi "unread"
        setNotifications(
          notifications.map((notif) =>
            notif.id === id ? { ...notif, status: "unread" } : notif
          )
        );

        // Perbarui penghitung notifikasi di Navbar setelah status berubah
        if (window.refreshNotificationCount) {
          window.refreshNotificationCount();
        }

        Swal.fire(
          "Sukses!",
          "Notifikasi berhasil ditandai sebagai belum dibaca.",
          "success"
        );
      } else {
        Swal.fire("Gagal!", data.message || "Terjadi kesalahan", "error");
      }
    } catch (error) {
      Swal.fire("Error!", "Gagal menandai notifikasi.", "error");
    }
  };

  return (
    <>
      <div className="container mx-auto p-4 my-36">
        <h2 className="text-xl font-bold mb-4">Notifikasi</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Pesan</th>
                <th className="px-4 py-2 text-center">Tanggal</th>
                <th className="px-4 py-2 text-center">Status</th>
                <th className="px-4 py-2 text-center">File</th>
                <th className="px-4 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {notifications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-2">
                    Tidak ada notifikasi
                  </td>
                </tr>
              ) : (
                notifications.map((notif) => (
                  <tr key={notif.id} className="border-b">
                    {/* Kolom Pesan */}
                    <td className="px-4 py-2">{notif.message}</td>

                    {/* Kolom Tanggal */}
                    <td className="px-4 py-2 text-center">
                      {new Date(notif.created_at).toLocaleString()}
                    </td>

                    {/* Kolom Status */}
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`px-4 py-1 rounded-md ${
                          notif.status === "unread"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {notif.status}
                      </span>
                    </td>

                    {/* Kolom File PDF (Hanya jika ada) */}
                    <td className="px-4 py-2 text-center">
                      {notif.file ? (
                        <a
                          href={`${API_URL.split("/api")[0]}/${notif.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          Unduh PDF
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* Kolom Aksi (Hapus + Tandai Baca/Belum Baca) */}
                    <td className="px-4 py-2 text-center">
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => handleDeleteNotification(notif.id)}
                      >
                        Hapus
                      </button>

                      {notif.status === "unread" ? (
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 ml-2"
                          onClick={() => handleMarkAsRead(notif.id)}
                        >
                          Tandai Telah Dibaca
                        </button>
                      ) : (
                        <button
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 ml-2"
                          onClick={() => handleMarkAsUnread(notif.id)}
                        >
                          Batalkan Tandai
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Notifikasi;
