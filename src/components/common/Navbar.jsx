import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert
import LogoImage from "../../assets/Logo.png";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  
  // URL API yang konsisten
  const API_URL = "http://localhost:3000/api";

  // Memeriksa status login dan mengambil notifikasi
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (token && storedUser) {
      setIsLoggedIn(true);
      setUserData(storedUser);
      if (storedUser.role === "user") {
        fetchNotifications();
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Mengambil notifikasi ulang ketika kembali ke halaman ini
  useEffect(() => {
    if (isLoggedIn && user?.role === "user") {
      fetchNotifications();
    }
  }, [location.pathname]);

  // Fungsi untuk mengambil notifikasi yang bisa dipanggil dari komponen lain
  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/applications/notifications`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Filter notifikasi yang belum dibaca
        const unreadNotifications = data.notifications.filter(
          (notif) => notif.status === "unread"
        );
        // Set jumlah notifikasi yang belum dibaca
        setUnreadCount(unreadNotifications.length);
      } else {
        console.error("Gagal mengambil notifikasi");
      }
    } catch (error) {
      console.error("Error mengambil notifikasi:", error);
    }
  };

  // Membuat fungsi fetchNotifications tersedia secara global
  // Ini memungkinkan komponen Notifikasi untuk memicu refresh
  window.refreshNotificationCount = fetchNotifications;

  const handleLogout = () => {
    // Tampilkan konfirmasi logout dengan SweetAlert
    Swal.fire({
      title: 'Konfirmasi Logout',
      text: "Apakah Anda yakin ingin keluar dari sistem?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Logout!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        // Jika user mengkonfirmasi, lakukan proses logout
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUserData(null);
        
        // Tampilkan pesan sukses logout
        Swal.fire({
          icon: 'success',
          title: 'Logout Berhasil',
          text: 'Anda telah keluar dari sistem.',
          timer: 2000, // Otomatis tutup setelah 2 detik
          showConfirmButton: false
        });
        
        navigate("/");
      }
    });
  };

  return (
    <div className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-2">
        <a href="/" className="flex items-center">
          <img src={LogoImage} alt="Logo" className="w-28" />
        </a>

        <div className="flex gap-2">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="bg-blue-400 text-white font-bold px-4 py-2 rounded-md hover:bg-blue-500 transition"
                style={{ width: "100px", textAlign: "center" }}
              >
                SIGN IN
              </Link>
              <Link
                to="/register"
                className="bg-blue-700 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-900 transition"
                style={{ width: "100px", textAlign: "center" }}
              >
                SIGN UP
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-red-600 transition"
                style={{ width: "100px", textAlign: "center" }}
              >
                LOGOUT
              </button>

              {user?.role === "user" && (
                <button
                  onClick={() => navigate("/notifikasi")}
                  className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition relative"
                  style={{ width: "120px", textAlign: "center" }}
                >
                  NOTIFIKASI
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;