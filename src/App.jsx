import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SearchProvider } from "./context/SearchContext";
import { AuthProvider } from "./context/AuthContext"; 

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboard Pages
import UserDashboard from "./pages/dashboard/UserDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

// Job Pages
import JobDetail from "./pages/job/JobDetail";
import JobApplication from "./pages/job/JobApplication";

// Application Management Pages
import TableLamaran from "./pages/application/TableLamaran";
import DaftarPelamar from "./pages/application/DaftarPelamar";
import DetailPelamar from "./pages/application/DetailPelamar";

// Form Pages
import AddJob from "./pages/form/AddJob";
import EditJob from "./pages/form/EditJob";

// Notification Pages
import Notifikasi from "./pages/notification/Notifikasi";

// History Pages
import History from "./pages/history/History";
import HistoryDetail from "./pages/history/HistoryDetail";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(storedUser);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider>
      <SearchProvider>
        <Router>
          <Routes>
            <Route
              path="/user-dashboard"
              element={user?.role === "user" ? <UserDashboard /> : <Navigate to="/register" />}
            />
            <Route
              path="/admin-dashboard"
              element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/register" />}
            />
            <Route path="/" element={<UserDashboard />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/job-detail/:id" element={<JobDetail />} />
            <Route path="/apply/:id" element={<JobApplication />} />
            <Route
              path="/add-job"
              element={user?.role === "admin" ? <AddJob /> : <Navigate to="/register" />}
            />
            <Route
              path="/edit-job/:id"
              element={user?.role === "admin" ? <EditJob /> : <Navigate to="/register" />}
            />
            <Route path="/table-lamaran" element={<TableLamaran />} />
            <Route path="/daftar-pelamar/:job_id" element={<DaftarPelamar />} />
            <Route path="/notifikasi" element={<Notifikasi />} />
            <Route path="/detail-pelamar/:applicant_id" element={<DetailPelamar />} />
            <Route path="/history" element={<History />} />
            <Route path="/history/:job_id/:status" element={<HistoryDetail />} />
          </Routes>
        </Router>
      </SearchProvider>
    </AuthProvider>
  );
};

export default App;
