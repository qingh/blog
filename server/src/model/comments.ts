import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from './index.js'

interface CommentsAttributes {
  id: number
  article_id: number
  nick_name: string
  comment: string
  avatar: string
}

interface CommentsCreationAttributes extends Optional<CommentsAttributes, 'id'> { }

interface CommentsInstance extends Model<CommentsAttributes, CommentsCreationAttributes>, CommentsAttributes { }

export const ormComment = sequelize.define<CommentsInstance>('comments', {
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
