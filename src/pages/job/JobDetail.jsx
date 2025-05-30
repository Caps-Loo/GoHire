import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/common/Navbar";
import Footer from "../../components/common/Footer";

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Cek status login
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Ambil detail pekerjaan
  useEffect(() => {
    const fetchJobDetail = async () => {
      const token = localStorage.getItem("token");
      setLoading(true);

      try {
        const response = await fetch(`http://localhost:3000/api/jobs/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          // Proses data untuk memastikan tanggung jawab, keahlian, dan kualifikasi terformat dengan benar
          // Fungsi helper untuk memproses data array dan objek
          const processItem = (item) => {
            if (!item) return "";
            if (typeof item === "string") return item;
            if (typeof item === "object" && item !== null) {
              // Ekstrak nilai dari berbagai kemungkinan properti
              return (
                item.tag ||
                item.skill ||
                item.responsibility ||
                item.qualification ||
                item.name ||
                item.value ||
                JSON.stringify(item).replace(/[{}"]/g, "")
              );
            }
            return String(item);
          };

          // Proses data
          const processedData = {
            ...data,
            responsibilities: Array.isArray(data.responsibilities)
              ? data.responsibilities.map(processItem)
              : [],
            skills: Array.isArray(data.skills)
              ? data.skills.map(processItem)
              : [],
            qualifications: Array.isArray(data.qualifications)
              ? data.qualifications.map(processItem)
              : [],
            tags: Array.isArray(data.tags) ? data.tags.map(processItem) : [],
          };

          setJob(processedData);
        } else {
          console.error("Gagal mengambil detail pekerjaan");
        }
      } catch (error) {
        console.error("Error saat mengambil detail pekerjaan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id]);

  // Handler untuk melamar pekerjaan
  const handleApply = () => {
    if (!isLoggedIn) {
      setIsModalOpen(true);
    } else {
      navigate(`/apply/${job.id}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl">Memuat...</div>
        </div>
      </>
    );
  }

  // Job not found state
  if (!job) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-2xl font-bold text-red-500">
            Pekerjaan tidak ditemukan!
          </h2>
          <button
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            onClick={() => navigate("/")}
          >
            Kembali ke Beranda
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex space-x-6">
          {/* Kartu Kiri - Ringkasan Pekerjaan */}
          <div className="w-1/3 bg-slate-200 shadow-lg rounded-lg p-6 border">
            <h2 className="text-2xl font-bold mb-4">
              {job.title || "Tidak ada judul"}
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                Jakarta Selatan
              </div>

              <div className="flex items-center text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15a24.98 24.98 0 01-8-1.308z" />
                </svg>
                {job.type || "Tipe tidak tersedia"}
              </div>

              <div className="flex items-center text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                {job.jobLevel || job.job_level || "Level tidak tersedia"}
              </div>

              <div className="flex items-center text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5 7.885V10c0 .568.202 1.107.556 1.595C5.258 12.852 6.264 13.5 7 13.5c.736 0 1.742-.648 1.444-1.905A2.232 2.232 0 019 10V7.884l2.394-1.002a1 1 0 000-1.838l-7-3zm0 8.772l-4.394-1.861l4.394 2.957l4.394-2.957L10.394 10.85zm0 1.876l-4.394-2.27v2.177c0 .342.078.68.23.986l3.543 7.008a1 1 0 001.822 0l3.542-7.008a2.43 2.43 0 00.23-.986V8.706l-4.394 2.02z" />
                </svg>
                {job.education || "Pendidikan tidak tersedia"}
              </div>

              <div className="flex items-center text-green-600 font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8s.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582s-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.498 1.32c.682.777 1.639 1.228 2.641 1.285V14a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 9.766 14 8.991 14 8c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 5.092V4a1 1 0 10-2 0v.092z"
                    clipRule="evenodd"
                  />
                </svg>
                {job.salary || "Gaji tidak tersedia"}
              </div>
            </div>
            <button
              className="w-full px-4 py-3 bg-blue-950 text-white rounded-lg hover:bg-blue-400 transition duration-300 mt-36"
              onClick={handleApply}
            >
              Lamar Pekerjaan
            </button>
          </div>

          {/* Kartu Kanan - Detail Pekerjaan */}
          <div className="w-2/3 bg-blue-200 shadow-lg rounded-lg p-6 border">
            <h3 className="text-2xl font-semibold mb-6">
              Tentang pekerjaan ini
            </h3>

            {/* Tanggung Jawab Pekerjaan */}
            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-4">
                Tanggung jawab pekerjaan
              </h4>
              <ul className="list-decimal list-outside pl-5 text-gray-700 space-y-2">
                {job.responsibilities && job.responsibilities.length > 0 ? (
                  job.responsibilities.map((task, index) => (
                    <li key={index}>{task}</li>
                  ))
                ) : (
                  <li>Tidak ada informasi tanggung jawab</li>
                )}
              </ul>
            </div>

            {/* Keahlian */}
            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-4">Keahlian</h4>
              <ul className="list-disc list-outside pl-5 text-gray-700 space-y-2">
                {job.skills && job.skills.length > 0 ? (
                  job.skills.map((skill, index) => <li key={index}>{skill}</li>)
                ) : (
                  <li>Tidak ada informasi keahlian</li>
                )}
              </ul>
            </div>

            {/* Kualifikasi */}
            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-4">Kualifikasi</h4>
              <ul className="list-disc list-outside pl-5 text-gray-700 space-y-2">
                {job.qualifications && job.qualifications.length > 0 ? (
                  job.qualifications.map((qualification, index) => (
                    <li key={index}>{qualification}</li>
                  ))
                ) : (
                  <li>Tidak ada informasi kualifikasi</li>
                )}
              </ul>
            </div>

            {/* Waktu Bekerja */}
            <div>
              <h4 className="text-xl font-semibold mb-4">Waktu Bekerja</h4>
              <p className="text-gray-700">
                {job.workSchedule ||
                  job.work_schedule ||
                  "Tidak ada informasi jadwal"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96 relative">
            <h2 className="text-xl font-bold mb-4">
              Tertarik dengan Loker ini?
            </h2>
            <p className="text-gray-600 mb-6">
              Kamu harus sign in dulu agar bisa menyimpan atau melamar lowongan
              pekerjaan yang kamu inginkan.
            </p>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setIsModalOpen(false)}
              >
                CANCEL
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400"
                onClick={() => navigate("/login")}
              >
                SIGN IN
              </button>
            </div>
          </div>
        </div>
      )}
        <Footer/>
        </>
  );
};

export default JobDetail;
