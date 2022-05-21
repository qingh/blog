import { db } from '../../database/mysql.js'
import { response } from '../../utils/index.js'

interface ILabel {
  label: string
}

/** 标签列表 */
async function getLabelList () {
  try {
    const p1 = db.execute('SELECT COUNT(*) AS total FROM labels')
    const p2 = db.execute('SELECT * FROM labels')
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

/** 新增标签 */
async function addLabel (params: ILabel) {
  try {
    if (typeof params.label === 'undefined') {
      return {
        ...response.resError,
        message: `label is required`
      }
    }

    {
      const data = await db.execute(`SELECT * FROM labels WHERE label = '${params.label}'`)
      // @ts-ignore
      if (data[0].length !== 0) {
        return {
          ...response.resError,
          message: '资源已存在'
        }
      }
    }

    const sql = `INSERT INTO labels (label,author,created_at,updated_at) VALUES (?,?,NOW(),NOW())`
    await db.execute(sql, [params.label, 'qingh'])// todo
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

/** 编辑标签 */
async function updateLabel (params: { id: number } & ILabel) {
  try {
    if (typeof params.label === 'undefined' || params.label === '') {
      return {
        ...response.resError,
        message: `labels'name is required`
      }
    }
    {
      const data = await db.execute(`SELECT * FROM labels WHERE label = '${params.label}'`)
      // @ts-ignore
      if (data[0].length !== 0) {
        return {
          ...response.resError,
          message: '资源已存在'
        }
      }
    }

    {
      const data = await db.execute(`SELECT * FROM labels WHERE id = ${params.id}`)
      // @ts-ignore
      if (data[0].length !== 1) {
        return {
          ...response.resError,
          message: '资源不存在'
        }
      }
    }

    const sql = `UPDATE labels SET label = ?,updated_at = NOW() WHERE id = ${params.id}`
    await db.execute(sql, [params.label])
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

/** 删除标签 */
async function deleteLabel (id: number) {
  try {
    const sql = `DELETE FROM labels WHERE id = ${id}`
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

/** 标签列表并返回该标签关联的文章数量 */
async function articleNumOfLabel () {
  try {
    const data = await db.execute(`SELECT id,label,(SELECT COUNT(*) FROM articles WHERE articles.label_id = labels.id) AS num FROM labels`)
    return {
      ...response.resSuccess,
      data: data[0]
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
  getLabelList,
  addLabel,
  updateLabel,
  deleteLabel,
  articleNumOfLabel
}
