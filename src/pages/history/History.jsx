import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Footer from "@/components/common/Footer";

const History = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
  
        if (!token) {
          Swal.fire({
            icon: "error",
            title: "Token tidak ditemukan",
            text: "Harap login kembali untuk melanjutkan!",
          });
          return;
        }
  
        const response = await fetch("http://localhost:3000/api/applications/history", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!response.ok) {
          throw new Error("Gagal mengambil riwayat pelamar");
        }
  
        const data = await response.json();
        console.log("Riwayat pelamar:", data);  // Debug log untuk memeriksa data
        if (data.success) {
          setHistory(data.history);
        } else {
          console.error("Error fetching history:", data.message);
        }
      } catch (error) {
        console.error("Error fetching history:", error.message);
      }
    };
  
    fetchHistory();
  }, []);
  

  return (
    <>
    <div className="container mx-auto mt-10 mb-44">
      <h2 className="text-2xl font-semibold mb-4">Riwayat Pelamar</h2>
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-blue-500">
              <th className="px-4 py-2 text-center text-white font-semibold">No</th>
              <th className="px-4 py-2 text-center text-white font-semibold">Nama Pekerjaan</th>
              <th className="px-4 py-2 text-center text-white font-semibold">Diterima</th>
              <th className="px-4 py-2 text-center text-white font-semibold">Ditolak</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((item, index) => (
                <tr key={item.job_id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  <td className="border px-4 py-2 text-center">{item.job_title || "Unknown"}</td>
                  <td
                    className="border px-4 py-2 text-green-500 cursor-pointer text-center"
                    onClick={() => navigate(`/history/${item.job_id}/accepted`)}
                    >
                    {item.accepted_count}
                  </td>
                  <td
                    className="border px-4 py-2 text-red-500 cursor-pointer text-center"
                    onClick={() => navigate(`/history/${item.job_id}/rejected`)}
                    >
                    {item.rejected_count}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-2">
                  Tidak ada riwayat pelamar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default History;
