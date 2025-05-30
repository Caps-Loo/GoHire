import React, { useEffect, useState, useContext } from "react";
import Navbar from "@/components/common/Navbar";
import Hero from "@/components/home/Hero";
import Job from "@/pages/job/Job";
import Footer from "@/components/common/Footer";
import { SearchContext } from "@/context/SearchContext"; // Import SearchContext

const AdminDashboard = () => {
  const [applications, setApplications] = useState([])
  const { searchTerm, setSearchTerm } = useContext(SearchContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return; // Tidak ada token, redirect ke login
    }

    fetch("http://localhost:3000/api/applications", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Pastikan token dikirim
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.applications) {
            setApplications(data.applications);
          } else {
            console.error("No applications found");
          }
        })
        .catch((err) => {
          console.error("Error fetching applications:", err);
        });
    }, []);

  const updateStatus = (id, status) => {
    fetch(`http://localhost:3000/api/applications/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((updatedApp) => {
        setApplications((prevApplications) =>
          prevApplications.map((app) =>
            app.id === id ? { ...app, status: updatedApp.status } : app
          )
        );
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Navbar />
      <Hero />
      <Job searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Footer/>
    </>
  );
};

export default AdminDashboard;
