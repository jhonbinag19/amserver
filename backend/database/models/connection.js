const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const Connection = sequelize.define('Connection', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  organization_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  integration_type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['flodesk', 'gohighlevel', 'stripe']]
    }
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['api_key', 'api_key_secret', 'oauth']]
    }
  },
  api_key: {
    type: DataTypes.STRING,
    allowNull: true
  },
  api_secret: {
    type: DataTypes.STRING,
    allowNull: true
  },
  access_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  refresh_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  token_expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'disconnected',
    validate: {
      isIn: [['connected', 'disconnected', 'error']]
    }
  },
  last_sync: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'connections',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['organization_id', 'integration_type']
    }
  ]
});

module.exports = Connection; 