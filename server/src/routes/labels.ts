import Router from 'koa-router'
import { baseUrl } from '../config/index.js'
import * as Labels from '../service/labels/index.js'

const router = new Router()
router.prefix(`${baseUrl}/labels`)

/** 标签列表 */
router.get('/', async (ctx, next) => {
  ctx.body = await Labels.getLabelList(ctx)
})

router.post('/', async (ctx, next) => {
  ctx.body = await Labels.addLabel(ctx)
})

router.patch('/:id', async (ctx, next) => {
  ctx.body = await Labels.updateLabel(ctx)
})

router.delete('/:id', async (ctx, next) => {
  ctx.body = await Labels.deleteLabel(ctx)
})

/** 标签列表并返回该标签关联的文章数量 */
router.get('/articleNumOfLabel', async (ctx, next) => {
  ctx.body = await Labels.articleNumOfLabel(ctx)
})

export {
  router as labels
}
