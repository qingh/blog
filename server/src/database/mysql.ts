import mysql from 'mysql2/promise'
import { mysqlConfig } from '../config/index.js'

export const db = mysql.createPool(mysqlConfig)
