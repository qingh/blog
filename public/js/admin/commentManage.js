$('#tab').on('click', '.delete', function () {
	let that = $(this),
		id = $(this).attr('data-id');
	$.ajax({
		url: '/admin/delMsg',
		type: 'post',
		data: {
			id: id
		},
		success: function (data) {
			if (data.result) {
				that.closest('tr').remove();
			}
			layer.msg(data.msg);
		}
	});
});

//分页
laypage({
	cont: 'page',
	pages: Math.ceil(parseInt($('#tab').attr('data-number')) / 20), //总页数
	curr: (function () { //当前页
		let page = location.search.match(/page=(\d+)/);
		return page ? page[1] : 1;
	})(),
	jump: function (e, first) {
		if (!first) { //一定要加此判断，否则初始时会无限刷新
			location.href = '?page=' + e.curr;
		}
	}
});