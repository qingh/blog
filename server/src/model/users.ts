import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from './index.js'

interface UsersAttributes {
  id: number
  username: string
  password: string
  admin: number
}

interface UsersCreationAttributes extends Optional<UsersAttributes, 'id'> { }

interface UsersInstance extends Model<UsersAttributes, UsersCreationAttributes>, UsersAttributes { }

export const ormUser = sequelize.define<UsersInstance>('users', {
  id: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  admin: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
    defaultValue: 0
  }
}, {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  timestamps: true,
  freezeTableName: true
})

ormUser.sync({
  alter: true
})
