/* import { createSecureServer } from 'http2'
import { readFileSync, createReadStream, readFile } from 'fs'

createSecureServer(({
  key: readFileSync('./dist/certificate/localhost-privkey.pem'),
  cert: readFileSync('./dist/certificate/localhost-cert.pem')
}), (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  if (req.url === '/reg') {
    if (req.method === 'POST') {
      res.setHeader('set-cookie', ['user=qingh2; SameSite=None; Secure', `age=30; max-age=1000; SameSite=None; Secure`])
      const body: any[] = []
      req.on('data', chunk => {
        body.push(chunk)
      })

      req.on('end', () => {
        console.log(Buffer.concat(body).toString())
        res.end(JSON.stringify({
          code: 1,
          msg: 'ok'
        }))
      })
    } else if (req.method === 'GET') {
      res.end('reg2')
    }
  } else if (req.url === '/') {
    createReadStream('./dist/index.html').pipe(res)
  }
}).listen(7777) */

// import { createSecureServer } from 'http2'
import { createServer } from 'https'
import { readFileSync } from 'fs'
import Koa from 'koa'
import Router from 'koa-router'
import session from 'koa-session'
const app = new Koa()
const router = new Router()

router.prefix(`/test`)

app.keys = ['some secret hurr']
const CONFIG = {
  key: 'koa.sess', /** (string) cookie key (default is koa.sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false) */
  secure: true, /** (boolean) secure cookie */
  sameSite: undefined /** (string) session cookie sameSite options (default undefined, don't set it) */
}

app.use(session(CONFIG, app))

app.use(router.routes()).use(router.allowedMethods())

router.get('/', (ctx, next) => {
  if (ctx.path === '/favicon.ico') return
  let n = ctx.session!.views || 0
  ctx.session!.views = ++n
  ctx.body = n + ' views'
})

router.get('/query', (ctx, next) => {
  console.log(ctx.session!.views)
  if (ctx.session!.views) {
    ctx.body = '登录了'
  } else {
    ctx.body = '未登录'
  }
})

createServer({
  key: readFileSync('./dist/certificate/localhost-privkey.pem'),
  cert: readFileSync('./dist/certificate/localhost-cert.pem')
  // ALPNProtocols: true
  // allowHTTP1: true
}, app.callback()).listen(7777)
