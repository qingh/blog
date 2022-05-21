import Router from 'koa-router'
import { baseUrl } from '../config/index.js'
import * as Labels from '../service/labels/index.js'

const router = new Router()
router.prefix(`${baseUrl}/labels`)

/** 标签列表 */
router.get('/', async (ctx, next) => {
  ctx.body = await Labels.getLabelList()
})

router.post('/', async (ctx, next) => {
  ctx.body = await Labels.addLabel(ctx.request.body)
})

router.patch('/:id', async (ctx, next) => {
  const { id = 0 } = ctx.params
  const { label } = ctx.request.body
  ctx.body = await Labels.updateLabel({
    id: Number(id),
    label
  })
})

router.delete('/:id', async (ctx, next) => {
  const { id = 0 } = ctx.params
  ctx.body = await Labels.deleteLabel(Number(id))
})

/** 标签列表并返回该标签关联的文章数量 */
router.get('/articleNumOfLabel', async (ctx, next) => {
  ctx.body = await Labels.articleNumOfLabel()
})

export {
  router as labels
}
