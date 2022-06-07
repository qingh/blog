interface MYSQLDBMSG {
  host: string,
  user: string,
  port: number,
  password: string,
  database: string
}
interface MYSQLDB {
  development: MYSQLDBMSG
  production: MYSQLDBMSG
}

interface MONGODBMSG {
  url: string
}
interface MONGODB {
  development: MONGODBMSG
  production: MONGODBMSG
}

const port = 8888
const baseUrl = '/api/v1'
const env = <'development' | 'production'>process.env.NODE_ENV
const db = process.env.db
const mysqldb: MYSQLDB = {
  development: {
    host: '172.17.0.1', // 此处重点注意
    user: 'root',
    port: 3306,
    password: '123456',
    database: 'blog'
  },
  production: {
    // host: '42.192.188.150',
    host: '172.17.0.1', // 如果使用docker启动mysql，此处就要写这个地址
    user: 'qingh',
    port: 3306,
    password: '654321',
    database: 'blog'
  }
}

const mongodb: MONGODB = {
  development: {
    url: 'mongodb://localhost:27017'
  },
  production: {
    url: 'mongodb://104.171.168.137:27017'
  }
}

const mysqlConfig = mysqldb[env]
const mongoConfig = mongodb[env]

export {
  port,
  db,
  baseUrl,
  mysqlConfig,
  mongoConfig
}
