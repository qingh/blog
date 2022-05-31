import { ParameterizedContext } from 'koa'
import { Op, literal } from 'sequelize'
import { ormArticle } from './../../model/articles.js'
import { response, handlError } from '../../utils/index.js'
import { ormLabel } from '../../model/labels.js'

/** 分类列表 */
async function getLabelList(ctx: ParameterizedContext) {
  const { current = 1, pageSize = 10, id, label, user_id } = ctx.query
  const idFilter = id ? { id } : {}
  const labelFilter = label ? { label: { [Op.like]: `%${label}%` } } : {}
  const mergeFilter = { ...labelFilter, ...idFilter }
  try {
    const offset = Number(current) * Number(pageSize) - Number(pageSize)
    const data = await ormLabel.findAndCountAll({
      attributes: {
        include: [
          [
            // 子查询
            literal(`(SELECT username FROM users WHERE labels.user_id = id)`),
            'author'
          ]
        ]
      },
      where: {
        ...mergeFilter,
        ...user_id ? {
          user_id: { // where 子句
            [Op.in]: literal(`(SELECT id AS user_id FROM users WHERE id = '${user_id}')`)
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

/** 新增分类 */
async function addLabel(ctx: ParameterizedContext) {
  const { label } = ctx.request.body
  try {
    if (typeof label === 'undefined') {
      return {
        ...response.resError,
        message: `label is required`
      }
    }
    const data = await ormLabel.findAll({
      raw: true,
      where: { label }
    })
    if (data.length !== 0) {
      return {
        ...response.resError,
        message: '资源已存在'
      }
    }
    await ormLabel.create({ label, user_id: ctx.session!.id })
    return response.resSuccess
  } catch (err) {
    return handlError(err as Error)
  }
}

/** 编辑分类 */
async function updateLabel(ctx: ParameterizedContext) {
  const { id = 0 } = ctx.params
  const { label } = ctx.request.body
  try {
    if (typeof label === 'undefined' || label === '') {
      return {
        ...response.resError,
        message: `labels'name is required`
      }
    }
    {
      const data = await ormLabel.findOne({
        raw: true,
        where: { id }
      })
      if (ctx.session?.id !== 1 && data?.user_id !== ctx.session?.id) {
        return {
          ...response.resError,
          message: '权限不足，请联系超级管理员'
        }
      }
    }

    {
      const data = await ormLabel.findAll({
        raw: true,
        where: { label }
      })
      if (data.length !== 0) {
        return {
          ...response.resError,
          message: '资源已存在'
        }
      }
    }

    const data = await ormLabel.update({ label }, {
      where: { id }
    })

    if (data[0] !== 1) {
      return {
        ...response.resError,
        message: '资源不存在'
      }
    }
    return response.resSuccess
  } catch (err) {
    return handlError(err as Error)
  }
}

/** 删除分类 */
async function deleteLabel(ctx: ParameterizedContext) {
  const { id = 0 } = ctx.params
  try {
    const data = await ormLabel.findOne({
      raw: true,
      attributes: ['user_id'],
      where: { id }
    })

    if (ctx.session?.id !== 1 && ctx.session?.id !== data?.user_id) {
      return {
        ...response.resError,
        message: '权限不足，请联系超级管理员'
      }
    }

    const num = await ormArticle.count({ where: { label_id: id } })
    if (num !== 0) {
      return {
        ...response.resError,
        message: `此分类关联了${num}篇文章，不能删除`
      }
    }

    {
      const data = await ormLabel.destroy({ where: { id } })
      if (data !== 1) {
        return {
          ...response.resError,
          message: '资源不存在'
        }
      }
    }

    return response.resSuccess
  } catch (err) {
    return handlError(err as Error)
  }
}

/** 分类列表并返回该分类关联的文章数量 */
async function articleNumOfLabel(ctx: ParameterizedContext) {
  try {
    const data = await ormLabel.findAll({
      raw: true,
      attributes: {
        exclude: ['user_id', 'created_at', 'updated_at'],
        include: [
          [
            // 子查询
            literal(`(SELECT COUNT(*) FROM articles WHERE articles.label_id = labels.id)`),
            'num'
          ]
        ]
      }
    })

    return {
      ...response.resSuccess,
      data
    }
  } catch (err) {
    return handlError(err as Error)
  }
}

export {
  getLabelList,
  addLabel,
  updateLabel,
  deleteLabel,
  articleNumOfLabel
}
