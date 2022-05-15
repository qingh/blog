const router = require('koa-router')();

router.get('/about', async function (ctx) {
	await ctx.render('about', {
		title: '关于本站'
	});
});

module.exports = router;