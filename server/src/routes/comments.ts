import Router from 'koa-router'
import { db, baseUrl } from '../config/index.js'

const Comments = await import(`../service/${db}/comments.js`)

const router = new Router()
router.prefix(`${baseUrl}/comments`)

router.get('/', async (ctx, next) => {
  ctx.body = await Comments.getCommentList(ctx)
})

router.post('/', async (ctx, next) => {
  ctx.body = await Comments.addComment(ctx)
})

router.delete('/:id', async (ctx, next) => {
  ctx.body = await Comments.deleteComment(ctx)
})

// client接口，不需要认证
router.post('/add', async (ctx, next) => {
  ctx.body = await Comments.addComment(ctx)
})

export {
  router as comments
}
