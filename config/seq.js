const db = require('./db'),
	Sequelize = require('sequelize'),
	sequelize = new Sequelize(db[db.env].database, db[db.env].user, db[db.env].password, {
		host: db[db.env].host,
		port: db[db.env].port,
		dialect: 'mysql',
		operatorsAliases: Sequelize.Op,
		pool: {
			max: 5,
			min: 0,
			idle: 10000
		},
		define: {
			underscored: true
		}
	});

module.exports = sequelize;