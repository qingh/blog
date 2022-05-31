import Router from 'koa-router'
import { db, baseUrl } from '../config/index.js'

const Labels = await import(`../service/${db}/labels.js`)

const router = new Router()
router.prefix(`${baseUrl}/labels`)

/** 分类列表 */
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

/** 分类列表并返回该分类关联的文章数量 */
router.get('/articleNumOfLabel', async (ctx, next) => {
  ctx.body = await Labels.articleNumOfLabel(ctx)
})

export {
  router as labels
}
