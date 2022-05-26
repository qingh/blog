import { Sequelize } from 'sequelize'
import { mysqlConfig } from '../config/index.js'

const { host, database, user: username, password, port } = mysqlConfig
const sequelize = new Sequelize({
  host,
  database,
  username,
  password,
  port,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 300
  },
  timezone: '+08:00'
})
export { sequelize }
