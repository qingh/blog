import { ParameterizedContext } from 'koa'
import formidable from 'formidable'
import { db } from '../../database/mysql.js'
import { response } from '../../utils/index.js'

/** 评论列表 */
async function getCommentList(ctx: ParameterizedContext) {
  try {
    const p1 = db.execute('SELECT COUNT(*) AS total FROM comments')
    const p2 = db.execute(`SELECT comments.id,(SELECT articles.title FROM articles WHERE comments.article_id = articles.id) AS title,comment,nick_name,created_at FROM comments`)
    const [res1, res2] = await Promise.allSettled([p1, p2])
    let total = 0
    let data = []
    if (res1.status === 'fulfilled') {
      // @ts-ignore
      total = res1.value[0][0].total
    } else {
      throw res1.reason
    }
    if (res2.status === 'fulfilled') {
      // @ts-ignore
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

/** 发表评论(此接口需要上传图像) */
async function addComment(ctx: ParameterizedContext) {
  // const { article_id, comment, nick_name, avatar } = ctx.request.body
  const form = formidable({
    multiples: false,
    keepExtensions: true,
    uploadDir: './dist/public/assets/images'
  })

  const reslut = await new Promise((resolve, reject) => {
    form.parse(ctx.req, async (err, fields, files) => {
      if (err) {
        reject(JSON.stringify({
          ...response.resError,
          message: err.message
        }))
      } else {
        const { article_id, comment, nick_name } = fields
        if (typeof article_id === 'undefined' || article_id.length === 0) {
          resolve({
            ...response.resError,
            message: `article_id is required`
          })
        }
        if (typeof comment === 'undefined' || comment.length === 0) {
          resolve({
            ...response.resError,
            message: `comment is required`
          })
        }
        if (typeof nick_name === 'undefined' || nick_name.length === 0) {
          resolve({
            ...response.resError,
            message: `nick_name is required`
          })
        }
        const avatar = files.avatar as { newFilename: string }
        let fileUrl = ''
        if (typeof avatar === 'undefined') {
          console.log('没有上传头像')
          fileUrl = '/assets/images/avatar.png'
        } else {
          console.log('有头像')
          fileUrl = `/assets/images/${avatar.newFilename}`
        }
        console.log(fileUrl)
        try {
          const sql = `SELECT * FROM articles WHERE id = '${article_id}'`
          const data = await db.execute(sql)

          // @ts-ignore
          if (data[0].length) {
            const sql2 = `INSERT INTO comments (article_id,nick_name,comment,avatar,created_at,updated_at) VALUES (?,?,?,?,NOW(),NOW())`
            await db.execute(sql2, [article_id, nick_name, comment, fileUrl])
            resolve(response.resSuccess)
          } else {
            resolve({
              ...response.resError,
              message: '资源不存在'
            })
          }
        } catch (err: unknown) {
          let msg = 'Unexpected error'
          if (err instanceof Error) msg = err.message
          reject(JSON.stringify({
            ...response.resError,
            message: msg
          }))
        }
      }
    })
  })
  return reslut
}

/** 删除评论 */
async function deleteComment(ctx: ParameterizedContext) {
  const { id = 0 } = ctx.params
  try {
    const sql = `DELETE FROM comments WHERE id = ${id}`
    const data = await db.execute(sql)
    // @ts-ignore
    if (data[0].affectedRows === 0) {
      return {
        ...response.resError,
        message: '资源不存在'
      }
    } else {
      return response.resSuccess
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
