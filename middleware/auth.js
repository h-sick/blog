module.exports = {
  isLoggedIn: (req, res, next) => {
    if (!req.session.isLoggedIn) {
      return res.redirect('/auth/login');
    }
    next();
  },
};
