import { db } from '../../database/mysql.js'
import { response } from '../../utils/index.js'

interface IUser {
  username: string
  password: string
}

/** 用户列表 */
async function getUserList () {
  try {
    const p1 = db.execute('SELECT COUNT(*) AS total FROM users')
    const p2 = db.execute('SELECT id,username FROM users')
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

export {
  getUserList,
  login
}
