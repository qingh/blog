import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from './index.js'

interface LabelsAttributes {
  id: number
  label: string
  user_id: number
}

interface LabelsCreationAttributes extends Optional<LabelsAttributes, 'id'> { }

interface LabelsInstance extends Model<LabelsAttributes, LabelsCreationAttributes>, LabelsAttributes { }

export const ormLabel = sequelize.define<LabelsInstance>('labels', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  timestamps: true,
  freezeTableName: true
})

ormLabel.sync({
  alter: true
})
