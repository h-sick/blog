const User = require('../models/user');

module.exports = {
  setUser: (req, res, next) => {
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
  },
  setLocals: (req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.userId = req.session.user?.id;
    res.locals.path = req.path;
    next();
  },
  isLoggedIn: (req, res, next) => {
    if (!req.session.isLoggedIn) {
      return res.redirect('/auth/login');
    }
    next();
  },
};
