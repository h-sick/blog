const Sequelize = require('sequelize');

const sequelize = new Sequelize('blog', 'root', '489625As23!!', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
