import Router from 'koa-router'
import { baseUrl } from '../config/index.js'
import * as Comments from '../service/comments/index.js'

const router = new Router()
router.prefix(`${baseUrl}/comments`)

router.get('/', async (ctx, next) => {
  ctx.body = await Comments.getCommentList()
})

router.post('/', async (ctx, next) => {
  ctx.body = await Comments.addComment(ctx.request.body)
})

router.delete('/:id', async (ctx, next) => {
  const { id = 0 } = ctx.params
  ctx.body = await Comments.deleteComment(Number(id))
})

export {
  router as comments
}
