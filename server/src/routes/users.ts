import Router from 'koa-router'
import { baseUrl } from '../config/index.js'
import * as Users from '../service/users/index.js'

const router = new Router()
router.prefix(`${baseUrl}/users`)

router.get('/', async (ctx, next) => {
  ctx.body = await Users.getUserList()
})

router.patch('/:id', async (ctx, next) => {
  ctx.body = '编辑用户'
})

router.delete('/:id', async (ctx, next) => {
  ctx.body = '删除用户'
})

router.post('/login', async (ctx, next) => {
  ctx.body = await Users.login(ctx.request.body)
})

export {
  router as users
}
