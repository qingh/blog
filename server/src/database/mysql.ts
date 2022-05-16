import mysql from 'mysql2';

const db = mysql.createPool({
  user: 'root',
  password: '123456',
  database: 'blog',
  connectionLimit: 10
  // maxPreparedStatements
})
export {
  db
}