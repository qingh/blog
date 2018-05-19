const Koa = require('koa'),
	views = require('koa-views'),
	session = require('koa-session2'),
	favicon = require('koa-favicon'),
	koaStatic = require('koa-static'),
	bodyparser = require('koa-bodyparser'),
	config = require('./config/db'),
	logger = require('./log'),
	app = new Koa();

// 建库
require('./model/users');
require('./model/articles');
require('./model/comments');
require('./model/labels');

logger.info(`当前是${config.env}环境`);
logger.info(`端口是${config.port}`);

const index = require('./routes/index'),
	article = require('./routes/article'),
	blog = require('./routes/blog'),
	about = require('./routes/about'),
	admin = require('./routes/admin');

app.use(bodyparser());
app.use(koaStatic('public'));
app.use(favicon('./public/images/favicon.ico'));
app.use(views('views', {
	extension: 'pug'
}));

let arr = [];
for (let i = 0; i < 100000; i++) {
	arr.push('keys_' + Math.random());
}
app.keys = arr;
app.use(session({
	key: 'sess',
	maxAge: 20 * 60 * 1000,
	path: '/',
	overwrite: true,
	httpOnly: true,
	signed: true,
	rolling: false,
}));

app.use(index.routes(), index.allowedMethods());
app.use(article.routes(), article.allowedMethods());
app.use(blog.routes(), blog.allowedMethods());
app.use(about.routes(), about.allowedMethods());
app.use(admin.routes(), admin.allowedMethods());


app.use(async (ctx) => {
	if (ctx.status === 404) {
		await ctx.render('404');
	}
});

app.listen(config.port, '0.0.0.0');