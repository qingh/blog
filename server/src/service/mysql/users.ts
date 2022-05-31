import { ParameterizedContext } from 'koa'
import { Op, literal, Model } from 'sequelize'
import { ormArticle } from './../../model/articles.js'
import { ormLabel } from './../../model/labels.js'
import { response, handlError } from '../../utils/index.js'
import { ormUser } from './../../model/users.js'

/** 用户列表 */
async function getUserList(ctx: ParameterizedContext) {
  const { current = 1, pageSize = 10, id, username } = ctx.query
  const idFilter = id ? { id } : {}
  const usernameFilter = username ? { username: { [Op.like]: `%${username}%` } } : {}
  const mergeFilter = { ...idFilter, ...usernameFilter }
  try {
    const offset = Number(current) * Number(pageSize) - Number(pageSize)
    const data = await ormUser.findAndCountAll({
      where: mergeFilter,
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

/** 登录 */
async function login(ctx: ParameterizedContext) {
  const { username, password } = ctx.request.body
  try {
    if (typeof username === 'undefined' || username === '') {
      return {
        ...response.resError,
        message: `username is required`
      }
    }
    if (typeof password === 'undefined' || password === '') {
      return {
        ...response.resError,
        message: `password is required`
      }
    }
    const data = await ormUser.findAll({
      raw: true,
      where: {
        username, password
      }
    })
    if (data.length !== 1) {
      return {
        ...response.resError,
        message: '用户名或密码错误'
      }
    }

    const { id } = data[0]
    ctx.session!.isLogin = true
    ctx.session!.id = id
    ctx.session!.user = username

    return {
      ...response.resSuccess,
      data: {
        id,
        user: username
      }
    }
  } catch (err) {
    return handlError(err as Error)
  }
}

/* 登出 */
async function logout(ctx: ParameterizedContext) {
  if (ctx.session!.isLogin) {
    ctx.session!.isLogin = false
    ctx.session!.id = undefined
    ctx.session!.user = undefined
  }
  return response.resSuccess
}

/** 添加用户 */
async function addUser(ctx: ParameterizedContext) {
  const { username } = ctx.request.body
  try {
    if (typeof username === 'undefined' || username === '') {
      return {
        ...response.resError,
        message: `username is required`
      }
    }

    if (ctx.session!.id !== 1) { // 超级管理员
      return {
        ...response.resError,
        message: '权限不足，请联系超级管理员'
      }
    }

    const data = await ormUser.findAll({
      raw: true,
      where: {
        username
      }
    })
    if (data.length !== 0) {
      return {
        ...response.resError,
        message: '资源已存在'
      }
    }

    await ormUser.create({
      username, password: '123456', admin: 0
    }, { raw: true })

    return response.resSuccess
  } catch (err) {
    return handlError(err as Error)
  }
}

/** 编辑用户 */
async function updateUser(ctx: ParameterizedContext) {
  const { id = 0, username } = ctx.request.body
  try {
    if (typeof username === 'undefined' || username === '') {
      return {
        ...response.resError,
        message: `username is required`
      }
    }

    if (ctx.session!.id !== 1 && ctx.session!.id !== Number(id)) { // 超级管理员
      return {
        ...response.resError,
        message: '权限不足，请联系超级管理员'
      }
    }

    {
      const data = await ormUser.findAll({
        raw: true,
        where: { id }
      })
      if (data.length !== 1) {
        return {
          ...response.resError,
          message: '资源不存在'
        }
      }
    }

    {
      const data = await ormUser.findAll({
        raw: true,
        where: {
          username
        }
      })
      if (data.length !== 0) {
        return {
          ...response.resError,
          message: '资源已存在'
        }
      }
    }
    await ormUser.update({ username }, { where: { id } })
    return {
      ...response.resSuccess,
      data: {
        username
      }
    }
  } catch (err) {
    return handlError(err as Error)
  }
}

/** 删除用户 */
async function deleteUser(ctx: ParameterizedContext) {
  const { id = 0 } = ctx.params
  try {
    if (ctx.session!.id !== 1) { // 超级管理员
      return {
        ...response.resError,
        message: '权限不足，请联系超级管理员'
      }
    }

    if (ctx.session!.id === Number(id)) {
      return {
        ...response.resError,
        message: '超级管理员不能被删除'
      }
    }

    {
      const num1 = await ormLabel.count({ where: { user_id: id } })
      if (num1 !== 0) {
        return {
          ...response.resError,
          message: `引用户新建了${num1}个分类，不能删除`
        }
      }
      const num2 = await ormArticle.count({ where: { user_id: id } })
      if (num2 !== 0) {
        return {
          ...response.resError,
          message: `引用户新建了${num1}篇文章，不能删除`
        }
      }
    }
    {
      const data = await ormUser.destroy({
        where: { id }
      })
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

export {
  getUserList,
  login,
  logout,
  addUser,
  updateUser,
  deleteUser
}
