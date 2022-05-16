import Router from 'koa-router';
import { baseUrl } from '../config/index.js';

const router = new Router()
router.prefix(`${baseUrl}/comments`)

router.get('/', async (ctx, next) => {
  ctx.body = '评论列表'
})

router.post('/', async (ctx, next) => {
  ctx.body = '发表评论'
})

router.delete('/:id', async (ctx, next) => {
  ctx.body = '删除评论'
})

export {
  router as comments
}