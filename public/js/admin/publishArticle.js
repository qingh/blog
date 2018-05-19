$('#publis').on('click', function() {
    let labelId = $('#label').val(),
        title = $.trim($('#title').val()),
        src = $.trim($('#src').val());

    if (!title) {
        layer.msg('请输入标题');
        return;
    }
    if (!src) {
        layer.msg('请输入路径');
        return;
    }
    if ($('#label option').length === 1) {
        layer.msg('请先创建分类');
        return;
    } else {
        if (labelId === '0') {
            layer.msg('请选择分类');
            return;
        }
    }


    $.ajax({
        url: '/admin/publishArticle',
        type: 'post',
        data: {
            labelId: labelId,
            title: title,
            src: src
        },
        success: function(data) {
            if (data.result) {
                setTimeout(function() {
                    location.href = '/admin/articleManage';
                }, 2000);
            }
            layer.msg(data.msg);
        }
    });
});