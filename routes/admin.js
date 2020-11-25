let router = require('koa-router')(),
  common = require('../common'),
  db = require('../mysql'),
  users = require('../model/users');

//登录拦截
router.use(async (ctx, next) => {
  if (ctx.url === '/admin/login' || ctx.url === '/admin/reg') {
    await next();
  } else {
    if (ctx.session.isLogin) {
      await next();
    } else {
      ctx.redirect('/admin/login');
    }
  }
});

router.prefix('/admin');

//登录
router.get('/login', async function (ctx) {
  //清空录信息
  ctx.session.isLogin = false;
  ctx.session.userId = 0;
  ctx.session.username = '';
  await ctx.render('admin/login', {
    title: '登录',
  });
});

//登录
router.post('/login', async function (ctx) {
  let { username, pwd, code } = ctx.request.body,
    userArr = await users.findAll({
      where: {
        username,
      },
    });
  if (userArr.length) {
    // let [pwdArr] = await db.query(`SELECT password FROM user WHERE userId = ${userArr[0].userId}`);
    if (userArr[0].password === common.md5(pwd + common.md5_suffix)) {
      if (ctx.session.code === parseInt(code)) {
        ctx.session.isLogin = true;
        ctx.session.userId = userArr[0].userId;
        ctx.session.username = userArr[0].username;
        ctx.body = {
          result: true,
          msg: '登录成功',
        };
      } else {
        ctx.body = {
          result: false,
          msg: '验证码错误',
        };
      }
    } else {
      ctx.body = {
        result: false,
        msg: '密码错误',
      };
    }
  } else {
    ctx.body = {
      result: false,
      msg: '用户名错误',
    };
  }
});

//添加用户
router.get('/addUser', async ctx => {
  await ctx.render('admin/addUser', {
    title: '添加用户',
    user: ctx.session.username,
  });
});

//添加用户
router.post('/addUser', async function (ctx) {
  try {
    let { username, password, code } = ctx.request.body,
      [userArr] = await db.query(`SELECT username FROM users WHERE username = '${username}'`);

    password = common.md5(common.md5_suffix + password);
    if (userArr.length) {
      ctx.body = {
        result: false,
        msg: '用户名已存在',
      };
    } else {
      if (ctx.session.code === parseInt(code)) {
        let [reg] = await db.query(`insert into users (username,password) values ('${username}','${password}')`);
        if (reg.affectedRows === 1) {
          ctx.body = {
            result: true,
            msg: '注册成功',
          };
        } else {
          ctx.body = {
            result: false,
            msg: '注册失败',
          };
        }
      } else {
        ctx.body = {
          result: false,
          msg: '验证码错误',
        };
      }
    }
  } catch (err) {
    ctx.body = {
      result: false,
      msg: '注册失败' + err,
    };
  }
});

//后台管理首页
router.get('/', async ctx => {
  await ctx.render('./admin/admin', {
    title: '博客后台管理系统',
    user: ctx.session.username,
  });
});

//文章管理
router.get('/articleManage', async ctx => {
  let page = parseInt(ctx.query.page) || 1, //分页从0开始
    //查询文章相关信息
    sql1 = `SELECT article_id,title,src,date,author,(SELECT labels.name FROM labels WHERE articles.label_id = labels.label_id) as tag FROM articles LIMIT ${
      --page * 4
    },4`,
    //查询文章数量（总条数）
    sql2 = `SELECT COUNT(*) AS number FROM articles`,
    [data] = await db.query(sql1),
    [num] = await db.query(sql2);

  for (let n of data) {
    n.date = common.formatTime(n.date);
  }
  await ctx.render('admin/articleManage', {
    title: '文章管理',
    data: data,
    number: num[0].number,
    user: ctx.session.username,
  });
});

//删除文章
router.post('/delArticle', async ctx => {
  if (ctx.session.username !== 'qingh') {
    ctx.body = {
      result: false,
      msg: '只有超级管理员才有此权限',
    };
  } else {
    try {
      let id = parseInt(ctx.request.body.id),
        sql = `DELETE FROM articles WHERE article_id = ${id}`,
        [data] = await db.query(sql);

      ctx.body = {
        result: true,
        msg: '文章删除成功',
        data: data,
      };
    } catch (err) {
      ctx.body = {
        result: false,
        msg: '留言删除失败',
        data: err,
      };
    }
  }
});

