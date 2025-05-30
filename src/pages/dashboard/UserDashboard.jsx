// src/pages/Home.jsx
import React, { useContext } from "react";
import Navbar from "@/components/common/Navbar";
import Hero from "@/components/home/Hero";
import Job from "@/pages/job/Job";
import Footer from "@/components/common/Footer";
import ReviewCarousel from "@/components/home/ReviewCarousel";
import { SearchContext } from "@/context/SearchContext"; 

const UserDashboard = () => {
  const { searchTerm, setSearchTerm } = useContext(SearchContext);

  return (
    <>
      <Navbar />
      <Hero />
      <Job searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> 
      <ReviewCarousel />
      <Footer/>
    </>
  );
};

export default UserDashboard;
