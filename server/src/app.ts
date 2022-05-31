import Koa from 'koa'
import views from 'koa-views'
import json from 'koa-json'
import bodyparser from 'koa-bodyparser'
import session from 'koa-session'
import logger from 'koa-logger'
import serve from 'koa-static'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { router } from './routes/index.js'
import { port, db, baseUrl } from './config/index.js'

const app = new Koa()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 跨域设置
app.use(async (ctx, next) => {
  const origin = ctx.header.origin!
  const aOrigin = [
    'http://localhost:3000', // client
    'http://localhost:3001', // admin
    'http://121.41.3.33'
  ]
  if (aOrigin.includes(origin)) {
    ctx.res.setHeader('Access-Control-Allow-Origin', origin)
    ctx.res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    ctx.res.setHeader('Access-Control-Allow-Methods', 'PATCH,DELETE')
    ctx.res.setHeader('Access-Control-Allow-Credentials', 'true')
  }
  if (ctx.method === 'OPTIONS') {
    await next()
  } else {
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
})
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(serve(resolve(__dirname + '/public')))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))
// logger
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.keys = ['some secret hurr']
const CONFIG = {
  key: 'blog', /** (string) cookie key (default is koa.sess) */
  maxAge: 20 * 60 * 1000, // 20分钟
  autoCommit: true, /** 自动提交session */
  overwrite: true, /** 是否覆盖同名cookie */
  httpOnly: true, /** 限制脚本操作cookie */
  signed: true, /** 是否对cookie进行签名 */
  rolling: true, /** 是否每次响应时刷新Session的有效期 */
  renew: false, /** 是否在Session快过期时刷新Session的有效期 */
  secure: false, /** 是否只通过HTTPS协议访问 */
  sameSite: undefined /** 同站 */
}

app.use(session(CONFIG, app))

// routes
router(app)

app.listen(port, () => {
  console.log(JSON.stringify({
    port,
    db,
    env: process.env.NODE_ENV
  }))
})
