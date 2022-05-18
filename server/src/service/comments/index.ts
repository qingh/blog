import { db } from '../../database/mysql.js'
import { response } from '../../utils/index.js'

interface IComment {
  article_id: number
  user: string
  comment: string
}

/** 评论列表 */
async function getCommentList () {
  try {
    const p1 = db.execute('SELECT COUNT(*) AS total FROM comments')
    const p2 = db.execute('SELECT * FROM comments')
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
      data = res2.value[0][0]
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

/** 发表评论 */
async function addComment (params: IComment) {
  try {
    if (typeof params.article_id === 'undefined') {
      return {
        ...response.resError,
        message: `article_id is required`
      }
    }
    if (typeof params.comment === 'undefined') {
      return {
        ...response.resError,
        message: `comment is required`
      }
    }

    const sql = `SELECT * FROM articles WHERE id = ${params.article_id}`
    const data = await db.execute(sql)

    // @ts-ignore: Unreachable code error
    if (data[0].length) {
      const sql2 = `INSERT INTO comments (article_id,user,comment,created_at,updated_at) VALUES (?,?,?,'qingh',NOW(),NOW())`
      await db.execute(sql2, [params.article_id, params.user, params.comment])
    } else {
      return {
        ...response.resError,
        message: '你评论的文章不存在'
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

/** 删除评论 */
async function deleteComment (id: number) {
  try {
    const sql = `DELETE FROM comments WHERE id = ${id}`
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
  getCommentList,
  addComment,
  deleteComment
}
