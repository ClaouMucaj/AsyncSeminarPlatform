const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Purchase = sequelize.define('Purchase', {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  seminar_id: { type: DataTypes.INTEGER, allowNull: false },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  timestamps: false,
  uniqueKeys: {
    unique_user_seminar: {
      fields: ['user_id', 'seminar_id']
    }
  }
});

module.exports = Purchase;
