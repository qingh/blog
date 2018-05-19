module.exports = {
	port: process.env.port || 3000,
	env: process.env.node_env || 'development',
	development: {
		host: 'localhost',
		user: 'root',
		port: 3306,
		password: '12345678',
		database: '2018-03-14'
		// database: 'blog'
	},
	production: {
		host: '104.171.168.137',
		user: 'root',
		port: 3306,
		password: 'c4661ece7e8210eea96535abd106304a',
		database: 'node'
	}
};