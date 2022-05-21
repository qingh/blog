/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80029
 Source Host           : localhost:3306
 Source Schema         : blog

 Target Server Type    : MySQL
 Target Server Version : 80029
 File Encoding         : 65001

 Date: 21/05/2022 21:50:53
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for articles
-- ----------------------------
DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `label_id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `content` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `author` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `browser` int NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 141 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of articles
-- ----------------------------
INSERT INTO `articles` VALUES (130, 16, 'ttt', 'aaa', 'qingh', 0, '2022-05-18 08:10:22', '2022-05-20 08:36:52');
INSERT INTO `articles` VALUES (136, 12, '花木成畦手自栽', '夏雨来', 'qingh', 0, '2022-05-19 12:13:03', '2022-05-19 12:13:03');
INSERT INTO `articles` VALUES (137, 12, 'aaaa', 'bbb', 'qingh', 0, '2022-05-20 08:37:04', '2022-05-20 08:37:04');
INSERT INTO `articles` VALUES (138, 17, 'bbbb', 'asdf', 'qingh', 0, '2022-05-20 08:37:12', '2022-05-20 08:37:12');
INSERT INTO `articles` VALUES (139, 16, 'ccc', 'asfdsdf', 'qingh', 0, '2022-05-20 08:37:20', '2022-05-20 08:37:20');
INSERT INTO `articles` VALUES (140, 17, 'ttttt', 'asdf', 'qingh', 0, '2022-05-21 21:32:32', '2022-05-21 21:32:32');

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `article_id` int NOT NULL,
  `nick_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `comment` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '/asstes/images/avatar.png',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comments
-- ----------------------------

-- ----------------------------
-- Table structure for labels
-- ----------------------------
DROP TABLE IF EXISTS `labels`;
CREATE TABLE `labels`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `author` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of labels
-- ----------------------------
INSERT INTO `labels` VALUES (12, 'nodejs', '2022-05-19 06:27:09', '2022-05-19 06:27:09', 'qingh');
INSERT INTO `labels` VALUES (16, 'java', '2022-05-19 06:28:56', '2022-05-19 12:13:24', 'qingh');
INSERT INTO `labels` VALUES (17, 'php', '2022-05-20 08:35:20', '2022-05-20 08:35:20', 'qingh');
INSERT INTO `labels` VALUES (18, 'python', '2022-05-21 21:39:12', '2022-05-21 21:39:12', 'qingh');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `admin` tinyint UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'qingh', '123', '2022-05-17 17:04:55', '2022-05-17 17:04:59', 1);
INSERT INTO `users` VALUES (13, 'blue2', '456', '2022-05-19 15:13:47', '2022-05-19 12:19:31', 0);

SET FOREIGN_KEY_CHECKS = 1;
