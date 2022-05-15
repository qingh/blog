
const Sequelize = require('sequelize'),
	sequelize = require('../config/seq'),
	comments = sequelize.define('comment', {
		nick_name: {
			type: Sequelize.STRING,
			allowNull: false
		},
		a_id: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		content: {
			type: Sequelize.STRING,
			allowNull: false
		},
		photo: {
			type: Sequelize.STRING,
			allowNull: false
		},
		zan: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		cai: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		date: {
			type: Sequelize.DATE,
			allowNull: false
		}
	});

sequelize.sync();

module.exports = comments;