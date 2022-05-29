import Router from 'koa-router'
import { db, baseUrl } from '../config/index.js'

const Articles = await import(`../service/${db}/articles.js`)

const router = new Router()
router.prefix(`${baseUrl}/articles`)

/** 文章列表 */
router.get('/', async (ctx, next) => {
  ctx.body = await Articles.getArticlesList(ctx)
})

/** 文章列表，client端使用，不需要认证 */
router.get('/list', async (ctx, next) => {
  ctx.body = await Articles.getArticlesList(ctx)
})

/** 文章详情 */
router.get('/:id', async (ctx, next) => {
  ctx.body = await Articles.getArticlesDetail(ctx)
})

/** 文章详情(附带评论) */
router.get('/articlesDetailAndCommentList/:id', async (ctx, next) => {
  ctx.body = await Articles.getArticlesDetailAndCommentList(ctx)
})

/** 当前文章的上下文（上一页、下一页） */
router.get('/:id/context', async (ctx, next) => {
  ctx.body = await Articles.getArticlesContext(ctx)
})

/** 发布文章 */
router.post('/', async (ctx, next) => {
  ctx.body = await Articles.publisArticle(ctx)
})

/** 更新文章 */
router.patch('/:id', async (ctx, next) => {
  ctx.body = await Articles.updateArticle(ctx)
})

/** 删除文章 */
router.delete('/:id', async (ctx, next) => {
  ctx.body = await Articles.deleteArticle(ctx)
})

export {
  router as articles
}
