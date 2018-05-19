
const Sequelize = require('sequelize'),
	sequelize = require('../config/seq'),
	users = sequelize.define('user', {
		username: {
			type: Sequelize.STRING,
			allowNull: false
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false
		}
	});

sequelize.sync();

module.exports = users;