//发布文章
router.get('/publishArticle', async ctx => {
  let sql = `SELECT * FROM labels`,
    [labelList] = await db.query(sql);
  labelList.unshift({
    labelId: 0,
    name: '请选择分类',
  });
  await ctx.render('admin/publishArticle', {
    title: '发布文章',
    labelList: labelList,
    user: ctx.session.username,
  });
});

//发布文章
router.post('/publishArticle', async ctx => {
  if (ctx.session.username !== 'qingh') {
    ctx.body = {
      result: false,
      msg: '只有超级管理员才有此权限',
    };
  } else {
    try {
      let labelId = ctx.request.body.labelId,
        title = ctx.request.body.title,
        src = ctx.request.body.src,
        content = ctx.request.body.content,
        sql = `insert into articles (label_id,title,src,content,date,author,browser) values 
			(${labelId},'${title}','${src}','${content}',NOW(),'刘庆华',0)`,
        [data] = await db.query(sql);
      ctx.body = {
        result: true,
        msg: '文章已发布',
        data: data,
      };
    } catch (err) {
      ctx.body = {
        result: true,
        msg: '文章发布失败',
        data: err,
      };
    }
  }
});

//编辑文章
router.get('/editArticle', async ctx => {
  try {
    let id = ctx.query.id,
      sql1 = `SELECT * FROM articles WHERE article_id = ${id}`,
      sql2 = `SELECT * FROM labels`,
      [data] = await db.query(sql1),
      [labelList] = await db.query(sql2);

    labelList.unshift({
      labelId: 0,
      name: '请选择分类',
    });
    await ctx.render('./admin/editArticle', {
      title: '编辑文章',
      data: data[0],
      labelList: labelList,
      user: ctx.session.username,
    });
  } catch (err) {
    await ctx.render('500', {
      title: '500',
      msg: err,
    });
  }
});

//更新文章
router.post('/updateArticle', async ctx => {
  if (ctx.session.username !== 'qingh') {
    ctx.body = {
      result: false,
      msg: '只有超级管理员才有此权限',
    };
  } else {
    try {
      let id = ctx.request.body.articleId,
        labelId = ctx.request.body.labelId,
        title = ctx.request.body.title,
        src = ctx.request.body.src,
        content = ctx.request.body.content,
        sql = `UPDATE articles SET title = '${title}',src = '${src}',label_id = ${labelId},content = '${content}' WHERE article_id = ${id}`,
        [data] = await db.query(sql);

      ctx.body = {
        result: true,
        msg: '文章更新成功',
        data: data,
      };
    } catch (err) {
      ctx.body = {
        result: true,
        msg: '文章更新失败',
        data: err,
      };
    }
  }
});

//评论管理
router.get('/commentManage', async ctx => {
  let page = parseInt(ctx.query.page) || 1,
    sql1 = `SELECT * FROM comments LIMIT ${--page * 20},20`,
    sql2 = `SELECT COUNT(*) AS number FROM comments`,
    [commentList] = await db.query(sql1),
    [totalComment] = await db.query(sql2);

  for (let n of commentList) {
    n.date = common.formatTime(n.date);
  }
  await ctx.render('admin/commentManage', {
    title: '评论管理',
    data: commentList,
    totalComment: totalComment[0],
    user: ctx.session.username,
  });
});

//删除留言
router.post('/delMsg', async ctx => {
  if (ctx.session.username !== 'qingh') {
    ctx.body = {
      result: false,
      msg: '只有超级管理员才有此权限',
    };
  } else {
    try {
      let id = parseInt(ctx.request.body.id),
        sql = `DELETE FROM comments WHERE id = ${id}`,
        [data] = await db.query(sql);

      ctx.body = {
        result: true,
        msg: '留言删除成功',
        data: data,
      };
    } catch (err) {
      ctx.body = {
        result: false,
        msg: '留言删除失败',
        data: err,
      };
    }
  }
});

//分类管理
router.get('/labelManage', async ctx => {
  let sql = `SELECT * FROM labels`,
    [data] = await db.query(sql);

  await ctx.render('admin/labelManage', {
    title: '分类管理',
    data: data,
    user: ctx.session.username,
  });
});

