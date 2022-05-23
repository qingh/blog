const fs = require('fs'),
	router = require('koa-router')(),
	multer = require('koa-multer'),
	logger = require('../log'),
	common = require('../common'),
	upload = multer({
		dest: './public/images/upload'
	}),
	db = require('../mysql');

router.prefix('/article');

let obj = {
	//修改文件名
	rename: function (oldName, newName) {
		return new Promise(function (resolve, reject) {
			fs.rename(oldName, newName, function (err) {
				if (err) {
					reject(err);
				} else {
					resolve(true);
				}
			});
		});
	}
};

router.get('/', async function (ctx, next) {
	logger.info('客户端IP是2：' + common.getClientIp(ctx.req));
	try {
		let id = ctx.query.id,
			// sql = `SELECT articles.*,labels.name FROM articles INNER JOIN labels on articles.label_id = labels.label_id where articles.article_id = ${id}`,
			sql = `SELECT articles.*,labels.name FROM articles INNER JOIN labels on articles.label_id = labels.label_id where articles.article_id = ${id}`,
			[data] = await db.query(sql);

		if (data.length === 0) {
			await ctx.render('404', {
				title: '404'
			});
		} else {
			data[0].date = common.formatTime(data[0].date);
			ctx.articleData = data[0];
			await next();
		}
	} catch (e) {
		console.log(e);
		await ctx.render('500', {
			title: '500',
			msg: e
		});
	}
});

router.get('/', async function (ctx, next) {
	try {
		let flag1,
			flag2,
			id = parseInt(ctx.query.id),
			sql = `(SELECT * FROM articles WHERE article_id < ${id} ORDER BY article_id desc LIMIT 0,1) union all (SELECT * from articles where article_id > ${id} LIMIT 0,1)`,
			[aboutData] = await db.query(sql);

		if (aboutData.length) { //如果有数据
			if (aboutData.length === 1) { //只查询出一条
				if (aboutData[0].articleId < id) {
					flag1 = true;
				} else {
					flag2 = true;
				}
			} else {
				flag1 = true;
				flag2 = true;
			}
		} else { //查询结果为空，只有一篇文章的时候，是没有上一篇和下一篇的
			flag1 = false;
			flag2 = false;
		}

		ctx.aboutData = aboutData;
		ctx.flag1 = flag1;
		ctx.flag2 = flag2;
		await next();
	} catch (e) {
		console.log('2222:',e);
		await ctx.render('500', {
			title: '500',
			msg: e
		});
	}
});

router.get('/', async function (ctx) {
	try {
		let id = parseInt(ctx.query.id),
			sql = `SELECT
				@row := @row + 1 as floor,
				comments.*
				FROM comments, (SELECT @row := 0) t
				WHERE a_id = ${id}`,
			[msgData] = await db.query(sql);

		for (let d of msgData) {
			d.date = common.formatTime(d.date);
		}

		await ctx.render('article', {
			title: ctx.articleData.title,
			articleMsg: ctx.articleData,
			aboutData: ctx.aboutData,
			prev: ctx.flag1 || false,
			next: ctx.flag2 || false,
			msgData: msgData,
			msgLen: msgData.length
		});
	} catch (e) {
		console.log('3333:',e);
		await ctx.render('500', {
			title: '500',
			msg: e
		});
	}
});

//点赞
router.post('/zan', async function (ctx) {
	let //ip = common.getClientIp(ctx.req),
		cId = ctx.request.body.commonId;
	try {
		let sql = `UPDATE comment SET zan = zan + 1 WHERE cId = ${cId}`;
		await db.query(sql);
		ctx.body = {
			result: true,
			msg: '成功给这条评论点了个赞'
		};
	} catch (e) {
		ctx.body = {
			result: false,
			msg: '点赞失败',
			data: e
		};
	}
});

//点踩
router.post('/cai', async function (ctx) {
	try {
		let id = ctx.request.body.commonId,
			sql = `UPDATE comment SET cai = cai + 1 WHERE cId = ${id}`;
		await db.query(sql);

		ctx.body = {
			result: true,
			msg: '您反对了此条评论'
		};
	} catch (e) {
		ctx.body = {
			result: false,
			msg: '你暂时投不了反对票哦',
			data: e
		};
	}
});

//发表留言
router.post('/sendMsg', async function (ctx) {
	try {
		let param = ctx.request.body,
			msgContent = param.content.replace(/(&lt)/g, '<').replace(/(&gt)/g, '>'),
			sql = `INSERT INTO comment (nickName,aId,content,photo,zan,cai,date) VALUES ('${param.nickName}',${param.aId},'${msgContent}','${param.photo}',0,0,NOW())`,
			[d] = await db.query(sql);
		d.date = common.formatTime(new Date());
		ctx.body = {
			result: true,
			msg: '留言已发布',
			data: d
		};
	} catch (e) {
		ctx.body = {
			result: false,
			msg: '留言发布失败',
			data: e
		};
	}
});

//上传图像
router.post('/fileUpload', upload.any(), async function (ctx) {
	const file = ctx.req.files[0],
		oldName = file.destination + '/' + file.filename,
		arr = file.originalname.split('.'),
		type = arr[arr.length - 1], //文件类型
		newName = oldName + '.' + type;
	//限制大小 20M
	if (file.size > 20 * 1024 * 1024) {
		ctx.body = {
			result: false,
			msg: '文件超过20M，已被删除'
		};
		fs.unlink(oldName, function () {
			logger.info('由于文件过大，已成功删除');
		});
	} else {
		try {
			//修改文件名
			await obj.rename(oldName, newName);
			ctx.body = {
				result: true,
				src: './images/upload/' + file.filename + '.' + type,
				msg: '文件上传成功'
			};
		} catch (e) {
			ctx.body = {
				result: false,
				msg: e
			};
		}
	}
});

module.exports = router;