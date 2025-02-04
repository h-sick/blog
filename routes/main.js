const path = require('path');

const express = require('express');

const mainController = require('../controllers/main');

const router = express.Router();

const User = require('../models/user');

router.get('/', mainController.getIndex);

module.exports = router;
module.exports.userMiddleware = (req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
};
