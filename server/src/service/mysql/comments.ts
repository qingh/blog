import { ParameterizedContext } from 'koa'
import { Op, literal } from 'sequelize'
import formidable from 'formidable'
import { response, handlError } from '../../utils/index.js'
import { ormArticle } from '../../model/articles.js'
import { ormComment } from '../../model/comments.js'

/** 评论列表 */
async function getCommentList(ctx: ParameterizedContext) {
  const { current = 1, pageSize = 10, id, title, comment } = ctx.query
  const articleIdFilter = id ? { id } : {}
  const commentFilter = comment ? { comment: { [Op.like]: `%${comment}%` } } : {}
  const mergeFilter = { ...articleIdFilter, ...commentFilter }

  try {
    const offset = Number(current) * Number(pageSize) - Number(pageSize)
    const data = await ormComment.findAndCountAll({
      attributes: {
        include: [
          [
            // 子查询
            literal(`(SELECT title FROM articles WHERE comments.article_id = articles.id)`),
            'title'
          ]
        ]
      },
      where: {
        ...mergeFilter,
        ...title ? {
          article_id: { // where 子句
            [Op.in]: literal(`(SELECT id FROM articles WHERE title LIKE '%${title}%')`)
          }
        } : {}
      },
      limit: Number(pageSize),
      offset
    })

    return {
      ...response.resSuccess,
      data: {
        total: data.count,
        records: data.rows
      }
    }
  } catch (err) {
    return handlError(err as Error)
  }
}

/** 发表评论(此接口需要上传图像) */
async function addComment(ctx: ParameterizedContext) {
  const form = formidable({
    multiples: false,
    keepExtensions: true,
    uploadDir: './dist/public/assets/images'
  })
  try {
    const result = await new Promise((resolve, reject) => {
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
          try {
            const data = await ormArticle.findAll({
              raw: true,
              where: {
                id: article_id
              }
            })
            if (data.length !== 1) {
              reject(JSON.stringify({
                ...response.resError,
                message: '资源不存在'
              }))
            }
            await ormComment.create({ article_id, nick_name, comment, fileUrl })
            resolve(response.resSuccess)
          } catch (err) {
            reject(err)
          }
        }
      })
    })
    return result
  } catch (err) {
    return handlError(err as Error)
  }
}

/** 删除评论 */
async function deleteComment(ctx: ParameterizedContext) {
  const { id = 0 } = ctx.params
  try {
    const data1 = await ormComment.findAll({
      raw: true,
      where: { id }
    })
    if (data1.length !== 1) {
      return {
        ...response.resError,
        message: '资源不存在'
      }
    }
    await ormComment.destroy({
      where: { id }
    })
    return response.resSuccess
  } catch (err) {
    return handlError(err as Error)
  }
}

export {
  getCommentList,
  addComment,
  deleteComment
}
