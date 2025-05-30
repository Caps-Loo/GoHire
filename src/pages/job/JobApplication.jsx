import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/common/Navbar";
import ApplicationForm from "@/components/common/ApplicationForm"; // Form Lamaran
import Footer from "@/components/common/Footer";

const JobApplication = () => {
  const { id } = useParams(); // Ambil ID pekerjaan dari URL
  const [job, setJob] = useState(null); // State untuk menyimpan data pekerjaan
  const [loading, setLoading] = useState(true); // State untuk loading

  // Fetch data pekerjaan dari API berdasarkan ID
  useEffect(() => {
    const fetchJobDetail = async () => {
      const token = localStorage.getItem("token");
      setLoading(true);
      
      try {
        const response = await fetch(`http://localhost:3000/api/jobs/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setJob(data);
        } else {
          console.error("Failed to fetch job details");
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobDetail();
  }, [id]);

  // Tampilkan loading selama fetch data
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      </>
    );
  }

  // Tampilkan pesan jika pekerjaan tidak ditemukan
  if (!job) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-2xl font-bold text-red-500">Job not found!</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Lamar Pekerjaan</h1>

        {/* Detail Pekerjaan */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold">{job.title}</h2>
          <p className="text-gray-600">PT. GOHire</p>
          <p className="text-gray-500">Jakarta Selatan</p>
          <p className="text-green-600 font-medium">{job.salary}</p>
        </div>

        {/* Form Lamaran */}
        <ApplicationForm jobTitle={job.title} jobId={job.id}/>
      </div>
      <Footer/>
      </>
  );
};

export default JobApplication;