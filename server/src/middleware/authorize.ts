import { ParameterizedContext, Next } from 'koa'
import { baseUrl } from '../config/index.js'
export function authorize() {
  return async (ctx: ParameterizedContext, next: Next) => {
    // 不需要鉴权的接口
    const noUnauthorized = [
      `${baseUrl}/users/login`,
      `${baseUrl}/users/logout`,
      `${baseUrl}/comments/add`,
      `${baseUrl}/articles/list`,
      `${baseUrl}/labels/articleNumOfLabel`,
      `${baseUrl}/articles/id/context`,
      `${baseUrl}/articles/articlesDetailAndCommentList/id`
    ]

    const url = ctx.url.split('?')[0]
    const reg1 = /\/api\/v1\/articles\/\d+\/context/
    const reg2 = /\/api\/v1\/articles\/articlesDetailAndCommentList\/\d+/
    if (ctx.session!.isLogin || noUnauthorized.includes(url) || reg1.test(url) || reg2.test(url) || url.startsWith('/assets/images')) {
      await next()
    } else {
      ctx.status = 401
    }
  }
}
