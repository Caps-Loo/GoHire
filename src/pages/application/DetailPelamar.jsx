import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Footer from "../../components/common/Footer";

const DetailPelamar = () => {
  const { applicant_id } = useParams();
  const [applicant, setApplicant] = useState(null);

  useEffect(() => {
    const fetchApplicantDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/applications/detail-pelamar/${applicant_id}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data pelamar");
        }

        const data = await response.json();
        if (data.success) {
          setApplicant(data.applicant);
        } else {
          console.error("Error fetching applicant details:", data.message);
        }
      } catch (error) {
        console.error("Error fetching applicant details:", error);
      }
    };

    fetchApplicantDetails();
  }, [applicant_id]);

  if (!applicant) {
    return <p>Loading...</p>;
  }

  return (
    <>
    <div className="container mx-auto mt-8 mb-10 px-6">
      <h2 className="text-2xl font-semibold mb-6">
        Detail Pelamar {applicant.name}
      </h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-2">Field</th>
              <th className="px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-semibold">Email Akun</td>
              <td className="border px-4 py-2">{applicant.accountEmail}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Email Pelamar</td>
              <td className="border px-4 py-2">{applicant.email}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Phone</td>
              <td className="border px-4 py-2">{applicant.phone}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Address</td>
              <td className="border px-4 py-2">{applicant.address}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Education</td>
              <td className="border px-4 py-2">{applicant.education}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">LinkedIn</td>
              <td className="border px-4 py-2">
                <a href={applicant.linkedin} target="_blank" rel="noopener noreferrer">
                  {applicant.linkedin}
                </a>
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Foto</td>
              <td className="border px-4 py-2">
                <a
                  href={`http://localhost:3000/${applicant.photo_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                  >
                  Lihat Foto
                </a>
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">CV</td>
              <td className="border px-4 py-2">
                <a
                  href={`http://localhost:3000/${applicant.resume_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                  >
                  Lihat CV
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default DetailPelamar;