const User = require('../models/user');
const bcrypt = require('bcrypt');

const saltRounds = 12;

module.exports = {
  getSignup: (req, res, next) => {
    res.render('auth/signup', {
      title: 'Signup',
    });
  },
  postSignup: (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({ where: { email } })
      .then((user) => {
        if (user) {
          console.log('User already exists');
          return;
        }
        // Hash the password
        bcrypt
          .hash(password, saltRounds)
          .then((hashedPassword) => {
            User.create({
              email,
              password: hashedPassword,
            }).then(() => {
              res.redirect('/');
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
