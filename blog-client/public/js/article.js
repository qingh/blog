//点赞
$('.zan').on('click', function() {
    let that = $(this);
    $.ajax({
        url: './article/zan',
        type: 'post',
        data: {
            commonId: that.attr('data-commentid')
        },
        success: function(data) {
            if (data.result) {
                that.find('span').html('(' + ++that.text().match(/\d+/g)[0] + ')');
                layer.msg(data.msg);
            } else {
                layer.msg(data.msg);
            }
        }
    });
});

//踩
$('.cai').on('click', function() {
    let that = $(this);
    $.ajax({
        url: './article/cai',
        type: 'post',
        data: {
            commonId: that.attr('data-commentid')
        },
        success: function(data) {
            if (data.result) {
                that.find('span').html('(' + ++that.text().match(/\d+/g)[0] + ')');
                layer.msg(data.msg);
            } else {
                layer.msg(data.msg);
            }
        }
    });
});

//发布留言
$('#publish').on('click', function() {
    let msgContent = $.trim($('#msgContent').val()),
        nickName = $.trim($('#nickName').val());
    if (!msgContent) {
        layer.msg('请输入留言');
        return false;
    }
    if (!nickName) {
        layer.msg('请输入你的大名');
        return false;
    }
    msgContent = msgContent.replace(/</g, '&lt').replace(/>/g, '&gt');
    $.ajax({
        url: './article/sendMsg',
        type: 'post',
        data: {
            aId: location.search.match(/id=(\d+)/)[1],
            nickName: nickName,
            content: msgContent,
            photo: $('#selFile').attr('title')
        },
        success: function(data) {
            if (data.result) {
                layer.msg(data.msg);
                if ($('#msgLen').length === 0) {
                    setTimeout(function() {
                        location.reload();
                    }, 1500);
                } else {
                    let len = parseInt($('#msgLen').html().match(/\d+/g)[0]),
                        photo = $('#selFile').attr('title'),
                        str = `
						<li>
							<div class="msg-wrap">
								<div class="photo">
									<img src=${photo} width="72" height="72"><span title=${nickName}>${nickName}</span>
								</div>
								<div class="msg-right">
									<div class="msg-cnt">
										<p>${msgContent}</p>
									</div>
								</div>
							</div>
							<div class="msg-info">
								<a class="zan" href="javascript:;" title="赞" data-commentid="${data.insertId}">
									<i class="iconfont icon-zan"></i>
									<span>(0)</span>
								</a>
								<a class="cai" href="javascript:;" title="踩" data-commentid="${data.insertId}">
									<i class="iconfont icon-cai"></i>
									<span>(0)</span>
								</a>
								<p>${data.data.date}</p>
							</div><a class="floor" href="javascript:;">#${++len}楼</a>
						</li>`;
                    $('#msgList').append(str);
                    $('#msgLen').html(`留言（${++len}条）`);
                }
                $('#msgContent').val('');
                $('#nickName').val('');
                $('#picker').attr('title', '未选择任何文件');
                $('#selFile').attr('title', 'images/default.jpg').html('未选择任何文件');

            } else {
                layer.msg(data.msg);
            }
        }
    });
});

//上传图像
$('#picker').on('change', function() {
    let val = $('#picker').val(),
        arr = val.split('.'),
        len = arr.length,
        ext = arr[len - 1],
        flag = /(jpg|jpeg|png|bmp|gif)/ig.test(ext);
    if (flag) {
        let oMyForm = new FormData();
        oMyForm.append('logo', $('#picker')[0].files[0]);

        $.ajax({
            url: './article/fileUpload',
            type: 'post',
            cache: false,
            contentType: false,
            processData: false,
            data: oMyForm,
            beforeSend: function() {
                $('#loading').show();
            },
            success: function(data) {
                $('#loading').hide();
                if (data.result) {
                    layer.msg(data.msg);
                    $('#picker').attr('title', data.src);
                    $('#selFile').html(data.src).attr('title', data.src);
                } else {
                    layer.msg(data.msg);
                }
            }
        });
    } else {
        layer.msg('请上传正确的图像格式');
    }
});

//iframe高度自适应

function setIframeHeight(iframe) {
    if (iframe) {
        let iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
        if (iframeWin.document.body) {
            iframe.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
        }
    }
}

window.onload = function() {
    setIframeHeight(document.getElementById('mainFrame'));
};