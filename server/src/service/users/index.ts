import { db } from '../../database/mysql.js'
import { response } from '../../utils/index.js'

interface IAddUser {
  username: string
}
interface IUser {
  username: string
  password: string
}


/** 用户列表 */
async function getUserList () {
  try {
    const p1 = db.execute('SELECT COUNT(*) AS total FROM users')
    const p2 = db.execute('SELECT id,username,created_at,admin FROM users')
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

/** 登录 */
async function login (params:IUser) {
  try {
    if (typeof params.username === 'undefined') {
      return {
        ...response.resError,
        message: `username is required`
      }
    }
    if (typeof params.password === 'undefined') {
      return {
        ...response.resError,
        message: `password is required`
      }
    }
    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`
    const data = await db.execute(sql, [params.username, params.password])
    // @ts-ignore: Unreachable code error
    if (data[0].length) {
      return {
        ...response.resSuccess
      }
    } else {
      return {
        ...response.resError,
        message: '用户名或密码错误'
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

/** 添加用户 */
async function addUser (params:IAddUser) {
  try {
    if (typeof params.username === 'undefined' || params.username === '') {
      return {
        ...response.resError,
        message: `username is required`
      }
    }

    {
      const data = await db.execute(`SELECT * FROM users WHERE username = '${params.username}'`)
      // @ts-ignore
      if (data[0].length !== 0) {
        return {
          ...response.resError,
          message: '资源已存在'
        }
      }
    }

    const sql = `INSERT INTO users (username,password,admin,created_at,updated_at) VALUES (?,?,?,NOW(),NOW())`
    await db.execute(sql, [params.username, '123', 0])
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

/** 编辑用户 */
async function updateUser (params: { id: number } & IAddUser) {
  try {
    if (typeof params.username === 'undefined' || params.username === '') {
      return {
        ...response.resError,
        message: `username is required`
      }
    }

    if (params.id === 1) { // 超级管理员
      return {
        ...response.resError,
        message: '权限不足'
      }
    }

    {
      const data = await db.execute(`SELECT * FROM users WHERE username = '${params.username}'`)
      // @ts-ignore
      if (data[0].length !== 0) {
        return {
          ...response.resError,
          message: '资源已存在'
        }
      }
    }

    const data = await db.execute(`SELECT * FROM users WHERE id = ${params.id}`)
    // @ts-ignore
    if (data[0].length !== 1) {
      return {
        ...response.resError,
        message: '资源不存在'
      }
    }
    const sql = `UPDATE users SET username = ?,updated_at = NOW() WHERE id = ${params.id}`
    await db.execute(sql, [params.username])
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

/** 删除用户 */
async function deleteUser (id: number) {
  try {
    if (id === 1) { // 超级管理员
      return {
        ...response.resError,
        message: '权限不足'
      }
    }

    const sql = `DELETE FROM users WHERE id = ${id}`
    const data = await db.execute(sql)
    // @ts-ignore
    if (data[0].affectedRows === 0) {
      return {
        ...response.resError,
        message: '资源不存在'
      }
    }

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

export {
  getUserList,
  login,
  addUser,
  updateUser,
  deleteUser
}
