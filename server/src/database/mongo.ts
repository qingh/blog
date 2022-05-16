import { MongoClient } from 'mongodb';
const url = "mongodb://localhost:27017"

const client = new MongoClient(url, {
  maxPoolSize: 1,
})

client.addListener('open', () => {
  console.log('mongo open');
})

client.addListener('connectionCreated', () => {
  console.log('mongo connectionCreated');
})

client.addListener('connectionPoolClosed', () => {
  console.log('mongo connectionPoolClosed');
})

client.addListener('error', (err) => {
  console.log('mongo error\n', err);
})

await client.connect()
const db = client.db('2022-05-15')

export { client, db }
