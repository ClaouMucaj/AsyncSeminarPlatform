const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const User = require('./user');

const Seminar = sequelize.define('Seminar', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  created_by: { type: DataTypes.INTEGER, allowNull: false },
  exercises: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  duration: { type: DataTypes.FLOAT, allowNull: false }, // Duration in hours
  difficulty: { type: DataTypes.ENUM('beginner', 'intermediate', 'expert'), allowNull: false },
  preview_image: { type: DataTypes.STRING, allowNull: true }, // URL to the preview image
  price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 }, // Price of the seminar
  rating: { type: DataTypes.FLOAT, defaultValue: 0 }, // Average rating
  rating_count: { type: DataTypes.INTEGER, defaultValue: 0 }, // Number of ratings
}, {
  timestamps: false
});

User.hasMany(Seminar, { foreignKey: 'created_by' });
Seminar.belongsTo(User, { foreignKey: 'created_by' });

module.exports = Seminar;
