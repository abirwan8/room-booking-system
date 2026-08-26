-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 26, 2026 at 01:23 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `roombookingdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `Id` int NOT NULL,
  `UserId` int NOT NULL,
  `DepartmentId` int NOT NULL,
  `RoomId` int NOT NULL,
  `Title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `StartTime` datetime(6) NOT NULL,
  `EndTime` datetime(6) NOT NULL,
  `Status` int NOT NULL,
  `RejectionReason` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `CreatedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`Id`, `UserId`, `DepartmentId`, `RoomId`, `Title`, `Description`, `StartTime`, `EndTime`, `Status`, `RejectionReason`, `CreatedAt`, `UpdatedAt`) VALUES
(2, 2, 1, 1, 'Meeting Kedua', 'Testing collision', '2026-08-25 10:00:00.000000', '2026-08-25 12:00:00.000000', 2, NULL, '2026-08-25 13:50:26.700254', NULL),
(3, 2, 1, 1, 'Meeting Pertama', 'Testing booking', '2026-08-25 12:00:00.000000', '2026-08-25 12:30:00.000000', 1, NULL, '2026-08-25 13:55:26.195470', NULL),
(4, 2, 1, 1, 'Meeting Pertama', 'Testing booking', '2026-08-26 12:00:00.000000', '2026-08-26 12:30:00.000000', 0, NULL, '2026-08-25 14:11:05.196402', NULL),
(5, 2, 1, 1, 'Meeting Pertama', 'Testing booking', '2026-08-23 10:00:00.000000', '2026-08-23 12:00:00.000000', 3, NULL, '2026-08-25 15:38:26.884780', NULL),
(6, 7, 1, 1, 'Annual Meerting', 'Annual Meerting 2026', '2026-08-27 01:00:00.000000', '2026-08-27 03:00:00.000000', 3, NULL, '2026-08-26 04:46:15.655240', NULL),
(7, 2, 1, 1, 'Meet 1', 'Meet 1 ', '2026-08-26 18:00:00.000000', '2026-08-26 21:00:00.000000', 0, NULL, '2026-08-26 10:14:51.973338', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `Id` int NOT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `CreatedAt` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`Id`, `Name`, `CreatedAt`) VALUES
(1, 'IT Department', '2026-08-25 05:45:08.601855');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `Id` int NOT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Capacity` int NOT NULL,
  `Facilities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `CreatedAt` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`Id`, `Name`, `Capacity`, `Facilities`, `CreatedAt`) VALUES
(1, 'Meeting Room 1', 10, 'Projector, AC, Whiteboard', '2026-08-25 05:26:23.000000'),
(2, 'Room B', 50, 'Projector', '2026-08-26 10:51:37.337333');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `Id` int NOT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Email` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `PasswordHash` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Role` int NOT NULL,
  `DepartmentId` int NOT NULL,
  `CreatedAt` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Id`, `Name`, `Email`, `PasswordHash`, `Role`, `DepartmentId`, `CreatedAt`) VALUES
(2, 'Test User', 'test@example.com', '$2a$11$9BkiyWJRKMSFfq3LeLKpXOET2EMAEdyCc4ZyL..R0S1Iptn5S3gny', 0, 1, '2026-08-25 13:44:16.830855'),
(7, 'Administrator', 'admin@roombooking.com', '$2a$11$NpxO1YhNvMFpVjKaj3ZmjOvojFcCMDH1RIhz1KFCGeyQ.gy1GThAm', 1, 1, '2026-08-26 04:06:36.435407');

-- --------------------------------------------------------

--
-- Table structure for table `__efmigrationshistory`
--

CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProductVersion` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `__efmigrationshistory`
--

INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES
('20260825044113_InitialCreate', '9.0.0');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Bookings_DepartmentId` (`DepartmentId`),
  ADD KEY `IX_Bookings_RoomId_StartTime_EndTime_Status` (`RoomId`,`StartTime`,`EndTime`,`Status`),
  ADD KEY `IX_Bookings_UserId` (`UserId`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Users_DepartmentId` (`DepartmentId`);

--
-- Indexes for table `__efmigrationshistory`
--
ALTER TABLE `__efmigrationshistory`
  ADD PRIMARY KEY (`MigrationId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `FK_Bookings_Departments_DepartmentId` FOREIGN KEY (`DepartmentId`) REFERENCES `departments` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Bookings_Rooms_RoomId` FOREIGN KEY (`RoomId`) REFERENCES `rooms` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Bookings_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `FK_Users_Departments_DepartmentId` FOREIGN KEY (`DepartmentId`) REFERENCES `departments` (`Id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
