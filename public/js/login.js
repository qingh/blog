$('#login').on('click', function() {
    let username = $.trim($('#username').val()),
        password = $.trim($('#password').val()),
        code = $.trim($('#code').val());
    if (!username) {
        layer.msg('用户名不能为空');
        return false;
    }
    if (!password) {
        layer.msg('密码不能为空');
        return false;
    }
    if (!code) {
        layer.msg('验证码不能为空');
        return false;
    }

    $.ajax({
        url: '/admin/login',
        type: 'post',
        data: {
            username: username,
            pwd: md5(password),
            code: code
        },
        beforeSend: function() {
            $('#loading').show();
        },
        success: function(data) {
            $('#loading').hide();
            if (data.result) {
                setTimeout(function() {
                    location.href = '/admin';
                }, 2000);
            }
            layer.msg(data.msg);
        }
    });
});

$('#codeImg').on('click', function() {
    $(this).attr('src', '/captchapng?v=' + Math.random());
});