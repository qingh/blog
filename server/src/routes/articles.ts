import Router from 'koa-router'
import { baseUrl } from '../config/index.js'
import * as Articles from '../service/articles/index.js'

const router = new Router()
router.prefix(`${baseUrl}/articles`)

/** 文章列表 */
router.get('/', async (ctx, next) => {
  ctx.body = await Articles.getArticlesList({
    ...ctx.query,
    current: Number(ctx.query.current),
    pageSize: Number(ctx.query.pageSize)
  })
})

/** 文章详情 */
router.get('/:id', async (ctx, next) => {
  const { id = 0 } = ctx.params
  ctx.body = await Articles.getArticlesDetail(Number(id))
})

/** 发布文章 */
router.post('/', async (ctx, next) => {
  ctx.body = await Articles.publisArticle(ctx.request.body)
})

/** 更新文章 */
router.patch('/:id', async (ctx, next) => {
  ctx.body = await Articles.updateArticle(ctx.request.body)
})

/** 删除文章 */
router.delete('/:id', async (ctx, next) => {
  const { id = 0 } = ctx.params
  ctx.body = await Articles.deleteArticle(Number(id))
})

export {
  router as articles
}
