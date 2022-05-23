import Router from 'koa-router'
import { baseUrl } from '../config/index.js'
import * as Comments from '../service/comments/index.js'

const router = new Router()
router.prefix(`${baseUrl}/comments`)

router.get('/', async (ctx, next) => {
  ctx.body = await Comments.getCommentList(ctx)
})

router.post('/', async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000')
  ctx.set('Access-Control-Allow-Credentials', 'true')
  ctx.body = await Comments.addComment(ctx)
  // ctx.body = 'haha'
})
router.options('/', async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000')
  ctx.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE')
  ctx.set('Access-Control-Allow-Headers', 'content-type')
  ctx.set('Access-Control-Allow-Credentials', 'true')
})

router.delete('/:id', async (ctx, next) => {
  ctx.body = await Comments.deleteComment(ctx)
})

export {
  router as comments
}
