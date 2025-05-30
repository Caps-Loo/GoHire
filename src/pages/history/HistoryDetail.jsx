import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Footer from "@/components/common/Footer";

const HistoryDetail = () => {
  const { job_id, status } = useParams(); // Ambil job_id dan status dari URL
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    const fetchApplicants = async () => {
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

        const response = await fetch(
          `http://localhost:3000/api/applications/history/${job_id}/${status}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data pelamar.");
        }

        const data = await response.json();
        if (data.success) {
          setApplicants(data.applicants);
        } else {
          console.error("Error fetching applicants:", data.message);
        }
      } catch (error) {
        console.error("Error fetching applicants:", error.message);
      }
    };

    fetchApplicants();
  }, [job_id, status]);

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "Belum diperbarui";
    const date = new Date(dateString);
    return isNaN(date) ? "Invalid Date" : date.toLocaleString(); // Format tanggal lokal
  };

  return (
    <>
    <div className="container mx-auto mt-10 mb-44">
      <h2 className="text-2xl font-semibold mb-4">
        Riwayat Pelamar: {jobTitle} (
        {status === "accepted" ? "Diterima" : "Ditolak"})
      </h2>
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-blue-500">
              <th className="px-4 py-2 text-center text-white font-semibold">
                No
              </th>
              <th className="px-4 py-2 text-center text-white font-semibold">
                Nama
              </th>
              <th className="px-4 py-2 text-center text-white font-semibold">
                Waktu
              </th>
            </tr>
          </thead>
          <tbody>
            {applicants.length > 0 ? (
              applicants.map((applicant, index) => (
                <tr
                key={applicant.id}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  <td className="border px-4 py-2 text-center">{applicant.name}</td>
                  <td className="border px-4 py-2 text-center">
                    {formatDate(applicant.status_updated_at)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-2">
                  Tidak ada pelamar dengan status ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default HistoryDetail;
