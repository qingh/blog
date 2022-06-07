import { ParameterizedContext, Next } from 'koa'
export function cors() {
  return async (ctx: ParameterizedContext, next: Next) => {
    const origin = ctx.header.origin!
    const aOrigin = [
      'http://localhost:3000', // client
      'http://localhost:3001', // admin
      'http://42.192.188.150'
    ]
    if (aOrigin.includes(origin)) {
      ctx.res.setHeader('Access-Control-Allow-Origin', origin)
      ctx.res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      ctx.res.setHeader('Access-Control-Allow-Methods', 'PATCH,DELETE')
      ctx.res.setHeader('Access-Control-Allow-Credentials', 'true')
    }
    if (ctx.method === 'OPTIONS') {
      ctx.body = ''
      return
    }
    await next()
  }
}
