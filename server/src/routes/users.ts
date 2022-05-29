import Router from 'koa-router'
import { db, baseUrl } from '../config/index.js'

const Users = await import(`../service/${db}/users.js`)

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

router.get('/logout', async (ctx, next) => {
  ctx.body = await Users.logout(ctx)
})

export {
  router as users
}
