const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

const User = require('../models/user');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup', authController.postSignup);

module.exports = router;

module.exports.authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findByPk(req.session.user.id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.isLoggedIn = (req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.userId = req.session.user?.id;
  next();
};
