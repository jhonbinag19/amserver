const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resource: {
    type: DataTypes.STRING,
    allowNull: false
  },
  action: {
    type: DataTypes.ENUM('create', 'read', 'update', 'delete', 'manage'),
    allowNull: false
  }
}, {
  tableName: 'permissions',
  timestamps: true
});

module.exports = Permission; 