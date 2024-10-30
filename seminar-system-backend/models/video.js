const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Seminar = require('./seminar');

const Video = sequelize.define('Video', {
  url: { type: DataTypes.STRING, allowNull: false },
  seminar_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  timestamps: false // Disable automatic creation of createdAt and updatedAt
});

Seminar.hasMany(Video, { foreignKey: 'seminar_id' });
Video.belongsTo(Seminar, { foreignKey: 'seminar_id' });

module.exports = Video;
