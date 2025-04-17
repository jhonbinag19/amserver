const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const Workflow = sequelize.define('Workflow', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  organization_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  trigger_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  trigger_fields: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  action_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  action_fields: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

const Trigger = sequelize.define('Trigger', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fields: {
    type: DataTypes.JSONB,
    allowNull: false
  }
});

const Action = sequelize.define('Action', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fields: {
    type: DataTypes.JSONB,
    allowNull: false
  }
});

// Define associations
Workflow.belongsTo(Trigger, { foreignKey: 'trigger_id', as: 'trigger' });
Workflow.belongsTo(Action, { foreignKey: 'action_id', as: 'action' });

module.exports = {
  Workflow,
  Trigger,
  Action
}; 