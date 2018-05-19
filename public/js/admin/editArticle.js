$('#publis').on('click', function() {
    let that = $(this),
        labelId = $('#label').val(),
        title = $.trim($('#title').val()),
        src = $.trim($('#src').val());

    if (!title) {
        layer.msg('请输入标题');
        return;
    }
    if (!src) {
        layer.msg('请输入文章内容');
        return;
    }
    if (labelId === '0') {
        layer.msg('请选择分类');
        return;
    }

    $.ajax({
        url: '/admin/updateArticle',
        type: 'post',
        data: {
            articleId: that.attr('data-aid'),
            title: title,
            src: src,
            labelId: labelId
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