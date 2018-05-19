const router = require('koa-router')(),
	common = require('../common'),
	db = require('../mysql');

router.prefix('/blog');

router.get('/', async function (ctx) {
	try {
		let sql1 = `SELECT articles.article_id,articles.title,articles.date,(SELECT COUNT(*) FROM comments WHERE comments.a_id = articles.article_id) AS num FROM articles ORDER BY date DESC`,
			sql2 = `SELECT A.label_id,A.name,(SELECT COUNT(*) FROM articles WHERE label_id=A.label_id) AS num FROM labels A`,
			[articleList] = await db.query(sql1),
			[labelList] = await db.query(sql2),

			str = ``,
			now = new Date(),
			setDate = new Date();
		setDate.setDate(1);
		for (let i of articleList) {
			i.date = common.formatTime(i.date).split(' ')[0];
		}

		str +=
			`<div class="date-change">
	        <a class="date-prev" id="prev" href="Javascript:;" title="上个月">&lt;</a>
	        <p id="nowTime" data-time="${now.getFullYear()}-${now.getMonth() + 1}">${now.getFullYear()}年${now.getMonth() + 1}月</p>
	        <a class="date-next" id="next" href="Javascript:;" title="下个月">&gt;</a>
        </div>
        <table id="tab" class="date-tab">
	        <thead>
	    		<tr>
	    			<th>日</th>
	    			<th>一</th>
	    			<th>二</th>
	    			<th>三</th>
	    			<th>四</th>
	    			<th>五</th>
	    			<th>六</th>
	    		</tr>
	    	</thead><tbody>`;

		for (let i = 0; i < 6; i++) {
			str += `<tr>
        		<td></td>
        		<td></td>
        		<td></td>
        		<td></td>
        		<td></td>
        		<td></td>
        		<td></td>
        	</tr>`;
		}
		str += `</tbody></table>`;

		await ctx.render('blog', {
			title: '刘庆华的个人博客',
			articleList: articleList,
			labelList: labelList,
			dateStr: str,
			nowDate: new Date().getTime()
		});
	} catch (e) {
		await ctx.render('500', {
			title: '500',
			msg: e
		});
	}
});

module.exports = router;