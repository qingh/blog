
const Sequelize = require('sequelize'),
	sequelize = require('../config/seq'),
	articles = sequelize.define('article', {
		article_id: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		label_id: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		title: {
			type: Sequelize.STRING,
			allowNull: false
		},
		content: {
			type: Sequelize.STRING,
			allowNull: false
		},
		date: {
			type: Sequelize.DATE,
			allowNull: false
		},
		author: {
			type: Sequelize.STRING,
			allowNull: false
		},
		browser: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		src: {
			type: Sequelize.STRING,
			allowNull: false
		}
	});

sequelize.sync();

module.exports = articles;