import Router from 'koa-router';
import { baseUrl } from '../config/index.js';
const router = new Router()

router.prefix(`${baseUrl}/labels`)
router.get('/', async (ctx, next) => {
  ctx.body = '标签列表'
})


router.post('/', async (ctx, next) => {
  ctx.body = '新增标签'
})

router.put('/:id', async (ctx, next) => {
  ctx.body = '编辑标签'
})

router.delete('/:id', async (ctx, next) => {
  ctx.body = '删除标签'
})

export {
  router as labels
}