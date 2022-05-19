import Router from 'koa-router'
import { baseUrl } from '../config/index.js'
import * as Users from '../service/users/index.js'

const router = new Router()
router.prefix(`${baseUrl}/users`)

router.get('/', async (ctx, next) => {
  ctx.body = await Users.getUserList()
})

router.post('/', async (ctx, next) => {
  const { username } = ctx.request.body
  ctx.body = await Users.addUser({ username })
})

router.patch('/:id', async (ctx, next) => {
  const { id, username } = ctx.request.body
  console.log(id)
  console.log(username)
  ctx.body = await Users.updateUser({
    id,
    username
  })
})

router.delete('/:id', async (ctx, next) => {
  const { id = 0 } = ctx.params
  ctx.body = await Users.deleteUser(Number(id))
})

router.post('/login', async (ctx, next) => {
  ctx.body = await Users.login(ctx.request.body)
})

export {
  router as users
}
