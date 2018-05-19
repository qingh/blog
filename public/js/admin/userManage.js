//编辑用户（修改用户名）
$('#tab').on('click', '.edit', function() {
	let that = $(this),
		id = $(this).attr('data-id');

	layer.prompt({ title: '修改用户名', formType: 3 }, function(text, index) {
		layer.close(index);
		$.ajax({
			url: '/admin/editUserName',
			type: 'post',
			data: {
				id: id,
				name: $.trim(text)
			},
			success: function (data) {
				if (data.result) {
					that.parent().prev().html($.trim(text));
				}
				layer.msg(data.msg);
			}
		});
	});
});
//删除用户
$('#tab').on('click', '.delete', function() {
	let that = $(this),
		id = $(this).attr('data-id');

	layer.alert('确认要删除此用户？', {
		title: '删除用户'
	}, function(index) {
		layer.close(index);
		$.ajax({
			url: '/admin/delUser',
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
});

//增加分类
$('#addType').on('click', function() {
	layer.prompt({ title: '新建分类', formType: 3 }, function(text, index) {
		layer.close(index);
		$.ajax({
			url: '/admin/addLabel',
			type: 'post',
			data: {
				name: $.trim(text)
			},
			success: function (data) {
				if (data.result) {
					let str = `
					<tr>
						<td>${data.data.insertId}</td>
						<td>${$.trim(text)}</td>
						<td>
							<a class="edit" href="javascript:;" data-id=${data.data.insertId}>编辑</a>
							<a class="delete" href="javascript:;" data-id=${data.data.insertId}>删除</a>
						</td>
					</tr>`;
					$('#tab tbody').append(str);
				}
				layer.msg(data.msg);
			}
		});
	});
});