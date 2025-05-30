import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Footer from "../../components/common/Footer";

const TableLamaran = () => {
  const [jobs, setJobs] = useState([]);
  const [jobData, setJobData] = useState([]); // Data pekerjaan untuk pencocokan
  const navigate = useNavigate();

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
          "http://localhost:3000/api/applications/jumlah-pelamar",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data jumlah pelamar");
        }

        const data = await response.json();
        console.log("API Response for Job Applicants:", data); // Debug log

        if (data.success) {
          setJobs(data.jobs);
        } else {
          console.error("Error fetching applicants:", data.message);
        }
      } catch (error) {
        console.error("Error fetching applicants:", error.message);
      }
    };

    const fetchJobData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/jobs", {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data pekerjaan");
        }

        const data = await response.json();
        console.log("Job Data:", data); // Debug log
        setJobData(data); // Set data pekerjaan
      } catch (error) {
        console.error("Error fetching job data:", error);
      }
    };

    fetchJobApplicants();
    fetchJobData();
  }, []);

  // Menambahkan job_title berdasarkan job_id
  const jobsWithNames = jobs.map((job) => {
    const jobDetails = jobData.find((item) => item.id === job.job_id);
    console.log("Job details for row:", jobDetails); // Debug log
    return {
      ...job,
      jobTitle: jobDetails ? jobDetails.title : "Unknown", // Menambahkan job_title
    };
  });

  return (
    <>
    <div className="container mx-auto mt-8 mb-32">
      <h2 className="text-xl font-semibold mb-4">
        Daftar Jumlah Pelamar
      </h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-2 text-center">No</th>
              <th className="px-4 py-2 text-center">Nama</th>
              <th className="px-4 py-2 text-center">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {jobsWithNames.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-2">
                  Tidak ada data pelamar.
                </td>
              </tr>
            ) : (
              jobsWithNames.map((job, index) => (
                <tr
                key={job.job_id}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                onClick={() => navigate(`/daftar-pelamar/${job.job_id}`)}
                style={{ cursor: "pointer" }}
                >
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  <td className="border px-4 py-2">{job.jobTitle}</td>
                  <td className="border px-4 py-2 text-center">
                    {job.jumlah_pelamar}
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

export default TableLamaran;
