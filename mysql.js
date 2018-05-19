const mysql = require('mysql2/promise'),
	config = require('./config/db'),
	db = mysql.createPool(config[config.env]);

module.exports = db;