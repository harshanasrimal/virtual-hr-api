-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 03, 2025 at 03:25 PM
-- Server version: 10.4.20-MariaDB
-- PHP Version: 8.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `virtual_hr`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat_threads`
--

CREATE TABLE `chat_threads` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `threadId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastUsedAt` datetime(3) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chat_threads`
--

INSERT INTO `chat_threads` (`id`, `userId`, `threadId`, `lastUsedAt`, `isActive`) VALUES
('2441df90-60e1-4dd5-93c6-8d346d60ba7d', '294b6574-c510-47b2-8320-a8bfc4fde4db', 'thread_ErZWP2tntHDBO2p2aaBqDjIo', '2025-04-03 13:10:36.411', 1);

-- --------------------------------------------------------

--
-- Table structure for table `document_requests`
--

CREATE TABLE `document_requests` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('JOB_CONFIRMATION','SALARY_CONFIRMATION','SALARY_SLIP') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','CANCELLED','PROCESSING','DELIVERED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `reason` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliveredBy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requestedDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `deliveredDate` datetime(3) DEFAULT NULL,
  `softCopyUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_profiles`
--

CREATE TABLE `employee_profiles` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nic` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `joinedDate` datetime(3) NOT NULL,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jobDescription` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_profiles`
--

INSERT INTO `employee_profiles` (`id`, `userId`, `firstName`, `lastName`, `nic`, `joinedDate`, `designation`, `jobDescription`, `address`, `updatedAt`) VALUES
('8fc8898f-744d-4f6a-b2dc-4acfb0a28fa4', '294b6574-c510-47b2-8320-a8bfc4fde4db', 'Jane', 'Doe', '991234567V', '2024-03-30 00:00:00.000', 'Software Engineer', 'Responsible for developing backend APIs and integrations', NULL, '2025-03-30 16:51:32.037'),
('f5211dfd-d8cb-40ba-920c-37d0871d2918', '95d4d43f-44d4-4be8-a369-b6017989d42c', 'System', 'Admin', '999999999V', '2024-01-01 00:00:00.000', 'HR Manager', 'System-generated HR admin account', NULL, '2025-03-24 19:08:38.475');

-- --------------------------------------------------------

--
-- Table structure for table `leave_balances`
--

CREATE TABLE `leave_balances` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `annual` int(11) NOT NULL,
  `casual` int(11) NOT NULL,
  `medical` int(11) NOT NULL,
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leave_balances`
--

INSERT INTO `leave_balances` (`id`, `userId`, `annual`, `casual`, `medical`, `updatedAt`) VALUES
('6a93b644-e665-43a8-bd87-c2065fe67b8e', '294b6574-c510-47b2-8320-a8bfc4fde4db', 14, 7, 5, '2025-03-31 11:04:27.906');

-- --------------------------------------------------------

--
-- Table structure for table `leave_requests`
--

CREATE TABLE `leave_requests` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('ANNUAL','CASUAL','MEDICAL') COLLATE utf8mb4_unicode_ci NOT NULL,
  `fromDate` datetime(3) NOT NULL,
  `toDate` datetime(3) NOT NULL,
  `reason` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `approvedBy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leave_requests`
--

INSERT INTO `leave_requests` (`id`, `userId`, `type`, `fromDate`, `toDate`, `reason`, `status`, `approvedBy`, `note`, `createdAt`, `updatedAt`) VALUES
('43b1dc2e-537c-4308-9671-5ddb10f78a2a', '294b6574-c510-47b2-8320-a8bfc4fde4db', 'ANNUAL', '2025-04-03 18:30:00.000', '2025-04-04 18:29:59.999', 'Personal Matter', 'PENDING', NULL, NULL, '2025-04-01 04:00:22.605', '2025-04-01 04:00:22.605'),
('e3fde458-25fa-4cdd-8360-30707e6da79b', '294b6574-c510-47b2-8320-a8bfc4fde4db', 'ANNUAL', '2023-10-04 18:30:00.000', '2023-10-05 18:29:59.999', 'personal matter', 'PENDING', NULL, NULL, '2025-04-03 12:34:56.744', '2025-04-03 12:34:56.744');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT 0,
  `senderId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `relatedType` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `relatedId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('EMPLOYEE','HR') COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '/images/user.jpg'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `phone`, `isActive`, `createdAt`, `updatedAt`, `image`) VALUES
