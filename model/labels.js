
const Sequelize = require('sequelize'),
	sequelize = require('../config/seq'),
	labels = sequelize.define('label', {
		label_id: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false
		}
	});

sequelize.sync();

module.exports = labels;