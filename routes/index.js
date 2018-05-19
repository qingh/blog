let router = require('koa-router')(),
	captchapng = require('captchapng');

router.get('/', async function (ctx) {
	await ctx.render('index', {
		title: '刘庆华的个人博客'
	});
});

//验证码
router.get("/captchapng", function (ctx) {
	let code = parseInt(Math.random() * 9000 + 1000),
		p = new captchapng(100, 32, code); // width,height,numeric captcha
	p.color(150, 150, 150, 255); //background
	p.color(255, 255, 255, 255); //color
	let img = p.getBase64(),
		imgbase64 = new Buffer(img, 'base64');
	ctx.session.code = code;
	ctx.response.set('Content-Type', 'image/jpg');//此行易出错
	ctx.body = imgbase64;
});

module.exports = router;