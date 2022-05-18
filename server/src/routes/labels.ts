import Router from 'koa-router'
import { baseUrl } from '../config/index.js'
import * as Labels from '../service/labels/index.js'

const router = new Router()
router.prefix(`${baseUrl}/labels`)

router.get('/', async (ctx, next) => {
  ctx.body = await Labels.getLabelList()
})

router.post('/', async (ctx, next) => {
  ctx.body = await Labels.addLabel(ctx.request.body)
})

router.patch('/:id', async (ctx, next) => {
  const { id = 0 } = ctx.params
  const { name } = ctx.request.body
  ctx.body = await Labels.updateLabel({
    id: Number(id),
    name
  })
})

router.delete('/:id', async (ctx, next) => {
  const { id = 0 } = ctx.params
  ctx.body = await Labels.deleteLabel(Number(id))
})

export {
  router as labels
}
