const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('teacher', 'student'), allowNull: false }
}, {
  timestamps: false // Disable automatic creation of createdAt and updatedAt
});

module.exports = User;
