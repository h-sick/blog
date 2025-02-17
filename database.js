const Sequelize = require('sequelize');

let sequelize;

// production
// if (process.env.JAWSDB_URL) {
//   sequelize = new Sequelize(process.env.JAWSDB_URL);
// } else {
// local
sequelize = new Sequelize(
  process.env.SEQUELIZE_DATABASE,
  process.env.SEQUELIZE_USER,
  process.env.SEQUELIZE_PASSWORD,
  {
    dialect: 'mysql',
    host: process.env.SEQUELIZE_HOST,
  }
);
// }

module.exports = sequelize;
