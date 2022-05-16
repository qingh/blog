import Router from 'koa-router';
import { baseUrl } from '../config/index.js';

const router = new Router()
router.prefix(`${baseUrl}/articles`)

router.get('/', async (ctx, next) => {
  ctx.body = '文章列表'
})

router.get('/:id', async (ctx, next) => {
  ctx.body = '文章详情'
})

router.post('/', async (ctx, next) => {
  ctx.body = '发布文章'
})

router.put('/:id', async (ctx, next) => {
  ctx.body = '更新文章'
})

router.delete('/:id', async (ctx, next) => {
  ctx.body = '删除文章'
})

export {
  router as articles
}