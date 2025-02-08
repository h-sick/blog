const User = require('../models/user');
const bcrypt = require('bcrypt');

const saltRounds = 12;

module.exports = {
  getLogin: (req, res, next) => {
    res.render('auth/login', {
      title: 'Login',
    });
  },
  postLogin: (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({ where: { email } })
      .then((user) => {
        if (!user) {
          console.log('User not found');
          return;
        }
        bcrypt
          .compare(password, user.password)
          .then((doMatch) => {
            console.log({ doMatch });
            if (doMatch) {
              req.session.user = user;
              req.session.isLoggedIn = true;
              return req.session.save((err) => {
                console.log(err);
                res.redirect('/');
              });
            } else {
              console.log('Password does not match');
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  postLogout: (req, res, next) => {
    req.session.destroy((err) => {
      console.log(err);
      res.redirect('/');
    });
  },
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
