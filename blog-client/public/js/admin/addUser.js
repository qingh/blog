//更新验证码
$('#codeImg').on('click', function () {
	$(this).attr('src', '/captchapng?v=' + Math.random());
});

//注册
$('#reg').on('click', function () {
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
		url: '/admin/addUser',
		type: 'post',
		data: {
			username,
			password: md5(password),
			code
		},
		beforeSend: function () {
			$('#loading').show();
		},
		success: function (data) {
			$('#loading').hide();
			if (data.result) {
				setTimeout(function () {
					location.href = '/admin/login';
				}, 2000);
			}
			layer.msg(data.msg);
		}
	});
});