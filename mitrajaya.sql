/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80027
 Source Host           : localhost:3306
 Source Schema         : mitrajaya

 Target Server Type    : MySQL
 Target Server Version : 80027
 File Encoding         : 65001

 Date: 16/10/2022 22:21:48
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for ci_sessions
-- ----------------------------
DROP TABLE IF EXISTS `ci_sessions`;
CREATE TABLE `ci_sessions`  (
  `id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `timestamp` int UNSIGNED NOT NULL DEFAULT 0,
  `data` blob NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ci_sessions_timestamp`(`timestamp` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ci_sessions
-- ----------------------------

-- ----------------------------
-- Table structure for mj_balance
-- ----------------------------
DROP TABLE IF EXISTS `mj_balance`;
CREATE TABLE `mj_balance`  (
  `BalanceID` int NOT NULL,
  `FilePath` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedDate` timestamp NULL DEFAULT NULL,
  `CreatedBy` bigint NULL DEFAULT NULL,
  `StatusCode` enum('active','nullified') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'active',
  PRIMARY KEY (`BalanceID`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of mj_balance
-- ----------------------------
INSERT INTO `mj_balance` VALUES (1, '20221016080941_279db3b63815fd79283f133ea07de11c.jpg', '2022-10-16 08:09:41', 99971749675794438, 'active');

-- ----------------------------
-- Table structure for mj_bank_transaction
-- ----------------------------
DROP TABLE IF EXISTS `mj_bank_transaction`;
CREATE TABLE `mj_bank_transaction`  (
  `BankTransactionID` bigint NOT NULL,
  `DateTransaction` date NULL DEFAULT NULL,
  `CheckingAccount` date NULL DEFAULT NULL,
  `NoVoucher` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CostElement` bigint NULL DEFAULT NULL,
  `TransactionType` enum('debit','credit') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TransactionAmountDebit` decimal(13, 2) NULL DEFAULT NULL,
  `TransactionAmountCredit` decimal(13, 2) NULL DEFAULT NULL,
  `ProjectID` bigint NULL DEFAULT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `StatusCode` enum('active','nullified','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'active',
  `CreatedDate` datetime NULL DEFAULT NULL,
  `CreatedBy` bigint NULL DEFAULT NULL,
  `UpdatedDate` datetime NULL DEFAULT NULL,
  `UpdatedBy` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`BankTransactionID`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of mj_bank_transaction
-- ----------------------------
INSERT INTO `mj_bank_transaction` VALUES (99983442774589450, '2022-10-01', '2022-10-08', NULL, 99983442774589440, 'debit', 100000.00, NULL, 99993514640670772, 'Bayar Utang', 'active', NULL, NULL, NULL, NULL);
INSERT INTO `mj_bank_transaction` VALUES (99983442774589449, '2022-10-01', NULL, '123123123', 99983442774589440, 'debit', 4000000.00, NULL, 99993514640670769, 'Saldo Awal', 'active', NULL, NULL, NULL, NULL);
INSERT INTO `mj_bank_transaction` VALUES (99983442774589451, '2022-10-01', NULL, NULL, 99983442774589440, 'credit', NULL, 200000.00, 99983442774589442, 'Biaya Maintance', 'active', NULL, NULL, NULL, NULL);
INSERT INTO `mj_bank_transaction` VALUES (99983442774589452, '2022-10-01', NULL, '01212', 99983442774589441, 'debit', 500000.00, NULL, 99983442774589442, NULL, 'nullified', NULL, NULL, NULL, NULL);
INSERT INTO `mj_bank_transaction` VALUES (99983442774589453, '2022-10-06', NULL, 'New Voucher', 99983442774589440, 'credit', NULL, 100000.00, 99983442774589442, 'asdasdasd', 'active', NULL, NULL, NULL, NULL);
INSERT INTO `mj_bank_transaction` VALUES (99983442774589454, '2022-10-02', NULL, '1asdasd', 99983442774589441, 'credit', NULL, 50000.00, 99983442774589442, 'asdasdazxczxc', 'active', NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for mj_component
-- ----------------------------
DROP TABLE IF EXISTS `mj_component`;
CREATE TABLE `mj_component`  (
  `ComponentID` bigint NOT NULL,
  `Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `StatusCode` enum('active','nullified','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'active',
  `CreatedDate` datetime NULL DEFAULT NULL,
  `CreatedBy` bigint NULL DEFAULT NULL,
  `UpdatedDate` datetime NULL DEFAULT NULL,
  `UpdatedBy` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`ComponentID`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of mj_component
-- ----------------------------
INSERT INTO `mj_component` VALUES (99983442774589440, 'MSU01', NULL, 'active', '2022-10-01 18:26:24', NULL, NULL, NULL);
INSERT INTO `mj_component` VALUES (99983442774589441, 'MSU02', NULL, 'active', '2022-10-01 18:26:26', NULL, NULL, NULL);
INSERT INTO `mj_component` VALUES (99983442774589442, 'MSU03', NULL, 'active', '2022-10-01 18:26:29', NULL, NULL, NULL);

-- ----------------------------
-- Table structure for mj_customer
-- ----------------------------
DROP TABLE IF EXISTS `mj_customer`;
CREATE TABLE `mj_customer`  (
  `CustomerID` bigint NOT NULL DEFAULT 'uuid_short()',
  `PartnerID` bigint NULL DEFAULT NULL,
  `CustomerDisplayID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CustomerName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CustomerAddress` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PhoneCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PhoneNumber` int NULL DEFAULT NULL,
  `Email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `StatusCode` enum('active','nullified','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'active',
  `CreatedDate` datetime NULL DEFAULT NULL,
  `CreatedBy` bigint NULL DEFAULT NULL,
  `UpdatedDate` datetime NULL DEFAULT NULL,
  `UpdatedBy` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`CustomerID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of mj_customer
-- ----------------------------
INSERT INTO `mj_customer` VALUES (99971749675794445, NULL, NULL, 'PT Kone Indo Elevator', NULL, NULL, NULL, NULL, 'active', NULL, NULL, NULL, NULL);
INSERT INTO `mj_customer` VALUES (100006860899221504, NULL, NULL, 'Mitrajaya 5', 'Test', NULL, 812121212, 'asasasad@gmail.com', 'nullified', '2022-10-16 09:01:19', NULL, '2022-10-16 09:06:05', 99971749675794438);
INSERT INTO `mj_customer` VALUES (100006860899221505, NULL, NULL, 'Mitrajaya 67', 'Test', NULL, 812121212, 'asasasad@gmail.com', 'active', '2022-10-16 09:01:56', 99971749675794438, '2022-10-16 09:07:01', 99971749675794438);

-- ----------------------------
-- Table structure for mj_department
-- ----------------------------
DROP TABLE IF EXISTS `mj_department`;
CREATE TABLE `mj_department`  (
  `DeptID` bigint NOT NULL,
  `PartnerID` bigint NULL DEFAULT NULL,
  `DeptName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `StatusCode` enum('active','nullified','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'active',
  `CreatedDate` datetime NULL DEFAULT NULL,
  `CreatedBy` bigint NULL DEFAULT NULL,
  `UpdatedDate` datetime NULL DEFAULT NULL,
  `UpdatedBy` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`DeptID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of mj_department
-- ----------------------------

-- ----------------------------
-- Table structure for mj_invoice
-- ----------------------------
DROP TABLE IF EXISTS `mj_invoice`;
CREATE TABLE `mj_invoice`  (
  `InvoiceID` bigint NOT NULL,
  `InvoiceNumber` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `InvoicePeriod` date NULL DEFAULT NULL,
  `CustomerID` bigint NULL DEFAULT NULL,
  `ContractNumber` bigint NULL DEFAULT NULL,
  `TaxNumber` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `InvoiceAmount` decimal(12, 2) NULL DEFAULT NULL,
  `InvoiceVAT` decimal(12, 2) NULL DEFAULT NULL,
  `InvoiceTotal` decimal(12, 2) NULL DEFAULT NULL,
  `InvoiceGR` date NULL DEFAULT NULL,
  `InvoiceReceived` date NULL DEFAULT NULL,
  `DueDatePeriod` enum('30','45') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DueDate` date NULL DEFAULT NULL,
  `Paid` date NULL DEFAULT NULL,
  `PPH23Option` enum('2','4') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PPH23Value` decimal(12, 2) NULL DEFAULT NULL,
  `GrossIncome` decimal(12, 2) NULL DEFAULT NULL,
  `NettIncome` decimal(12, 2) NULL DEFAULT NULL,
  `StatusCode` enum('active','nullified','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'active',
  `CreatedDate` datetime NULL DEFAULT NULL,
  `CreatedBy` bigint NULL DEFAULT NULL,
  `UpdatedDate` datetime NULL DEFAULT NULL,
  `UpdatedBy` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`InvoiceID`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of mj_invoice
-- ----------------------------
INSERT INTO `mj_invoice` VALUES (99983442774589468, 'INV-01212', '2022-10-03', 99971749675794445, 99983442774589463, '12123123', 'asdasd', 10000.00, 1000.00, 11000.00, '2022-10-03', '2022-10-03', '45', '2022-11-17', NULL, '2', 200.00, 10800.00, 9800.00, 'active', NULL, NULL, NULL, NULL);
INSERT INTO `mj_invoice` VALUES (99983442774589465, 'INV-001', '2022-10-02', 99971749675794445, 99983442774589463, '123123123', 'Asadasdasdas', 250000.00, 25000.00, 275000.00, '2022-10-02', NULL, '30', '2022-11-01', NULL, '2', 5000.00, 270000.00, 245000.00, 'active', NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for mj_loan
-- ----------------------------
DROP TABLE IF EXISTS `mj_loan`;
CREATE TABLE `mj_loan`  (
  `LoanID` bigint NOT NULL,
  `ProjectID` bigint NULL DEFAULT NULL,
  `LoanDate` date NULL DEFAULT NULL,
  `VendorName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `LoanAmount` decimal(12, 2) NULL DEFAULT NULL,
  `LoanDescription` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `StatusCode` enum('active','nullified','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'active',
  `CreatedDate` datetime NULL DEFAULT NULL,
  `CreatedBy` bigint NULL DEFAULT NULL,
  `UpdatedDate` datetime NULL DEFAULT NULL,
  `UpdatedBy` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`LoanID`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of mj_loan
-- ----------------------------
INSERT INTO `mj_loan` VALUES (99983442774589457, 99983442774589464, '2022-10-02', 'Loan New', 100000.00, 'asdasdasd', 'active', NULL, NULL, NULL, NULL);
INSERT INTO `mj_loan` VALUES (99983442774589469, 99983442774589464, '2022-10-03', 'Heru', 1000000.00, 'Project', 'active', NULL, NULL, NULL, NULL);
INSERT INTO `mj_loan` VALUES (99983442774589471, 99983442774589464, '2022-10-03', 'Gas', 2000000.00, 'asd', 'active', NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for mj_loan_payment
-- ----------------------------
DROP TABLE IF EXISTS `mj_loan_payment`;
CREATE TABLE `mj_loan_payment`  (
  `LoanPaymentID` bigint NOT NULL,
  `LoanID` bigint NULL DEFAULT NULL,
  `LoanPaymentAmount` decimal(12, 2) NULL DEFAULT NULL,
  `LoanPaymentDate` date NULL DEFAULT NULL,
  `StatusCode` enum('active','nullified','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'active',
  `CreatedBy` bigint NULL DEFAULT NULL,
  `CreatedDate` datetime NULL DEFAULT NULL,
  `UpdatedBy` bigint NULL DEFAULT NULL,
  `UpdateDate` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`LoanPaymentID`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Fixed;

-- ----------------------------
-- Records of mj_loan_payment
-- ----------------------------
INSERT INTO `mj_loan_payment` VALUES (99983442774589458, 99983442774589457, 20000.00, '2022-10-02', 'active', NULL, NULL, NULL, NULL);
INSERT INTO `mj_loan_payment` VALUES (99983442774589470, 99983442774589469, 200000.00, '2022-10-03', 'active', NULL, NULL, NULL, NULL);
INSERT INTO `mj_loan_payment` VALUES (99983442774589472, 99983442774589471, 1000000.00, '2022-10-03', 'active', NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for mj_order_book
-- ----------------------------
DROP TABLE IF EXISTS `mj_order_book`;
CREATE TABLE `mj_order_book`  (
  `OrderBookID` bigint NOT NULL,
  `CustomerID` bigint NULL DEFAULT NULL,
  `PartnerID` bigint NULL DEFAULT NULL,
  `ContractNumber` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `JONumber` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ContractDate` date NULL DEFAULT NULL,
  `Description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `ProjectID` bigint NULL DEFAULT NULL,
  `DeptID` bigint NULL DEFAULT NULL,
  `PeopleID` bigint NULL DEFAULT NULL,
  `ContractAmount` decimal(12, 2) NULL DEFAULT NULL,
  `PPN` int NULL DEFAULT NULL,
  `ContractAmountPPN` decimal(12, 2) NULL DEFAULT NULL,
  `TotalContactAmount` decimal(12, 2) NULL DEFAULT NULL,
  `StatusCode` enum('active','nullified','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'active',
  `CreatedDate` datetime NULL DEFAULT NULL,
  `CreatedBy` bigint NULL DEFAULT NULL,
  `UpdatedDate` datetime NULL DEFAULT NULL,
  `UpdatedBy` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`OrderBookID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of mj_order_book
-- ----------------------------
INSERT INTO `mj_order_book` VALUES (99983442774589463, 99971749675794445, NULL, 'PO-123123123', NULL, '2022-10-02', 'Test', NULL, NULL, 99971749675794440, 56000.00, 11, 6160.00, 62160.00, 'active', '2022-10-02 16:04:24', 99971749675794438, NULL, NULL);
INSERT INTO `mj_order_book` VALUES (99983442774589466, 99971749675794445, NULL, 'PO-001', 'JO-12311', '2022-10-03', 'Test', NULL, NULL, 99971749675794441, 150000.00, 11, 16500.00, 166500.00, 'active', '2022-10-03 07:06:22', 99971749675794438, NULL, NULL);
INSERT INTO `mj_order_book` VALUES (99993514640670767, 99971749675794445, NULL, 'PO-002', 'JO-12312', '2022-10-08', NULL, NULL, NULL, 99971749675794439, 500000.00, 11, 55000.00, 555000.00, 'active', '2022-10-08 10:07:03', 99971749675794438, NULL, NULL);

-- ----------------------------
-- Table structure for mj_partner
-- ----------------------------
DROP TABLE IF EXISTS `mj_partner`;
CREATE TABLE `mj_partner`  (
  `PartnerID` bigint NOT NULL,
  `PartnerName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `StatusCode` enum('active','nullified','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'active',
  `CreatedDate` datetime NULL DEFAULT NULL,
  `CreatedBy` bigint NULL DEFAULT NULL,
  `UpdatedDate` datetime NULL DEFAULT NULL,
  `UpdatedBy` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`PartnerID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of mj_partner
-- ----------------------------

-- ----------------------------
-- Table structure for mj_people
-- ----------------------------
DROP TABLE IF EXISTS `mj_people`;
CREATE TABLE `mj_people`  (
  `people_id` bigint NOT NULL DEFAULT 'uuid_short()',
  `partner_id` bigint NULL DEFAULT NULL,
  `people_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `people_gender` enum('male','female') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `user_id` bigint NULL DEFAULT NULL,
  `phone_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `phone_number` int NULL DEFAULT NULL,
  `people_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `status` enum('active','nullified','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'active',
  `CreatedDate` datetime NULL DEFAULT NULL,
  `CreatedBy` bigint NULL DEFAULT NULL,
  `UpdatedDate` datetime NULL DEFAULT NULL,
  `UpdatedBy` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`people_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of mj_people
-- ----------------------------
INSERT INTO `mj_people` VALUES (99971749675794439, NULL, 'Finance Admin', 'male', 99971749675794438, '+62', 1231231212, NULL, 'ASdasdas', 'active', NULL, NULL, '2022-10-16 15:17:17', 99971749675794438);
INSERT INTO `mj_people` VALUES (99971749675794440, NULL, 'Fudholi', 'male', NULL, NULL, NULL, NULL, NULL, 'active', NULL, NULL, NULL, NULL);
INSERT INTO `mj_people` VALUES (99971749675794441, NULL, 'Arief', 'male', NULL, NULL, NULL, NULL, NULL, 'active', NULL, NULL, NULL, NULL);
INSERT INTO `mj_people` VALUES (99971749675794442, NULL, 'Bima', 'male', NULL, NULL, NULL, NULL, NULL, 'active', NULL, NULL, NULL, NULL);
INSERT INTO `mj_people` VALUES (99971749675794443, NULL, 'Fajar', 'male', NULL, NULL, NULL, NULL, NULL, 'active', NULL, NULL, NULL, NULL);
INSERT INTO `mj_people` VALUES (100006860899221512, NULL, 'Fashah Update', 'male', NULL, NULL, 2147483647, 'asdasds@gmail.com', 'asdasdasdasd', 'nullified', '2022-10-16 14:22:24', 99971749675794438, '2022-10-16 14:24:54', 99971749675794438);

-- ----------------------------
-- Table structure for mj_project
-- ----------------------------
DROP TABLE IF EXISTS `mj_project`;
CREATE TABLE `mj_project`  (
  `ProjectID` bigint NOT NULL,
  `OrderBookID` bigint NULL DEFAULT NULL,
  `PartnerID` bigint NULL DEFAULT NULL,
  `ProjectName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CustomerID` bigint NULL DEFAULT NULL,
  `StatusCode` enum('active','nullified','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'active',
  `CreatedDate` datetime NULL DEFAULT NULL,
  `CreatedBy` bigint NULL DEFAULT NULL,
  `UpdatedDate` datetime NULL DEFAULT NULL,
  `UpdatedBy` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`ProjectID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of mj_project
-- ----------------------------
INSERT INTO `mj_project` VALUES (99983442774589464, 99983442774589463, NULL, 'Kone Project 2', NULL, 'active', '2022-10-02 16:04:24', 99971749675794438, '2022-10-02 16:07:00', 99971749675794438);
INSERT INTO `mj_project` VALUES (99983442774589467, 99983442774589466, NULL, 'Project123', NULL, 'active', '2022-10-03 07:06:22', 99971749675794438, '2022-10-08 10:14:35', 99971749675794438);
INSERT INTO `mj_project` VALUES (99993514640670768, 99993514640670767, NULL, 'NEW Project', NULL, 'active', '2022-10-08 10:07:03', 99971749675794438, '2022-10-08 10:13:21', 99971749675794438);

-- ----------------------------
-- Table structure for mj_user
-- ----------------------------
DROP TABLE IF EXISTS `mj_user`;
CREATE TABLE `mj_user`  (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `dept_id` bigint NULL DEFAULT NULL,
  `role_id` bigint NULL DEFAULT NULL,
  `user_status` enum('0','1') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `refresh_token` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 99971749675794438 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of mj_user
-- ----------------------------
INSERT INTO `mj_user` VALUES (99971749675794438, 'finance', 'Finance User', 'septian.yoga@gmail.com', '6ee5c56e0cf2f785a49591570f31d927', NULL, NULL, '1', NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- ----------------------------
-- Table structure for ref_bank_project
-- ----------------------------
DROP TABLE IF EXISTS `ref_bank_project`;
CREATE TABLE `ref_bank_project`  (
  `RefBankID` bigint NOT NULL DEFAULT 'uuid_short()',
  `RefBankName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `StatusCode` enum('active','inactive','nullified') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`RefBankID`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ref_bank_project
-- ----------------------------
INSERT INTO `ref_bank_project` VALUES (99993514640670769, 'SALDO AWAL', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670770, 'CARTENZS RESIDENCE', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670771, 'MENARA SUDIRMAN', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670772, 'CARTENZS ', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670773, 'CARTENZS', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670774, 'OSAKA', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670775, 'DISTRICT 8', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670776, 'LAKEWOOD NAVAPARK', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670777, 'GPO TVRI', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670778, 'ROYAL ORCHARD', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670779, 'KANTOR SUNTER GRIYA', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670780, 'SEKOLAH BUNDA MULIA', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670781, 'AUDI DENTAL', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670782, 'JHL', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670783, 'SMP TARAKANITA 4', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670784, 'BUTTERFLY', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670785, 'RUMAH IBU DEWI', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670786, 'TAMAN ISMAIL MARZUKI', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670787, 'HQUARTER BANDUNG', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670788, 'TOKYO', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670789, 'GOLF SILAND', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670790, 'PAJAK', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670791, 'MGR', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670792, 'HEAD OFFICE', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670793, 'LISTRIK', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670794, 'BPJS KETENAGAKERJAAN', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670795, 'BPJS KESEHATAN', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670796, 'ASDP', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670797, 'INTERNET', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670798, 'KOST DAAN MOGOT', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670799, 'GRAND BINTARO', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670800, 'AEON SENTUL', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670801, 'MENARA JAKARTA', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670802, 'SAMANEA', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670803, 'GEDUNG PLANETARIUM', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670804, 'KANTOR ASDP', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670805, 'RS HARAPAN KITA', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670806, 'REVO TOWNMALL', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670807, 'PROMANADE', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670808, 'GAJAH MADA PLAZA', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670809, 'PT SEKOLAH CIKAL', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670810, 'INSENTIIVE', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670811, 'TELKOM SEMANGGI', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670812, 'APARTEMEN SEMANGGI', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670813, 'GKM', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670814, 'HOTEL TULIP', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670815, 'U RESIDENCE', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670816, 'PAVILLIUN MUSDALIFAH', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670817, 'APARTEMEN SEMANGGI SL', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670818, 'APARTEMEN SWMANGGI SL', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670819, 'NAGOYA BATAM', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670820, 'GOLF ISLAND', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670821, 'WISMA BNI 46', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670822, 'SOPODEL', 'active');
INSERT INTO `ref_bank_project` VALUES (99993514640670823, 'OFFICE PENDEKAR', 'active');

-- ----------------------------
-- Table structure for sys_act
-- ----------------------------
DROP TABLE IF EXISTS `sys_act`;
CREATE TABLE `sys_act`  (
  `AksiId` int NOT NULL AUTO_INCREMENT,
  `AksiName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `AksiFungsi` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`AksiId`) USING BTREE,
  UNIQUE INDEX `NewIndex1`(`AksiFungsi` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_act
-- ----------------------------
INSERT INTO `sys_act` VALUES (1, 'View', 'index');
INSERT INTO `sys_act` VALUES (2, 'Update', 'update');
INSERT INTO `sys_act` VALUES (3, 'Add', 'add');
INSERT INTO `sys_act` VALUES (4, 'Delete', 'delete');
INSERT INTO `sys_act` VALUES (5, 'Export Excel', 'export_excel');

-- ----------------------------
-- Table structure for sys_group
-- ----------------------------
DROP TABLE IF EXISTS `sys_group`;
CREATE TABLE `sys_group`  (
  `GroupId` int NOT NULL AUTO_INCREMENT,
  `GroupName` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `GroupDescription` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `GroupActive` enum('Yes','No') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'Yes',
  `GroupPartnerID` smallint UNSIGNED NOT NULL,
  `GroupUnitId` int NULL DEFAULT NULL COMMENT 'refer to sys_unit.UnitId',
  `GroupMenuTemID` int UNSIGNED NOT NULL,
  `GroupAddUserId` int NULL DEFAULT NULL,
  `GroupAddTime` datetime NULL DEFAULT NULL,
  `GroupUpdateUserId` int NULL DEFAULT NULL,
  `GroupUpdateTime` datetime NULL DEFAULT NULL,
  `GroupMenuID` int NULL DEFAULT NULL COMMENT 'GroupMenuMenuAksiId yang ada di group_menu_act',
  `GroupFilterBy` tinyint NULL DEFAULT NULL COMMENT 'if 1=partner, 2=sce, 3=trader, 4=cooperative, 5=warehouse',
  `RoleID` bigint UNSIGNED NULL DEFAULT NULL,
  `PartnerID` bigint NULL DEFAULT NULL,
  `StatusCode` enum('active','inactive','nullified') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'active' COMMENT 'Status code for delete action',
  `DateCreated` datetime NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `DateUpdated` datetime NULL DEFAULT NULL,
  `LastModifiedBy` int NULL DEFAULT NULL,
  PRIMARY KEY (`GroupId`) USING BTREE,
  UNIQUE INDEX `NewIndex1a`(`GroupName` ASC, `GroupUnitId` ASC) USING BTREE,
  INDEX `FK_ci_group`(`GroupUnitId` ASC) USING BTREE,
  INDEX `NewIndex1as`(`GroupDescription` ASC) USING BTREE,
  INDEX `FK_sg_RoleId`(`RoleID` ASC) USING BTREE,
  INDEX `FK_sys_group_GroupMenuTemID`(`GroupMenuTemID` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_group
-- ----------------------------
INSERT INTO `sys_group` VALUES (1, 'Finance', '', 'Yes', 0, 0, 0, NULL, NULL, 2147483647, '2022-10-16 16:43:54', 2, NULL, NULL, NULL, 'active', NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for sys_group_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_group_menu`;
CREATE TABLE `sys_group_menu`  (
  `GroupMenuID` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `GroupMenuName` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `GroupMenuMenuAksiId` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `StatusCode` enum('active','inactive','nullified') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'active',
  `DateCreated` datetime NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `DateUpdated` datetime NULL DEFAULT NULL,
  `LastModifiedBy` int NULL DEFAULT NULL,
  PRIMARY KEY (`GroupMenuID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_group_menu
-- ----------------------------

-- ----------------------------
-- Table structure for sys_group_menu_act
-- ----------------------------
DROP TABLE IF EXISTS `sys_group_menu_act`;
CREATE TABLE `sys_group_menu_act`  (
  `GroupMenuMenuAksiId` bigint NOT NULL,
  `GroupMenuGroupId` bigint NOT NULL,
  `GroupMenuSegmen` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `GroupMenuAddUserId` bigint NULL DEFAULT NULL,
  `GroupMenuAddTime` datetime NULL DEFAULT NULL,
  `GroupMenuUpdateUserId` bigint NULL DEFAULT NULL,
  `GroupMenuUpdateTime` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`GroupMenuMenuAksiId`, `GroupMenuGroupId`) USING BTREE,
  INDEX `FK_ci_group_menu_dummy_menu`(`GroupMenuMenuAksiId` ASC) USING BTREE,
  INDEX `FK_ci_group_menu_aksi`(`GroupMenuGroupId` ASC) USING BTREE,
  INDEX `NewIndex1`(`GroupMenuSegmen` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_group_menu_act
-- ----------------------------
INSERT INTO `sys_group_menu_act` VALUES (1995, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (1997, 1, 'finance/orderbook/index', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (1998, 1, 'finance/orderbook/update', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (1999, 1, 'finance/orderbook/add', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2000, 1, 'finance/orderbook/delete', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2001, 1, 'finance/orderbook/export_excel', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2002, 1, 'finance/invoice/index', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2003, 1, 'finance/invoice/update', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2004, 1, 'finance/invoice/add', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2005, 1, 'finance/invoice/delete', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2006, 1, 'finance/invoice/export_excel', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2007, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2008, 1, 'report/bank_transaction/index', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2009, 1, 'report/bank_transaction/update', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2010, 1, 'report/bank_transaction/add', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2011, 1, 'report/bank_transaction/delete', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2012, 1, 'report/bank_transaction/export_excel', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2013, 1, 'finance/pinjamansubcont/index', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2014, 1, 'finance/pinjamansubcont/update', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2015, 1, 'finance/pinjamansubcont/add', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2016, 1, 'finance/pinjamansubcont/delete', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2017, 1, 'finance/pinjamansubcont/export_excel', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2018, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2019, 1, 'administrator/group/index', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2020, 1, 'administrator/group/update', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2021, 1, 'administrator/group/add', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2022, 1, 'administrator/group/delete', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2023, 1, 'report/balance/index', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2024, 1, 'report/balance/update', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2025, 1, 'report/balance/add', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2026, 1, 'report/balance/delete', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2027, 1, 'administrator/customer/index', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2028, 1, 'administrator/customer/update', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2029, 1, 'administrator/customer/add', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2030, 1, 'administrator/customer/delete', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2031, 1, 'administrator/employee/index', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2032, 1, 'administrator/employee/update', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2033, 1, 'administrator/employee/add', NULL, NULL, NULL, NULL);
INSERT INTO `sys_group_menu_act` VALUES (2034, 1, 'administrator/employee/delete', NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for sys_log_page_access
-- ----------------------------
DROP TABLE IF EXISTS `sys_log_page_access`;
CREATE TABLE `sys_log_page_access`  (
  `LogID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NULL DEFAULT NULL,
  `SessionIP` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Page` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `Timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`LogID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_log_page_access
-- ----------------------------

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu`  (
  `MenuId` int NOT NULL AUTO_INCREMENT,
  `MenuParentId` int NULL DEFAULT NULL,
  `MenuName` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MenuModule` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MenuTypeFlag` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MenuShow` enum('Yes','No') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MenuIcon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MenuOrder` int NULL DEFAULT NULL,
  `MenuJenis` int NULL DEFAULT NULL,
  `MenuParam` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`MenuId`) USING BTREE,
  UNIQUE INDEX `NewIndex12`(`MenuParentId` ASC, `MenuName` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
INSERT INTO `sys_menu` VALUES (1, 0, 'Finance', NULL, NULL, 'Yes', 'fas fa-wallet', 1, NULL, NULL);
INSERT INTO `sys_menu` VALUES (2, 1, 'Order Book', 'finance/orderbook', NULL, 'Yes', 'fas fa-book', 1, NULL, NULL);
INSERT INTO `sys_menu` VALUES (3, 0, 'Welcom Page', 'welcome', NULL, 'No', NULL, 1, NULL, NULL);
INSERT INTO `sys_menu` VALUES (4, 1, 'Invoice', 'finance/invoice', NULL, 'Yes', 'fas fa-file-invoice', 2, NULL, NULL);
INSERT INTO `sys_menu` VALUES (5, 0, 'Report', NULL, NULL, 'Yes', 'fas fa-list-alt', 2, NULL, NULL);
INSERT INTO `sys_menu` VALUES (6, 5, 'Bank Transaction', 'report/bank_transaction', NULL, 'Yes', 'fas fa-money-check', 1, NULL, NULL);
INSERT INTO `sys_menu` VALUES (7, 1, 'Project Loan', 'finance/pinjamansubcont', NULL, 'Yes', 'fas fa-money-bill', 3, NULL, NULL);
INSERT INTO `sys_menu` VALUES (8, 0, 'Administation', NULL, NULL, 'Yes', 'fas fa-users-cog', 3, NULL, NULL);
INSERT INTO `sys_menu` VALUES (9, 8, 'Group', 'administrator/group', NULL, 'Yes', 'fas fa-layer-group', 1, NULL, NULL);
INSERT INTO `sys_menu` VALUES (10, 5, 'Balance', 'report/balance', NULL, 'Yes', 'fas fa-money-check', 2, NULL, NULL);
INSERT INTO `sys_menu` VALUES (11, 8, 'Customer List', 'administrator/customer', NULL, 'Yes', 'fas fa-building', 2, NULL, NULL);
INSERT INTO `sys_menu` VALUES (12, 8, 'Employee', 'administrator/employee', NULL, 'Yes', 'fas fa-user-tie', 3, NULL, NULL);

-- ----------------------------
-- Table structure for sys_menu_act
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu_act`;
CREATE TABLE `sys_menu_act`  (
  `MenuAksiId` int NOT NULL AUTO_INCREMENT,
  `MenuAksiMenuId` int NULL DEFAULT NULL,
  `MenuAksiAksiId` int NULL DEFAULT NULL,
  PRIMARY KEY (`MenuAksiId`) USING BTREE,
  UNIQUE INDEX `NewIndex1ad`(`MenuAksiMenuId` ASC, `MenuAksiAksiId` ASC) USING BTREE,
  INDEX `FK_ci_dummy_menu_aksi`(`MenuAksiMenuId` ASC) USING BTREE,
  INDEX `FK_ci_dummy_menu_aksi_aksi`(`MenuAksiAksiId` ASC) USING BTREE,
  CONSTRAINT `FK_ci_dummy_menu_aksi` FOREIGN KEY (`MenuAksiMenuId`) REFERENCES `sys_menu` (`MenuId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_ci_dummy_menu_aksi_aksi` FOREIGN KEY (`MenuAksiAksiId`) REFERENCES `sys_act` (`AksiId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2017 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_menu_act
-- ----------------------------
INSERT INTO `sys_menu_act` VALUES (1995, 1, 1);
INSERT INTO `sys_menu_act` VALUES (1997, 2, 1);
INSERT INTO `sys_menu_act` VALUES (1998, 2, 2);
INSERT INTO `sys_menu_act` VALUES (1999, 2, 3);
INSERT INTO `sys_menu_act` VALUES (2000, 2, 4);
INSERT INTO `sys_menu_act` VALUES (2001, 2, 5);
INSERT INTO `sys_menu_act` VALUES (2002, 4, 1);
INSERT INTO `sys_menu_act` VALUES (2003, 4, 2);
INSERT INTO `sys_menu_act` VALUES (2004, 4, 3);
INSERT INTO `sys_menu_act` VALUES (2005, 4, 4);
INSERT INTO `sys_menu_act` VALUES (2006, 4, 5);
INSERT INTO `sys_menu_act` VALUES (2007, 5, 1);
INSERT INTO `sys_menu_act` VALUES (2008, 6, 1);
INSERT INTO `sys_menu_act` VALUES (2009, 6, 2);
INSERT INTO `sys_menu_act` VALUES (2010, 6, 3);
INSERT INTO `sys_menu_act` VALUES (2011, 6, 4);
INSERT INTO `sys_menu_act` VALUES (2012, 6, 5);
INSERT INTO `sys_menu_act` VALUES (2013, 7, 1);
INSERT INTO `sys_menu_act` VALUES (2014, 7, 2);
INSERT INTO `sys_menu_act` VALUES (2015, 7, 3);
INSERT INTO `sys_menu_act` VALUES (2016, 7, 4);
INSERT INTO `sys_menu_act` VALUES (2017, 7, 5);
INSERT INTO `sys_menu_act` VALUES (2018, 8, 1);
INSERT INTO `sys_menu_act` VALUES (2019, 9, 1);
INSERT INTO `sys_menu_act` VALUES (2020, 9, 2);
INSERT INTO `sys_menu_act` VALUES (2021, 9, 3);
INSERT INTO `sys_menu_act` VALUES (2022, 9, 4);
INSERT INTO `sys_menu_act` VALUES (2023, 10, 1);
INSERT INTO `sys_menu_act` VALUES (2024, 10, 2);
INSERT INTO `sys_menu_act` VALUES (2025, 10, 3);
INSERT INTO `sys_menu_act` VALUES (2026, 10, 4);
INSERT INTO `sys_menu_act` VALUES (2027, 11, 1);
INSERT INTO `sys_menu_act` VALUES (2028, 11, 2);
INSERT INTO `sys_menu_act` VALUES (2029, 11, 3);
INSERT INTO `sys_menu_act` VALUES (2030, 11, 4);
INSERT INTO `sys_menu_act` VALUES (2031, 12, 1);
INSERT INTO `sys_menu_act` VALUES (2032, 12, 2);
INSERT INTO `sys_menu_act` VALUES (2033, 12, 3);
INSERT INTO `sys_menu_act` VALUES (2034, 12, 4);

-- ----------------------------
-- Table structure for sys_page_info
-- ----------------------------
DROP TABLE IF EXISTS `sys_page_info`;
CREATE TABLE `sys_page_info`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `MenuId` int NOT NULL,
  `Content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `DateCreated` datetime NULL DEFAULT NULL,
  `UpdatedBy` int NULL DEFAULT NULL,
  `DateUpdated` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_page_info
-- ----------------------------

-- ----------------------------
-- Table structure for sys_user_group
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_group`;
CREATE TABLE `sys_user_group`  (
  `UserGroupId` int NOT NULL AUTO_INCREMENT,
  `UserGroupUserId` bigint NULL DEFAULT NULL,
  `UserGroupGroupId` int NULL DEFAULT NULL,
  `UserGroupIsDefault` enum('0','1') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '0',
  PRIMARY KEY (`UserGroupId`) USING BTREE,
  INDEX `FK_sys_user_group`(`UserGroupUserId` ASC) USING BTREE,
  INDEX `FK_sys_user_groupa`(`UserGroupGroupId` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14672 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_user_group
-- ----------------------------
INSERT INTO `sys_user_group` VALUES (14672, 99971749675794438, 1, '1');

SET FOREIGN_KEY_CHECKS = 1;
