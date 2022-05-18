import { db } from '../../database/mysql.js'
import { response } from '../../utils/index.js'

interface ILabel {
  name: string
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
    if (typeof params.name === 'undefined') {
      return {
        ...response.resError,
        message: `labels'name is required`
      }
    }
    const sql = `INSERT INTO labels (name,created_at,updated_at) VALUES (?,NOW(),NOW())`
    await db.execute(sql, [params.name])
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
    if (typeof params.name === 'undefined') {
      return {
        ...response.resError,
        message: `labels'name is required`
      }
    }
    const sql = `UPDATE labels SET name = ?,updated_at = NOW() WHERE id = ${params.id}`
    await db.execute(sql, [params.name])
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

export {
  getLabelList,
  addLabel,
  updateLabel,
  deleteLabel
}
