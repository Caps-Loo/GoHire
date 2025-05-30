-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 30, 2025 at 09:34 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gohire`
--

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `job_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `linkedin` varchar(255) DEFAULT NULL,
  `expected_salary` int DEFAULT NULL,
  `education` varchar(50) DEFAULT NULL,
  `experience` text,
  `message` text,
  `resume_path` varchar(255) DEFAULT NULL,
  `photo_path` varchar(255) DEFAULT NULL,
  `applied_at` datetime NOT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `status_updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `user_id`, `job_id`, `name`, `email`, `phone`, `address`, `linkedin`, `expected_salary`, `education`, `experience`, `message`, `resume_path`, `photo_path`, `applied_at`, `status`, `status_updated_at`) VALUES
(22, 2, 64, 'user1', 'user@gmail.com', '029174818973', 'jalan user 1', 'https://www.linkedin.com/in/user1', 10000000, 'S1', NULL, NULL, 'uploads\\1748591651201.png', 'uploads\\1748591651202.png', '2025-05-30 14:54:11', 'accepted', '2025-05-30 15:22:19');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `salary` varchar(255) NOT NULL,
  `education` varchar(225) NOT NULL,
  `job_level` varchar(255) NOT NULL,
  `work_schedule` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `title`, `type`, `salary`, `education`, `job_level`, `work_schedule`) VALUES
(64, 'Web Developer', 'Full Time', 'Rp. 1.000.000 - Rp. 1.500.000', 'SMK', 'Junior', 'Senin - Minggu'),
(65, 'UI/UX Designer', 'Full Time', 'Rp. 3.000.000 - Rp. 4.000.000', 'S1', 'Mid Level', 'Senin - Jumat'),
(66, 'Data Analyst', 'Part Time', 'Rp. 5.000.000 - Rp. 7.000.000', 'S1', 'Senior', 'Senin - Jumat'),
(67, 'Digital Marketing Specialist', 'Full Time', 'Rp. 3.000.000 - Rp. 5.000.000', 'S1', 'Senior', 'Senin - Jumat');

-- --------------------------------------------------------

--
-- Table structure for table `job_qualifications`
--

CREATE TABLE `job_qualifications` (
  `id` int NOT NULL,
  `qualification` varchar(255) NOT NULL,
  `job_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `job_qualifications`
--

INSERT INTO `job_qualifications` (`id`, `qualification`, `job_id`) VALUES
(108, 'Minimal D3/S-1 Desain atau bidang terkait', 53),
(109, 'Lulusan SMP/SMA', 53),
(112, 'Lulusan S3 Harvard', 56),
(113, 'Lulusan S3 Harvard', 57),
(115, 'Minimal D3/S-1 Desain atau bidang terkait', 55),
(116, 'Minimal S1 Marketing atau bidang terkait', 54),
(131, 'Lulusan S3 Harvard', 68),
(132, 'Minimal S1 Marketing atau bidang terkait', 67),
(133, 'Pengalaman kerja minimal 2 tahun sebagai Digital Marketing Specialist', 67),
(134, 'Minimal D3/S-1 Desain atau bidang terkait', 65),
(135, 'Pengalaman kerja minimal 2-4 tahun sebagai UI/UX Designer', 65),
(136, 'Lulusan S1 Statistik atau bidang terkait', 66),
(137, 'Memiliki kemampuan analisis yang baik', 66),
(138, 'Berpengalaman sebagai data analis minimal 2 tahun', 66),
(141, 'Lulusan SMP/SMA', 70),
(146, 'Minimal SMK/S-1', 64),
(147, 'Pengalaman kerja minimal 1-3 tahun sebagai Web Developer', 64);

-- --------------------------------------------------------

--
-- Table structure for table `job_responsibilities`
--

