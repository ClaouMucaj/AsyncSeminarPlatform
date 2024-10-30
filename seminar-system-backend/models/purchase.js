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

// In models/purchase.js or the Purchase model file

module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define('Purchase', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seminar_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true, // This field is nullable for a user to rate once
    },
  });

  return Purchase;
};


module.exports = Purchase;
