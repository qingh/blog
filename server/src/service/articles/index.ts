import { ParameterizedContext } from 'koa'
import { db } from '../../database/mysql.js'
import { response } from '../../utils/index.js'

/** 文章列表 */
async function getArticlesList(ctx: ParameterizedContext) {
  const { current = 1, pageSize = 10 } = ctx.query
  try {
    const offset = Number(current) * Number(pageSize) - Number(pageSize)
    const p1 = db.execute('SELECT COUNT(*) AS total FROM articles')
    const p2 = db.execute(`SELECT * FROM articles LIMIT ${offset},${pageSize}`)
    const [res1, res2] = await Promise.allSettled([p1, p2])
    let total = 0
    let data = []
    if (res1.status === 'fulfilled') {
      // @ts-ignore: Unreachable code error
      total = res1.value[0][0].total
    } else {
      throw res1.reason
    }
    if (res2.status === 'fulfilled') {
      // @ts-ignore: Unreachable code error
      data = res2.value[0]
    } else {
      throw res2.reason
    }
    return {
      ...response.resSuccess,
      data: {
        total,
        records: data
      }
    }
  } catch (err: unknown) {
    let msg = 'Unexpected error'
    if (err instanceof Error) msg = err.message
    return {
      ...response.resError,
      message: msg
    }
  }
}

/** 文章详情 */
async function getArticlesDetail(ctx: ParameterizedContext) {
  const { id = 0 } = ctx.params
  try {
    const data = await db.execute(`SELECT *,(SELECT label FROM labels WHERE id = articles.label_id) AS label FROM articles WHERE id = ${id}`)
    // @ts-ignore: Unreachable code error
    if (data[0].length) {
      return {
        ...response.resSuccess,
        // @ts-ignore: Unreachable code error
        data: data[0][0]
      }
    } else {
      return {
        ...response.resError,
        message: '资源不存在'
      }
    }
  } catch (err: unknown) {
    let msg = 'Unexpected error'
    if (err instanceof Error) msg = err.message
    return {
      ...response.resError,
      message: msg
    }
  }
}

/** 文章详情(附带评论) */
async function getArticlesDetailAndCommentList(ctx: ParameterizedContext) {
  const { id = 0 } = ctx.params
  const result: { errorCode: number, message: string, data?: { [key: string]: any } } = await getArticlesDetail(ctx)
  try {
    const data = await db.execute(`SELECT * FROM comments WHERE article_id = ${id}`)
    // @ts-ignore
    result.data!.comment = data[0]
  } catch (err: unknown) {
    let msg = 'Unexpected error'
    if (err instanceof Error) msg = err.message
    return {
      ...response.resError,
      message: msg
    }
  }
  return result
}

async function getArticlesContext(ctx: ParameterizedContext) {
  const { id = 0 } = ctx.params
  try {
    const prevSql = `SELECT id,title FROM articles WHERE id < ${id} ORDER BY id DESC limit 1`
    const nextSql = `SELECT id,title FROM articles WHERE id > ${id} ORDER BY id limit 1`
    const prevPromise = db.execute(prevSql)
    const nextPromise = db.execute(nextSql)

    const [res1, res2] = await Promise.allSettled([prevPromise, nextPromise])
    let prevData = {}
    let nextData = {}
    if (res1.status === 'fulfilled') {
      // @ts-ignore: Unreachable code error
      prevData = res1.value[0][0]
    } else {
      throw res1.reason
    }
    if (res2.status === 'fulfilled') {
      // @ts-ignore: Unreachable code error
      nextData = res2.value[0][0]
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
  } catch (err: unknown) {
    let msg = 'Unexpected error'
    if (err instanceof Error) msg = err.message
    return {
      ...response.resError,
      message: msg
    }
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

    const sql = `INSERT INTO articles (title,label_id,content,author,created_at,updated_at) VALUES (?,?,?,'qingh',NOW(),NOW())`
    await db.execute(sql, [title, label_id, content])
    return {
      ...response.resSuccess
    }
  } catch (err: unknown) {
    let msg = 'Unexpected error'
    if (err instanceof Error) msg = err.message
    return {
      ...response.resError,
      message: msg
    }
  }
}

/** 更新文章 */
async function updateArticle(ctx: ParameterizedContext) {
  const { id, label_id, title, content } = ctx.request.body
  try {
    const data = await db.execute(`SELECT * FROM articles WHERE id = ${id}`)
    // @ts-ignore
    if (data[0].length !== 1) {
      return {
        ...response.resError,
        message: '资源不存在'
      }
    }

    const sql1 = `UPDATE articles SET label_id = ?,title = ?,content = ?,updated_at = NOW() WHERE id = ${id}`
    const data1 = await db.execute(sql1, [label_id, title, content])
    // @ts-ignore: Unreachable code error
    if (data1[0].affectedRows) {
      return {
        ...response.resSuccess
      }
    } else {
      return {
        ...response.resError,
        message: 'Not Found'
      }
    }
  } catch (err: unknown) {
    let msg = 'Unexpected error'
    if (err instanceof Error) msg = err.message
    return {
      ...response.resError,
      message: msg
    }
  }
}

/** 删除文章 */
async function deleteArticle(ctx: ParameterizedContext) {
  const { id = 0 } = ctx.params
  try {
    const sql = `DELETE FROM articles WHERE id = ${id}`
    const data = await db.execute(sql)
    // @ts-ignore: Unreachable code error
    if (data[0].affectedRows === 0) {
      return {
        ...response.resError,
        message: '资源不存在'
      }
    } else {
      return {
        ...response.resSuccess
      }
    }
  } catch (err: unknown) {
    let msg = 'Unexpected error'
    if (err instanceof Error) msg = err.message
    return {
      ...response.resError,
      message: msg
    }
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
