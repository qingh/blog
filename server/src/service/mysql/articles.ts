import { ParameterizedContext } from 'koa'
import { Op, literal } from 'sequelize'
import { response, handlError } from '../../utils/index.js'
import { ormArticle } from '../../model/articles.js'
import { ormComment } from '../../model/comments.js'

/** 文章列表 */
async function getArticlesList(ctx: ParameterizedContext) {
  const { current = 1, pageSize = 10, id, title, label_id, user_id } = ctx.query
  const articleIdFilter = id ? { id } : {}
  const titleFilter = title ? { title: { [Op.like]: `%${title}%` } } : {}
  const labelIdFilter = label_id ? { label_id } : {}
  const authorFilter = user_id ? { user_id } : {}
  const mergeFilter = { ...titleFilter, ...articleIdFilter, ...labelIdFilter, ...authorFilter }

  try {
    const offset = Number(current) * Number(pageSize) - Number(pageSize)
    const p1 = await ormArticle.findAndCountAll({
      attributes: {
        include: [
          [
            // 子查询
            literal(`(SELECT username FROM users WHERE id = articles.user_id)`),
            'author'
          ],
          [
            // 子查询
            literal(`(SELECT label FROM labels WHERE id = articles.label_id)`),
            'label'
          ]
        ]
      },
      where: mergeFilter,
      limit: Number(pageSize),
      offset
    })
    return {
      ...response.resSuccess,
      data: {
        total: p1.count,
        records: p1.rows
      }
    }
  } catch (err) {
    return handlError(err as Error)
  }
}

/** 文章详情 */
async function getArticlesDetail(ctx: ParameterizedContext) {
  const { id = 0 } = ctx.params
  try {
    const data = await ormArticle.findAll({
      raw: true,
      where: { id }
    })
    if (data.length !== 1) {
      return {
        ...response.resError,
        message: '资源不存在'
      }
    }
    return {
      ...response.resSuccess,
      data: data[0]
    }
  } catch (err) {
    return handlError(err as Error)
  }
}

/** 文章详情(附带评论) */
async function getArticlesDetailAndCommentList(ctx: ParameterizedContext) {
  const { id = 0 } = ctx.params
  // eslint-disable-next-line prefer-const
  let result: { errorCode: number, message: string, data?: { [key: string]: any } } = await getArticlesDetail(ctx)
  try {
    const data = await ormComment.findAll({
      where: { article_id: id }
    })
    result.data!.comment = data
  } catch (err) {
    return handlError(err as Error)
  }
  return result
}

async function getArticlesContext(ctx: ParameterizedContext) {
  const { id = 0 } = ctx.params
  try {
    const prevPromise = ormArticle.findAll({
      raw: true,
      attributes: ['id', 'title'],
      where: {
        id: {
          [Op.lt]: id
        }
      },
      limit: 1
    })
    const nextPromise = ormArticle.findAll({
      raw: true,
      attributes: ['id', 'title'],
      where: {
        id: {
          [Op.gt]: id
        }
      },
      limit: 1
    })

    const [res1, res2] = await Promise.allSettled([prevPromise, nextPromise])
    let prevData = {}
    let nextData = {}
    if (res1.status === 'fulfilled') {
      prevData = res1.value[0]
    } else {
      throw res1.reason
    }
    if (res2.status === 'fulfilled') {
      nextData = res2.value[0]
    } else {
      throw res2.reason
    }
    return {
      ...response.resSuccess,
      data: {
        prevData,
        nextData
      }
    }
  } catch (err) {
    return handlError(err as Error)
  }
}

/** 发布文章 */
async function publisArticle(ctx: ParameterizedContext) {
  const { title, label_id, content } = ctx.request.body
  try {
    if (typeof title === 'undefined') {
      return {
        ...response.resError,
        message: `title is required`
      }
    }

    if (typeof label_id === 'undefined') {
      return {
        ...response.resError,
        message: `label is required`
      }
    }

    if (typeof content === 'undefined') {
      return {
        ...response.resError,
        message: `content is required`
      }
    }

    await ormArticle.create({
      label_id,
      user_id: 1, // todo
      title,
      content
    })
    return {
      ...response.resSuccess
    }
  } catch (err) {
    return handlError(err as Error)
  }
}

/** 更新文章 */
async function updateArticle(ctx: ParameterizedContext) {
  const { id = 0, label_id, title, content } = ctx.request.body
  try {
    const data = await ormArticle.findAll({
      raw: true,
      where: { id }
    })
    if (data.length !== 1) {
      return {
        ...response.resError,
        message: '资源不存在'
      }
    }
    await ormArticle.update({ label_id, title, content }, { where: { id } })
    return {
      ...response.resSuccess
    }
  } catch (err) {
    return handlError(err as Error)
  }
}

/** 删除文章 */
async function deleteArticle(ctx: ParameterizedContext) {
  const { id = 0 } = ctx.params
  try {
    const data = await ormArticle.findAll({
      raw: true,
      where: { id }
    })
    if (data.length !== 1) {
      return {
        ...response.resError,
        message: '资源不存在'
      }
    }
    await ormArticle.destroy({
      where: { id }
    })
    return response.resSuccess
  } catch (err) {
    return handlError(err as Error)
  }
}

export {
  getArticlesList,
  getArticlesDetail,
  getArticlesDetailAndCommentList,
  getArticlesContext,
  publisArticle,
  updateArticle,
  deleteArticle
}
