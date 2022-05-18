import mysql from 'mysql2/promise'

export const db = mysql.createPool({
  user: 'root',
  password: '123456',
  database: 'blog'
})
