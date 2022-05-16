import Router from 'koa-router';
import { baseUrl } from '../config/index.js';
const router = new Router()

router.prefix(`${baseUrl}/users`)

router.get('/', function (ctx, next) {
  ctx.body = '用户列表'
})

router.put('/:id', function (ctx, next) {
  ctx.body = '编辑用户'
})

router.delete('/:id', function (ctx, next) {
  ctx.body = '删除用户'
})

router.post('/reg', function (ctx, next) {
  ctx.body = '创建用户'
})

router.post('/login', function (ctx, next) {
  ctx.body = '登录'
})


export {
  router as users
}