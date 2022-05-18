import { db } from '../../database/mysql.js'
import { response } from '../../utils/index.js'

/** 文章列表 */
async function getArticlesList(params: ISearch) {
  try {
    const offset = params.current * params.pageSize - params.pageSize
    const p1 = db.execute('SELECT COUNT(*) AS total FROM articles')
    const p2 = db.execute(`SELECT * FROM articles LIMIT ${offset},${params.pageSize}`)
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
async function getArticlesDetail(id: number) {
  try {
    const data = await db.execute(`SELECT * FROM articles WHERE id = ${id}`)
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

/** 发布文章 */
async function publisArticle(params: IArticle) {
  try {
    if (typeof params.title === 'undefined') {
      return {
        ...response.resError,
        message: `title is required`
      }
    }

    if (typeof params.label_id === 'undefined') {
      return {
        ...response.resError,
        message: `label is required`
      }
    }

    if (typeof params.content === 'undefined') {
      return {
        ...response.resError,
        message: `content is required`
      }
    }

    const sql = `INSERT INTO articles (title,label_id,content,author,created_at,updated_at) VALUES (?,?,?,'qingh',NOW(),NOW())`
    await db.execute(sql, [params.title, params.label_id, params.content])
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
async function updateArticle(params: IArticle & { id: number }) {
  try {
    const sql = `UPDATE articles SET label_id = ?,title = ?,content = ?,updated_at = NOW() WHERE id = ${params.id}`
    const data = await db.execute(sql, [params.label_id, params.title, params.content])
    // @ts-ignore: Unreachable code error
    if (data[0].affectedRows) {
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
async function deleteArticle(id: number) {
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
  publisArticle,
  updateArticle,
  deleteArticle
}
