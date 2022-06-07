import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from './index.js'

interface ArticlesAttributes {
  id: number
  label_id: number
  user_id: number
  title: string
  content: string
  browser: number
}

interface ArticlesCreationAttributes extends Optional<ArticlesAttributes, 'id'> { }

interface ArticlesInstance extends Model<ArticlesAttributes, ArticlesCreationAttributes>, ArticlesAttributes { }

export const ormArticle = sequelize.define<ArticlesInstance>('articles', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  label_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  browser: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  timestamps: true,
  freezeTableName: true
})

ormArticle.sync({
  // force: true将创建表,如果表已经存在,则将其首先删除
  alter: true// 检查数据库中表的当前状态(它具有哪些列,它们的数据类型等),然后在表中进行必要的更改以使其与模型匹配.
})
