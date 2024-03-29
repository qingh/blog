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
import { port, db } from './config/index.js'
import { cors, authorize } from './middleware/index.js'

const app = new Koa()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(cors())
app.use(authorize())

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
