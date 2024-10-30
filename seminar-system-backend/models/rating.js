const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Rating = sequelize.define('Rating', {
  user_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  seminar_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  rating: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  }
}, {
  timestamps: false, // Disable timestamps
  uniqueKeys: {
    unique_user_seminar: {
      fields: ['user_id', 'seminar_id']
    }
  }
});

module.exports = Rating;