CREATE TABLE `job_responsibilities` (
  `id` int NOT NULL,
  `responsibility` varchar(255) NOT NULL,
  `job_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `job_responsibilities`
--

INSERT INTO `job_responsibilities` (`id`, `responsibility`, `job_id`) VALUES
(216, 'Merancang Prototipe UI/UX', 53),
(217, 'Membersihkan Area Kantor', 53),
(221, 'Membersihkan Area Kantor', 57),
(223, 'Merancang Prototipe UI/UX', 55),
(244, 'Membersihkan Area Kantor', 68),
(245, 'Membuat Strategi Digital Marketing', 67),
(246, 'Mengelola Media Sosial Perusahaan', 67),
(247, 'Kolaborasi dengan Tim Kreatif', 67),
(248, 'Mengembangkan Konten Digital', 67),
(249, 'Merancang Prototipe UI/UX', 65),
(250, 'Mengoptimalkan Antarmuka Pengguna', 65),
(251, 'Berkoordinasi dengan Tim Pengembang', 65),
(252, 'Memastikan Konsistensi Desain', 65),
(253, 'Menganalisis Data Perusahaan', 66),
(254, 'Menyajikan Hasil Analisis dalam Laporan', 66),
(255, 'Melakukan Data Cleansing', 66),
(256, 'Berkoordinasi dengan Tim Bisnis', 66),
(257, 'Menyediakan Wawasan Berbasis Data', 66),
(258, 'Menyusun Visualisasi Data', 66),
(261, 'Merancang Prototipe UI/UX', 70),
(268, 'Merancang dan Mengembangkan Website', 64),
(269, 'Mengoptimalkan Performa Website', 64),
(270, 'Memperbaiki Bug dan Masalah Teknis', 64),
(271, 'Pemeliharaan dan Pembaruan', 64);

-- --------------------------------------------------------

--
-- Table structure for table `job_skills`
--

CREATE TABLE `job_skills` (
  `id` int NOT NULL,
  `skill` varchar(255) NOT NULL,
  `job_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `job_skills`
--

INSERT INTO `job_skills` (`id`, `skill`, `job_id`) VALUES
(209, 'Desain Grafis', 53),
(210, 'Kebersihan', 53),
(214, 'Kebersihan', 57),
(216, 'Desain Grafis', 55),
(217, 'Desain Grafis', 54),
(218, 'Kebersihan', 54),
(220, 'yaha', 59),
(237, 'Pemrograman Web', 68),
(238, 'Copywriting', 67),
(239, 'Google Ads', 67),
(240, 'Social Media Management', 67),
(241, 'Data Analysis', 67),
(242, 'Desain Grafis', 65),
(243, 'Penguasaan Software Prototyping', 65),
(244, 'Analisis UX', 65),
(245, 'Manajemen Proyek', 65),
(246, 'Microsoft Excel', 66),
(247, 'Statistik', 66),
(248, 'SQL', 66),
(249, 'Python / R', 66),
(250, 'Tableau / Power BI', 66),
(253, 'Pemrograman Web', 70),
(260, 'Pemrograman Web', 64),
(261, 'Manajemen Basis Data', 64),
(262, 'Kemampuan Desain', 64),
(263, 'Pengembangan Responsif', 64);

-- --------------------------------------------------------

--
-- Table structure for table `job_tags`
--

CREATE TABLE `job_tags` (
  `id` int NOT NULL,
  `tag` varchar(255) NOT NULL,
  `job_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `job_tags`
--

INSERT INTO `job_tags` (`id`, `tag`, `job_id`) VALUES
(295, 'Mid-Level', 53),
(296, 'Maintenance', 53),
(299, 'Helper', 56),
(300, 'Helper', 57),
(302, 'Mid-Level', 55),
(303, 'Mid-Level', 54),
(305, 'sya', 59),
(324, 'Helper', 68),
(325, 'Marketing', 67),
(326, 'Mid-Level', 67),
(327, 'Content Creation', 67),
(328, 'Digital Strategy', 67),
(329, 'Mid-Level', 65),
(330, 'Creative', 65),
(331, 'UI Design', 65),
(332, 'UX Design', 65),
(333, 'Wireframing', 65),
(334, 'Prototyping', 65),
(335, 'Part Time', 66),
(336, 'Machine Learning', 66),
(337, 'Data Analysis', 66),
(338, 'SQL', 66),
(339, 'Python', 66),
(340, 'Visualization', 66),
(343, 'Maintenance', 70),
(345, 'few', 69),
(351, 'Junior', 64),
(352, 'Frontend', 64),
(353, 'Entry Level', 64),
(354, 'Web Development', 64),
(355, 'Software Engineering', 64);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `message` text NOT NULL,
  `status` enum('unread','read') DEFAULT 'unread',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `file` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `message`, `status`, `created_at`, `file`) VALUES
(115, 2, 'Selamat! Lamaran Anda diterima.', 'unread', '2025-05-30 15:22:19', 'uploads/offer_user1_1748593340495.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `NAME` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `PASSWORD` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `role` enum('admin','user') DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `NAME`, `email`, `PASSWORD`, `created_at`, `role`) VALUES
(1, 'admin', 'admin@gmail.com', '$2b$10$FyAHrBbaTdURTjXPagLTf.Bkhl5fi3pZbLYQdbopceUQq9H3bZBUi', '2025-01-26 11:09:11', 'admin'),
(2, 'user', 'user1@gmail.com', '$2b$10$V9JULk8yQBtYCFdmh.xkW.CsrECLwp03iP/29sSENJO0WkPHJxHwu', '2025-03-09 16:34:04', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `job_qualifications`
--
ALTER TABLE `job_qualifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `job_responsibilities`
--
ALTER TABLE `job_responsibilities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `job_skills`
--
ALTER TABLE `job_skills`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `job_tags`
--
ALTER TABLE `job_tags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `job_id` (`job_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `job_qualifications`
--
ALTER TABLE `job_qualifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=148;

--
-- AUTO_INCREMENT for table `job_responsibilities`
--
ALTER TABLE `job_responsibilities`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=272;

--
-- AUTO_INCREMENT for table `job_skills`
--
ALTER TABLE `job_skills`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=264;

--
-- AUTO_INCREMENT for table `job_tags`
--
ALTER TABLE `job_tags`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=356;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
