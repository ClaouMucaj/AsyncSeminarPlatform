const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize('seminar_system', 'root', 'admin', {
  host: 'localhost',
  dialect: 'mysql'
});

// Test the connection
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

module.exports = sequelize;
