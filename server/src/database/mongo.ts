import { MongoClient } from 'mongodb'
import { mongoConfig } from '../config/index.js'

const client = new MongoClient(mongoConfig.url, {
  // maxPoolSize: 1
})

client.addListener('open', () => {
  console.log('mongo open')
})

client.addListener('connectionCreated', () => {
  console.log('mongo connectionCreated')
})

client.addListener('connectionPoolClosed', () => {
  console.log('mongo connectionPoolClosed')
})

client.addListener('error', (err) => {
  console.log('mongo error\n', err)
})

await client.connect()
const db = client.db('blog')

export { client, db }
