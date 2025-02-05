module.exports = {
  getSignup: (req, res, next) => {
    res.render('auth/signup', {
      title: 'Signup',
    });
  },
};
