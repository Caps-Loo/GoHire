// Job.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "@/context/SearchContext";
import JobCard from "@/components/common/JobCard";
import Swal from 'sweetalert2';

const Job = () => {
  const { searchTerm, setSearchTerm, filteredJobs, setFilteredJobs } = useContext(SearchContext);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;
  const [jobs, setJobs] = useState([]); // State untuk menyimpan data pekerjaan
  const [loading, setLoading] = useState(true); // State loading
  const [searchError, setSearchError] = useState(null); // State untuk error pencarian

// Ganti fungsi processTagsInJobs yang ada dengan fungsi ini
const processDataInJobs = (jobsData) => {
  return jobsData.map(job => {
    // Buat salinan job
    const processedJob = { ...job };
    
    // Fungsi pemrosesan objek umum
    const processObjectOrArray = (item) => {
      if (!item) return '';
      if (typeof item === 'string') return item;
      if (Array.isArray(item)) {
        return item.map(el => processObjectOrArray(el));
      }
      if (typeof item === 'object') {
        // Ekstrak nilai dari berbagai kemungkinan properti
        return item.tag || item.skill || item.responsibility || 
               item.qualification || item.name || item.value || 
               JSON.stringify(item).replace(/[{}"]/g, '');
      }
      return String(item);
    };
    
    // Proses semua properti array
    ['tags', 'skills', 'responsibilities', 'qualifications'].forEach(prop => {
      if (job[prop]) {
        processedJob[prop] = processObjectOrArray(job[prop]);
      }
    });
    
    return processedJob;
  });
};

  // Ambil data pekerjaan dari API
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setSearchError(null);
      
      try {
        const token = localStorage.getItem("token");
        // Buat header dengan token jika ada, kosong jika tidak ada
        const headers = token ? { "Authorization": `Bearer ${token}` } : {};
        
        const response = await fetch("http://localhost:3000/api/jobs", {
          method: "GET",
          headers: headers,
        });
    
        if (response.ok) {
          const data = await response.json();
          // Proses tags dalam data
          const processedData = processDataInJobs(data);
          setJobs(processedData);
        } else {
          throw new Error("Gagal mengambil daftar pekerjaan");
        }
      } catch (error) {
        console.error(error);
        setSearchError(error.message || "Terjadi kesalahan saat mengambil pekerjaan");
        Swal.fire({
          title: "Error",
          text: error.message || "Terjadi kesalahan saat mengambil pekerjaan",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);
  
  // Advanced search function
  const advancedSearch = (job, searchTerms) => {
    // Convert search terms to lowercase and split into individual words
    const terms = searchTerms.toLowerCase().split(/\s+/).filter(term => term.length > 0);

    // Define search fields with different weights
    const searchFields = [
      { field: 'title', weight: 3 },
      { field: 'company', weight: 2 },
      { field: 'location', weight: 2 },
      { field: 'type', weight: 1 },
      { field: 'jobLevel', weight: 1 },
      { field: 'salary', weight: 1 }
    ];

    // Track match score
    let matchScore = 0;

    // Check each search term against multiple fields
    terms.forEach(term => {
      searchFields.forEach(({ field, weight }) => {
        // Safely access field value
        const fieldValue = job[field] ? String(job[field]).toLowerCase() : '';
        
        // Exact match or partial match
        if (fieldValue.includes(term)) {
          matchScore += weight;
        }
      });

      // Check tags if they exist
      if (Array.isArray(job.tags)) {
        job.tags.forEach(tag => {
          if (String(tag).toLowerCase().includes(term)) {
            matchScore += 1;
          }
        });
      }
    });

    return matchScore > 0;
  };

  // Apply search and filtering
  useEffect(() => {
    if (!searchTerm) {
      // If search term is empty, show all jobs
      setFilteredJobs(jobs);
      return;
    }

    // Filter jobs based on advanced search
    const filtered = jobs.filter(job => 
      advancedSearch(job, searchTerm)
    );

    setFilteredJobs(filtered);
    setCurrentPage(1); // Reset to first page on new search
  }, [searchTerm, jobs, setFilteredJobs]);

  // Pagination calculations
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Fungsi untuk menghapus pekerjaan
  const handleDeleteJob = async (jobId) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Anda tidak dapat mengembalikan pekerjaan yang dihapus!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`http://localhost:3000/api/jobs/${jobId}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });

          if (response.ok) {
            // Perbarui daftar pekerjaan setelah penghapusan
            setJobs(jobs.filter(job => job.id !== jobId));
            setFilteredJobs(filteredJobs.filter(job => job.id !== jobId));

            Swal.fire(
              'Dihapus!',
              'Pekerjaan berhasil dihapus.',
              'success'
            );
          } else {
            throw new Error("Gagal menghapus pekerjaan");
          }
        } catch (error) {
          console.error("Kesalahan saat menghapus pekerjaan:", error);
          Swal.fire(
            'Gagal!',
            'Terjadi kesalahan saat menghapus pekerjaan.',
            'error'
          );
        }
      }
    });
  };

  return (
    <section className="relative">
      <h1 className="p-8 text-4xl">Lowongan Kerja</h1>

      {/* Search & Admin Actions */}
      <div className="flex justify-between items-center px-8">
        <div className="relative w-full max-w-md">
          <input
            className="w-full text-black bg-gray-100 border border-gray-300 rounded-lg p-4 pl-10 pr-4"
            type="search"
            placeholder="Cari berdasarkan judul, perusahaan, lokasi, tipe pekerjaan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {user?.role === "admin" && (
          <div className="flex gap-4">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              onClick={() => navigate("/history")}
            >
              Riwayat
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              onClick={() => navigate("/add-job")}
            >
              Tambah Lowongan
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              onClick={() => navigate("/table-lamaran")}
            >
              Lihat Lamaran
            </button>
          </div>
        )}
      </div>

      {/* Job Listing */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-8 mt-4">
          {currentJobs.length > 0 ? (
            currentJobs.map((job) => (
              <div key={job.id} className="relative">
                <JobCard
                  title={job.title}
                  salary={job.salary}
                  tags={job.tags || []}
                  onClick={() => navigate(`/job-detail/${job.id}`)}
                />
                {user?.role === "admin" && (
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/edit-job/${job.id}`);
                      }}
                      className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition"
                      title="Edit Pekerjaan"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fillRule="evenodd" d="M2 16V12.5c0-.276.224-.5.5-.5h11c.276 0 .5.224.5.5V16a2 2 0 01-2 2H4a2 2 0 01-2-2z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteJob(job.id);
                      }}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                      title="Hapus Pekerjaan"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center p-8">
              <p className="text-gray-600">
                Tidak ada pekerjaan yang cocok dengan pencarian "{searchTerm}".
              </p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredJobs.length > jobsPerPage && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 border rounded ${
              currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-300"
            }`}
          >
            ←
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 border rounded ${
                currentPage === index + 1 ? "bg-blue-500 text-white" : "hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border rounded ${
              currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-300"
            }`}
          >
            →
          </button>
        </div>
      )}
    </section>
  );
};

export default Job;