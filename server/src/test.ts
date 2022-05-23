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

import Koa from 'koa'
import Router from 'koa-router'

const app = new Koa()
const router = new Router()

app.use(async (ctx, next) => {

})

app.listen(7777)
