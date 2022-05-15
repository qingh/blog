let db = require('./mysql'),
	crypto = require('crypto'),
	common = {
		//格式化时间
		formatTime: function(obj) {
			if (obj) {
				let year = obj.getFullYear(),
					month = parseInt(obj.getMonth()) + 1 > 9 ? parseInt(obj.getMonth()) + 1 : '0' + (parseInt(obj.getMonth()) + 1),
					day = obj.getDate() > 9 ? obj.getDate() : '0' + obj.getDate(),
					hour = obj.getHours() > 9 ? obj.getHours() : '0' + obj.getHours(),
					min = obj.getMinutes() > 9 ? obj.getMinutes() : '0' + obj.getMinutes(),
					sec = obj.getSeconds() > 9 ? obj.getSeconds() : '0' + obj.getSeconds();
				return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
			} else {
				return obj;
			}
		},
		//获取客户端IP
		getClientIp: function(req) {
			return req.headers['x-forwarded-for'] ||
				req.connection.remoteAddress ||
				req.socket.remoteAddress ||
				req.connection.socket.remoteAddress;
		},
		//md5
		md5_suffix: '~!@#$%^&*()_+QWERTYUIOP{}|', //此行字符串，不可修改
		md5: function(password) {
			let str,
				md5 = crypto.createHash('md5');
			md5.update(password + this.md5_suffix);
			str = md5.digest('hex');
			return str;
		},
		//查询数据
		queryData: function(sql) {
			return new Promise((resolve, reject) => {
				db.query(sql, (err, data) => {
					if (err) {
						reject(err);
					} else {
						resolve(data);
					}
				});
			});
		}
	};

module.exports = common;