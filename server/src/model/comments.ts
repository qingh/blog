import { DataTypes } from 'sequelize'
import { sequelize } from './index.js'

export const ormComment = sequelize.define('comments', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  article_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nick_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  timestamps: true,
  freezeTableName: true
})

ormComment.sync({
  alter: true
})