('294b6574-c510-47b2-8320-a8bfc4fde4db', 'employee@virtualhr.com', '$2b$10$qUylW/2LZ5O7nYuNCY5lueEc4IDr0OwROhfe1yRQdmi7YaAeqvfIO', 'EMPLOYEE', NULL, 1, '2025-03-30 16:51:32.037', '2025-03-30 16:51:32.037', 'https://hr.harshanasrimal.com/images/user.jpg'),
('95d4d43f-44d4-4be8-a369-b6017989d42c', 'admin@virtualhr.com', '$2b$10$qUylW/2LZ5O7nYuNCY5lueEc4IDr0OwROhfe1yRQdmi7YaAeqvfIO', 'HR', NULL, 1, '2025-03-24 19:08:38.475', '2025-03-24 19:08:38.475', 'https://hr.harshanasrimal.com/images/user.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('09a0856d-049a-445e-9b2e-78862716dcb2', '8426af65346e6fb865889e0ef72dbdfc2ad3218ffd26e74fbb25506552902ecd', '2025-03-24 20:32:46.426', '20250324203246_add_chat_thread', NULL, NULL, '2025-03-24 20:32:46.343', 1),
('55469e13-13ea-4529-b499-2fed70a3d41c', '803527a72547490b5881c11259a618645d90b9bef302b6bfba0f27e3af801a37', '2025-03-24 18:44:34.014', '20250324184433_init', NULL, NULL, '2025-03-24 18:44:33.474', 1),
('66455d7a-7129-48c9-94c9-e4e87f95dd09', '464da52516bafd568d034e5b703b3992dd068a30b5b6df74a5907c878d76a666', '2025-03-30 17:00:26.437', '20250330170026_add_user_image', NULL, NULL, '2025-03-30 17:00:26.401', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat_threads`
--
ALTER TABLE `chat_threads`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `chat_threads_userId_key` (`userId`),
  ADD UNIQUE KEY `chat_threads_threadId_key` (`threadId`);

--
-- Indexes for table `document_requests`
--
ALTER TABLE `document_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `document_requests_userId_fkey` (`userId`),
  ADD KEY `document_requests_deliveredBy_fkey` (`deliveredBy`);

--
-- Indexes for table `employee_profiles`
--
ALTER TABLE `employee_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employee_profiles_userId_key` (`userId`),
  ADD UNIQUE KEY `employee_profiles_nic_key` (`nic`);

--
-- Indexes for table `leave_balances`
--
ALTER TABLE `leave_balances`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `leave_balances_userId_key` (`userId`);

--
-- Indexes for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `leave_requests_userId_fkey` (`userId`),
  ADD KEY `leave_requests_approvedBy_fkey` (`approvedBy`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_senderId_fkey` (`senderId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chat_threads`
--
ALTER TABLE `chat_threads`
  ADD CONSTRAINT `chat_threads_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `document_requests`
--
ALTER TABLE `document_requests`
  ADD CONSTRAINT `document_requests_deliveredBy_fkey` FOREIGN KEY (`deliveredBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `document_requests_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `employee_profiles`
--
ALTER TABLE `employee_profiles`
  ADD CONSTRAINT `employee_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `leave_balances`
--
ALTER TABLE `leave_balances`
  ADD CONSTRAINT `leave_balances_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD CONSTRAINT `leave_requests_approvedBy_fkey` FOREIGN KEY (`approvedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_requests_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
