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
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '123456',
    database: 'blog'
  },
  production: {
    host: '104.171.168.137',
    user: 'qingh',
    port: 3306,
    password: 'c4661ece7e8210eea96535abd106304a',
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
