/* import { createSecureServer } from 'http2'
import { readFileSync } from 'fs'

 createSecureServer((
  {
    key: readFileSync('./dist/certificate/localhost-privkey.pem'),
    cert: readFileSync('./dist/certificate/localhost-cert.pem')
  }
), (req, res) => {
  if (req.url === '/') {
    res.setHeader('set-cookie', 'user=qingh')
    res.end('ok')
  } else if (req.url === '/list') {
    res.end('list')
  }
}).listen(5555) */

import { createServer } from 'http'
import { createHmac } from 'crypto'

// blue.GsozM+jlNgjF/jEImtfqRmRyd3gZ7wJAa88FoBjjGaQ;

createServer((req, res) => {
  if (req.url === '/') {
    // res.setHeader('set-cookie', 'user=qingh; signed:true')
    // 对cookie签名
    const secret = 'wesdfw4r34tf'
    const val = 'blue'
    const data = val + '.' + createHmac('sha256', secret)
      .update(val)
      .digest('base64')
      .replace(/=+$/, '')

    res.setHeader('set-cookie', [
      `user=${data}; max-age=${60 * 60 * 24}`
    ])
    res.end('ok')
  } else if (req.url === '/list') {
    res.end('list')
  }
}).listen(5555)
