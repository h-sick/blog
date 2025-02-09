module.exports = {
  setUser: (req, res, next) => {
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
    next();
  },
  isLoggedIn: (req, res, next) => {
    if (!req.session.isLoggedIn) {
      return res.redirect('/auth/login');
    }
    next();
  },
};
