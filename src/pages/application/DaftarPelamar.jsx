import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Footer from "../../components/common/Footer";

const DaftarPelamar = () => {
  const { job_id } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const navigate = useNavigate();

  // Fungsi untuk mengupdate status pelamar
  const handleStatusChange = async (applicantId, status) => {
    const confirmResult = await Swal.fire({
      title: `Apakah Anda yakin ingin ${status === "accepted" ? "menerima" : "menolak"} pelamar ini?`,
      text: "Aksi ini tidak dapat dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: status === "accepted" ? "#28a745" : "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Iya",
      cancelButtonText: "Batal",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/applications/${applicantId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire("Berhasil!", `Pelamar telah ${status === "accepted" ? "diterima" : "ditolak"}.`, "success");

        // ✅ Perbarui status pelamar di state tanpa refresh
        setApplicants((prevApplicants) =>
          prevApplicants.map((applicant) =>
            applicant.id === applicantId ? { ...applicant, status } : applicant
          )
        );

      } else {
        Swal.fire("Terjadi kesalahan", data.message, "error");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire("Terjadi kesalahan", "Tidak dapat memperbarui status pelamar", "error");
    }
  };

  const handleDeleteApplicant = async (applicantId) => {
    const confirmResult = await Swal.fire({
      title: "Apakah Anda yakin ingin menghapus pelamar ini?",
      text: "Data akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Iya",
      cancelButtonText: "Batal",
    });
  
    if (!confirmResult.isConfirmed) return;
  
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch(
        `http://localhost:3000/api/applications/${applicantId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const data = await response.json();
  
      if (data.success) {
        Swal.fire("Dihapus!", "Pelamar berhasil dihapus.", "success");
  
        // ✅ Hapus pelamar dari state tanpa refresh
        setApplicants((prevApplicants) =>
          prevApplicants.filter((applicant) => applicant.id !== applicantId)
        );
      } else {
        Swal.fire("Terjadi kesalahan", data.message, "error");
      }
    } catch (error) {
      console.error("Error deleting applicant:", error);
      Swal.fire("Terjadi kesalahan", "Tidak dapat menghapus pelamar", "error");
    }
  };

  useEffect(() => {
    const fetchJobApplicants = async () => {
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
          `http://localhost:3000/api/applications/daftar-pelamar/${job_id}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
    
        if (!response.ok) {
          throw new Error("Gagal mengambil data pelamar");
        }
    
        const data = await response.json();
        console.log("Applicants API response:", data); // Debug log
        
        if (data.success) {
          setApplicants(data.applicants);
        } else {
          console.error("Error fetching applicants:", data.message);
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };
    

    const fetchJobData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3000/api/jobs/${job_id}`, {
          method: "GET",
          headers: { 
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Job API response:", data); // Debug log
          if (data && data.title) {
            setJobTitle(data.title);
            return;
          }
        }
        
        // Fallback ke JSON jika API gagal
        const jsonResponse = await import("@/data/jobData.json");
        const jobData = jsonResponse.default;
        console.log("Job data from JSON:", jobData);

        const numericJobId = Number(job_id);
        const job = jobData.find(job => Number(job.id) === numericJobId);
        
        if (job) {
          setJobTitle(job.title);
        } else {
          setJobTitle(`Job #${job_id}`); // Fallback title
        }
      } catch (error) {
        console.error("Error fetching job data:", error);
        setJobTitle(`Job #${job_id}`); // Fallback title
      }
    };

    fetchJobApplicants(); // Ambil data pelamar
    fetchJobData(); // Ambil data pekerjaan
  }, [job_id]);

  return (
    <>
    <div className="container mx-auto mt-8 mb-28 px-6">
      <h2 className="text-xl font-semibold mb-4">
        Daftar Pelamar Pekerjaan: {jobTitle || `Job #${job_id}`}
      </h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-2 text-center">No</th>
              <th className="px-4 py-2 text-center">Nama</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {applicants.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-2">
                  Tidak ada pelamar untuk pekerjaan ini.
                </td>
              </tr>
            ) : (
              applicants.map((applicant, index) => (
                <tr
                key={applicant.id}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  <td className="border px-4 py-2 text-center">
                    {applicant.name || "Unknown"}
                  </td>
                  <td className="border px-4 py-2 text-center font-semibold">
                    {applicant.status === "accepted"
                      ? "✅ Diterima"
                      : applicant.status === "rejected"
                      ? "❌ Ditolak"
                      : "⏳ Pending"}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
                      onClick={() =>
                        navigate(`/detail-pelamar/${applicant.id}`)
                      }
                      >
                      Lihat Detail
                    </button>
                    <button
                      className={`px-4 py-2 text-white rounded-lg ml-2 ${
                        applicant.status === "accepted" ||
                        applicant.status === "rejected"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 cursor-pointer"
                      }`}
                      onClick={() =>
                        handleStatusChange(applicant.id, "accepted")
                      }
                      disabled={
                        applicant.status === "accepted" ||
                        applicant.status === "rejected"
                      }
                      >
                      Terima
                    </button>
                    <button
                      className={`px-4 py-2 text-white rounded-lg ml-2 ${
                        applicant.status === "accepted" ||
                        applicant.status === "rejected"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600 cursor-pointer"
                      }`}
                      onClick={() =>
                        handleStatusChange(applicant.id, "rejected")
                      }
                      disabled={
                        applicant.status === "accepted" ||
                        applicant.status === "rejected"
                      }
                      >
                      Tolak
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 ml-2"
                      onClick={() => handleDeleteApplicant(applicant.id)}
                      >
                      Hapus
                    </button>
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

export default DaftarPelamar;
