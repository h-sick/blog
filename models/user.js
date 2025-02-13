const bcrypt = require('bcrypt');

const Sequelize = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  // isVerified: {
  //   type: Sequelize.BOOLEAN,
  //   defaultValue: false
  // },
  // verificationToken: {
  //   type: Sequelize.STRING,
  // },
  // resetPasswordToken: {
  //   type: Sequelize.STRING,
  // },
  // resetPasswordExpires: {
  //   type: Sequelize.DATE,
  // },
  loginAttempts: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  lockUntil: {
    type: Sequelize.DATE,
  },
});

module.exports = User;
