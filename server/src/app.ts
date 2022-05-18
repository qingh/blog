import Koa from 'koa'
import views from 'koa-views'
import json from 'koa-json'
// import onerror from 'koa-onerror';
import bodyparser from 'koa-bodyparser'
import logger from 'koa-logger'
import koaStatic from 'koa-static'
import path from 'path'
import { fileURLToPath } from 'url'
import { router } from './routes/index.js'

const port = 8888
const app = new Koa()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(koaStatic(__dirname + '\\public'))
console.log('###', __dirname + '\\public')

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

// routes
router(app)

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

app.listen(port, () => {
  console.log(`server running at ${port}`)
})
