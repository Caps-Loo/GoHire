import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Footer from "../../components/common/Footer";

const AddJob = () => {
  const initialFormData = {
    title: "",
    company: "",
    location: "",
    type: "",
    salary: "",
    education: "",
    job_level: "",
    work_schedule: "",
    skills: [""],
    responsibilities: [""],
    qualifications: [""],
    tags: [""],
    companyDetails: {
      industry: "",
      location: "",
      employees: "",
      description: "",
    },
  };

  // Opsi untuk dropdown
  const OPTIONS = {
    jobTypes: [
      { value: "Full Time", label: "Full Time" },
      { value: "Part Time", label: "Part Time" },
      { value: "Freelance", label: "Freelance" },
      { value: "Kontrak", label: "Kontrak" },
      { value: "Magang", label: "Magang" },
    ],
    educationLevels: [
      { value: "SD", label: "SD" },
      { value: "SMP", label: "SMP" },
      { value: "SMA", label: "SMA" },
      { value: "SMK", label: "SMK" },
      { value: "D-1", label: "D-1" },
      { value: "D-2", label: "D-2" },
      { value: "D-3", label: "D-3" },
      { value: "D-4", label: "D-4" },
      { value: "S-1", label: "S-1" },
      { value: "S-2", label: "S-2" },
      { value: "S-3", label: "S-3" },
    ],
    jobLevels: [
      { value: "Junior", label: "Junior" },
      { value: "Senior", label: "Senior" },
      { value: "Entry Level", label: "Entry Level" },
      { value: "Mid Level", label: "Mid Level" },
    ],
  };

  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Validasi bidang wajib
    const requiredFields = [
      "title",
      "type",
      "salary",
      "education",
      "job_level",
      "work_schedule",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${getFieldLabel(field)} wajib diisi`;
      }
    });

    // Validasi array fields
    const arrayFields = [
      "skills",
      "responsibilities",
      "qualifications",
      "tags",
    ];
    arrayFields.forEach((field) => {
      if (
        !formData[field] ||
        formData[field].length === 0 ||
        formData[field].some((item) => !item?.trim())
      ) {
        newErrors[field] = `Minimal satu ${getFieldLabel(field)} harus diisi`;
      }
    });

    // Company details validation removed as company field is no longer in UI

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Mendapatkan label lapangan dalam bahasa Indonesia
  const getFieldLabel = (field) => {
    const labels = {
      title: "Judul Pekerjaan",
      type: "Jenis Pekerjaan",
      salary: "Gaji",
      education: "Pendidikan",
      job_level: "Tingkat Pekerjaan",
      work_schedule: "Waktu Bekerja",
      skills: "Keahlian",
      responsibilities: "Tanggung Jawab",
      qualifications: "Kualifikasi",
      tags: "Tag",
    };
    return labels[field] || field;
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      // Handle nested objects (companyDetails)
      const [parent, child] = name.split(".");
      setFormData((prevData) => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value,
        },
      }));
    } else if (index === undefined || index === null) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: Array.isArray(prevData[name])
          ? prevData[name].map((item, i) => (i === index ? value : item))
          : [],
      }));
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Perbaikan untuk mencegah [object Object]
    const dataToSubmit = {
      ...formData,
      // Kirim array string langsung, bukan objek
      skills: formData.skills.filter((s) => s.trim() !== ""),
      responsibilities: formData.responsibilities.filter(
        (r) => r.trim() !== ""
      ),
      qualifications: formData.qualifications.filter((q) => q.trim() !== ""),
      tags: formData.tags.filter((t) => t.trim() !== ""),
      // Tambahkan properti tambahan jika perlu
      jobLevel: formData.job_level,
      workSchedule: formData.work_schedule,
    };

    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        title: "Error",
        text: "Token tidak tersedia. Silakan login kembali.",
        icon: "error",
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log("Data yang akan dikirim:", dataToSubmit);

      const response = await fetch("http://localhost:3000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (response.status === 403) {
        throw new Error(
          "Anda tidak memiliki izin untuk menambahkan lowongan. Periksa hak akses atau login kembali."
        );
      }

      if (response.ok) {
        Swal.fire({
          title: "Berhasil",
          text: "Lowongan pekerjaan berhasil ditambahkan",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/admin-dashboard");
        });
      } else {
        throw new Error("Gagal menambahkan lowongan. Silakan coba lagi");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Terjadi kesalahan saat mengirimkan lowongan",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Batalkan Tambah?",
      text: "Apakah Anda yakin ingin membatalkan penambahan lowongan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Batalkan",
      cancelButtonText: "Lanjutkan",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/admin-dashboard");
      }
    });
  };

  const handleAddArray = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: [...(prev[name] || []), ""],
    }));
  };

  const handleDeleteArray = (name, index) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].filter((_, i) => i !== index),
    }));
  };

  // Render input dinamis untuk array
  const renderDynamicInput = (name, placeholder) => {
    return formData[name].map((item, index) => (
      <div key={index} className="flex items-center space-x-2 mb-2">
        <input
          type="text"
          name={name}
          value={item}
          onChange={(e) => handleChange(e, index)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
        />
        {index === 0 ? (
          <button
            type="button"
            onClick={() => handleAddArray(name)}
            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleDeleteArray(name, index)}
            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    ));
  };

  // Render loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">
          Tambah Lowongan Pekerjaan
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Informasi Dasar */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Kolom Kiri */}
            <div>
              {/* Judul Pekerjaan */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Judul Pekerjaan
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan judul pekerjaan"
                  />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              {/* Jenis Pekerjaan */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Jenis Pekerjaan
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                  <option value="">Pilih Jenis Pekerjaan</option>
                  {OPTIONS.jobTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                )}
              </div>

              {/* Gaji */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Gaji
                </label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Rp. 5.000.000 - Rp. 7.000.000"
                  />
                {errors.salary && (
                  <p className="text-red-500 text-sm mt-1">{errors.salary}</p>
                )}
              </div>
            </div>

            {/* Kolom Kanan */}
            <div>
              {/* Pendidikan */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Pendidikan
                </label>
                <select
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                  <option value="">Pilih Pendidikan</option>
                  {OPTIONS.educationLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                {errors.education && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.education}
                  </p>
                )}
              </div>

              {/* Tingkat Pekerjaan */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Tingkat Pekerjaan
                </label>
                <select
                  name="job_level"
                  value={formData.job_level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                  <option value="">Pilih Tingkat Pekerjaan</option>
                  {OPTIONS.jobLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                {errors.job_level && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.job_level}
                  </p>
                )}
              </div>

              {/* Jadwal Kerja */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Jadwal Kerja
                </label>
                <input
                  type="text"
                  name="work_schedule"
                  value={formData.work_schedule}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Senin-Jumat"
                  />
                {errors.work_schedule && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.work_schedule}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Company details section removed */}

          {/* Input Dinamis */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* Keahlian */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Keahlian
              </label>
              {renderDynamicInput(
                "skills",
                "Masukkan keahlian yang dibutuhkan"
              )}
              {errors.skills && (
                <p className="text-red-500 text-sm mt-1">{errors.skills}</p>
              )}
            </div>

            {/* Tanggung Jawab */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Tanggung Jawab Pekerjaan
              </label>
              {renderDynamicInput(
                "responsibilities",
                "Masukkan tanggung jawab pekerjaan"
              )}
              {errors.responsibilities && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.responsibilities}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* Kualifikasi */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Kualifikasi
              </label>
              {renderDynamicInput(
                "qualifications",
                "Masukkan kualifikasi yang dibutuhkan"
              )}
              {errors.qualifications && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.qualifications}
                </p>
              )}
            </div>

            {/* Tag */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Tag
              </label>
              {renderDynamicInput("tags", "Masukkan tag untuk pekerjaan")}
              {errors.tags && (
                <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
              )}
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-between mt-8 space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300"
              >
              Batalkan
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 
              disabled:opacity-50 disabled:cursor-not-allowed"
              >
              {isLoading ? "Menyimpan..." : "Tambah Lowongan"}
            </button>
          </div>
        </form>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default AddJob;
