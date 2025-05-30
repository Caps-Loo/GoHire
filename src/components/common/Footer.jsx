
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/assets/logo.png'; 

const Footer = () => {
  return (
    <footer className="bg-slate-300 text-black py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 px-10">
        
        {/* About Company */}
        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-5">
            <img src={Logo} alt="Go Hire Logo" className="w-28" />
          </div>
          <p className="text-sm leading-relaxed">
            GoHire adalah situs lowongan kerja internal yang mempermudah pencarian pekerjaan
            dan perekrutan karyawan secara efisien.
          </p>
          <p className="text-sm leading-relaxed mt-2">
            Kami berkomitmen untuk membantu pencari kerja menemukan peluang karier terbaik di perusahaan kami.
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col mt-7">
          <h3 className="text-lg font-semibold mb-5">Contact Us</h3>
          <p className="text-sm flex items-center gap-3 mb-2">
            🏢 Jakarta, Indonesia
          </p>
          <p className="text-sm flex items-center gap-3 mb-2">
            📧 info@gohire.com
          </p>
          <p className="text-sm flex items-center gap-3">
            📞 +62 812 3456 7890
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col mt-7">
          <h3 className="text-lg font-semibold mb-5">Quick Links</h3>
          <ul className="text-sm space-y-3">
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 text-center text-sm border-white/20 pt-4">
        &copy; 2025 Go Hire. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
