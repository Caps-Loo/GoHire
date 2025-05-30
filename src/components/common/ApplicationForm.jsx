// ApplicationForm.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Import SweetAlert

const ApplicationForm = ({ jobTitle, jobId }) => {
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    expectedSalary: "",
    education: "",
    experience: "",
    message: "",
    resume: null,
    photo: null,
  });

  const [loading, setLoading] = useState(false);

  // Ambil userId dari localStorage jika tersedia
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      setUserId(storedUser.id);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!userId) {
      // SweetAlert untuk user belum login
      Swal.fire({
        icon: 'warning',
        title: 'Login Diperlukan',
        text: 'Anda harus login terlebih dahulu untuk melamar pekerjaan!',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    if (!jobId) {
      // SweetAlert untuk jobId tidak ditemukan
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: 'Job ID tidak ditemukan!',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    setLoading(true);
    
    // Tampilkan loading SweetAlert
    Swal.fire({
      title: 'Sedang Mengirim Lamaran',
      html: 'Mohon tunggu sebentar...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        console.log(`Menambahkan ${key}:`, formData[key]); // Debugging
        data.append(key, formData[key]);
      }
    }
  
    data.append("job_id", jobId);
    data.append("user_id", userId);
  
    try {
      const token = localStorage.getItem("token");
      console.log("Mengirim token:", token); // Debugging token
  
      const response = await fetch("http://localhost:3000/api/applications", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
  
      const result = await response.json();
  
      if (result.success) {
        // Tutup loading dan tampilkan sukses SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Lamaran Anda berhasil dikirim!',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          linkedin: "",
          expectedSalary: "",
          education: "",
          experience: "",
          message: "",
          resume: null,
          photo: null,
        });
      } else {
        // Tutup loading dan tampilkan error SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Gagal Mengirim Lamaran',
          text: `Terjadi kesalahan: ${result.message}`,
          confirmButtonColor: '#d33',
          confirmButtonText: 'OK'
        });
      }
    } catch (err) {
      console.error("Gagal mengirim lamaran:", err);
      
      // Tampilkan error SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Kesalahan Sistem',
        text: 'Gagal mengirim lamaran. Silakan coba lagi nanti.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h3 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Lamar Pekerjaan: <span className="text-gray-800">{jobTitle}</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Nama Lengkap</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Nomor Telepon</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Alamat</label>
            <textarea name="address" value={formData.address} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2" rows="2" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Profil LinkedIn atau Portofolio</label>
            <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Gaji yang Diharapkan (Rp)</label>
            <input type="number" name="expectedSalary" value={formData.expectedSalary} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Pendidikan Terakhir</label>
            <select name="education" value={formData.education} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2">
              <option value="">Pilih Pendidikan</option>
              <option value="SMA">SMA</option>
              <option value="D3">D3</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Upload CV/Resume</label>
            <input type="file" name="resume" onChange={handleFileChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Upload Pas Foto</label>
            <input type="file" name="photo" onChange={handleFileChange} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition" disabled={loading}>
            {loading ? "Mengirim Lamaran..." : "Kirim Lamaran"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;