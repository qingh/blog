import Router from 'koa-router'
import { baseUrl } from '../config/index.js'
import * as Users from '../service/users/index.js'

const router = new Router()
router.prefix(`${baseUrl}/users`)

router.get('/', async (ctx, next) => {
  ctx.body = await Users.getUserList(ctx)
})

router.post('/', async (ctx, next) => {
  ctx.body = await Users.addUser(ctx)
})

router.patch('/:id', async (ctx, next) => {
  ctx.body = await Users.updateUser(ctx)
})

router.delete('/:id', async (ctx, next) => {
  ctx.body = await Users.deleteUser(ctx)
})

router.post('/login', async (ctx, next) => {
  ctx.body = await Users.login(ctx)
})

export {
  router as users
}
