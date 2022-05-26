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
import { sequelize } from 'model/index.js'
import { ormArticle } from './model/articles.js'
import { ormComment } from './model/comments.js'
import { ormLabel } from './model/labels.js'
import { ormUser } from './model/users.js'

const app = new Koa()

app.use(async (ctx, next) => {
  /* myTable.sync()
  const data = await myTable.create({
    label_id: 1,
    title: 'aaa',
    content: 'bbb',
    author: 'qingh',
    browser: 12
  })
  console.log('data==>', data) */
  /* const data = await ormArticle.findAll({
    where: {
      id: 136
    }
  }) */
  ormArticle.findAll({
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT label FROM labels WHERE id = articles.label_id 
          )`), 'label'
        ]
      ]
    },
    where: {
      id: 136
    }
  }).then(res => {
    console.log('res', res)
  }).catch(err => {
    console.log('err', err)
  })

  ctx.body = 'ok'
})

app.listen(7777)
