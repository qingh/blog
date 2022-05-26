import Router from 'koa-router'
import { db, baseUrl } from '../config/index.js'

const Comments = await import(`../service/${db}/comments.js`)

const router = new Router()
router.prefix(`${baseUrl}/comments`)

router.get('/', async (ctx, next) => {
  ctx.body = await Comments.getCommentList(ctx)
})

router.post('/', async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000')
  ctx.set('Access-Control-Allow-Credentials', 'true')
  ctx.body = await Comments.addComment(ctx)
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
