//修改分类
$('#tab').on('click', '.edit', function() {
    let that = $(this),
        id = $(this).attr('data-id');
    layer.prompt({ title: '修改分类', formType: 3 }, function(text, index) {
        layer.close(index);
        $.ajax({
            url: '/admin/editLabel',
            type: 'post',
            data: {
                id: id,
                name: $.trim(text)
            },
            success: function(data) {
                if (data.result) {
                    that.parent().prev().html($.trim(text));
                }
                layer.msg(data.msg);
            }
        });
    });
});

//删除分类
$('#tab').on('click', '.delete', function() {
    let that = $(this),
        id = $(this).attr('data-id');
    layer.alert('删除此分类后，该分类下的文章都会变为未分类，确认删除？', {
        title: '删除分类'
    }, function(index) {
        layer.close(index);
        $.ajax({
            url: '/admin/delLabel',
            type: 'post',
            data: {
                id: id
            },
            success: function(data) {
                if (data.result) {
                    if (data.len === 1) {
                        location.reload();
                    } else {
                        that.closest('tr').remove();
                    }
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
        //增加分类
        $.ajax({
            url: '/admin/addLabel',
            type: 'post',
            data: {
                name: $.trim(text)
            },
            success: function(data) {
                if (data.result) {
                    if (data.len === 0) {
                        location.reload();
                    } else {
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

                }
                layer.msg(data.msg);
            }
        });
    });
});