//添加分类
router.post('/addLabel', async ctx => {
  if (ctx.session.username !== 'qingh') {
    ctx.body = {
      result: false,
      msg: '只有超级管理员才有此权限',
    };
  } else {
    try {
      let val = ctx.request.body.name,
        sql1 = `SELECT COUNT(*) AS num FROM labels`,
        sql2 = `SELECT * FROM labels WHERE labels.name = ('${val}')`,
        sql3 = `insert into labels (name) values ('${val}')`,
        [len] = await db.query(sql1),
        [isExist] = await db.query(sql2);

      if (isExist.length) {
        ctx.body = {
          result: false,
          msg: '分类已存在',
        };
      } else {
        let [data] = await db.query(sql3);
        ctx.body = {
          result: true,
          msg: '分类已添加',
          data: data,
          len: len[0].num,
        };
      }
    } catch (err) {
      ctx.body = {
        result: false,
        msg: '分类添加失败',
        data: err,
      };
    }
  }
});

//编辑分类
router.post('/editLabel', async ctx => {
  if (ctx.session.username !== 'qingh') {
    ctx.body = {
      result: false,
      msg: '只有超级管理员才有此权限',
    };
  } else {
    try {
      let id = ctx.request.body.id,
        val = ctx.request.body.name,
        //查询分类是否存在
        sql1 = `SELECT * FROM labels WHERE labels.name = '${val}'`,
        //更新
        sql2 = `UPDATE labels SET name = '${val}' WHERE label_id = ${id}`,
        [isExist] = await db.query(sql1);

      if (isExist.length) {
        ctx.body = {
          result: false,
          msg: '分类已存在',
        };
      } else {
        await db.query(sql2);
        ctx.body = {
          result: true,
          msg: '分类更新成功',
        };
      }
    } catch (err) {
      ctx.body = {
        result: false,
        msg: '分类更新失败',
        data: err,
      };
    }
  }
});

//删除分类
router.post('/delLabel', async ctx => {
  if (ctx.session.username !== 'qingh') {
    ctx.body = {
      result: false,
      msg: '只有超级管理员才有此权限',
    };
  } else {
    try {
      let id = ctx.request.body.id,
        sql1 = `SELECT COUNT(*) AS num FROM labels`,
        sql2 = `UPDATE articles SET label_id = 1 WHERE label_id = ${id}`,
        sql3 = `DELETE FROM labels WHERE label_id = ${id}`,
        len = await db.query(sql1);
      await db.query(sql2);
      await db.query(sql3);

      ctx.body = {
        result: true,
        msg: '分类已删除',
        len: len[0].num,
      };
    } catch (err) {
      ctx.body = {
        result: false,
        msg: '分类删除失败',
        data: err,
      };
    }
  }
});

//用户管理
router.get('/userManage', async ctx => {
  let data = await users.findAll();
  await ctx.render('admin/userManage', {
    title: '用户管理',
    data: data,
    user: ctx.session.username,
  });
});

//删除用户
router.post('/delUser', async ctx => {
  if (ctx.session.username !== 'qingh') {
    ctx.body = {
      result: false,
      msg: '只有超级管理员才有此权限',
    };
  } else {
    try {
      let userId = ctx.request.body.id,
        sql = `DELETE FROM users WHERE user_id = ${userId}`,
        [data] = await db.query(sql);

      ctx.body = {
        result: true,
        msg: '已删除此用户',
        data: data,
      };
    } catch (err) {
      ctx.body = {
        result: false,
        msg: '用户删除失败',
        data: err,
      };
    }
  }
});

//修改用户名
router.post('/editUserName', async ctx => {
  if (ctx.session.username !== 'qingh') {
    ctx.body = {
      result: false,
      msg: '只有超级管理员才有此权限',
    };
  } else {
    try {
      let userId = ctx.request.body.id,
        username = ctx.request.body.name,
        sql1 = `SELECT username FROM users WHERE username = '${username}'`,
        sql2 = `UPDATE users SET username = '${username}' WHERE user_id = ${userId}`,
        [isExist] = await db.query(sql1);

      if (isExist.length) {
        ctx.body = {
          result: false,
          msg: '用户名已存在',
        };
      } else {
        let [data] = await db.query(sql2);
        ctx.body = {
          result: true,
          msg: '用户名已更新',
          data: data,
        };
      }
    } catch (err) {
      ctx.body = {
        result: false,
        msg: '用户名更新失败',
        data: err,
      };
    }
  }
});

module.exports = router;
