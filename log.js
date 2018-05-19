const log4js = require('log4js');
log4js.configure({
	appenders: {
		out: {
			type: 'console'
		},
		tasks: {
			type: 'dateFile',
			//filename: 'logs/task',
			filename: 'debug.log'
			//pattern: '-dd.log',
			//alwaysIncludePattern: true
		}
	},
	categories: {
		default: {
			appenders: ['out'],
			level: 'info'
		},
		task: {
			appenders: ['tasks'],
			level: 'info'
		}
	}
});

const logger = log4js.getLogger('out');

module.exports = logger;